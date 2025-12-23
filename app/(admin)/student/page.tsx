'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, Select, SelectItem, Pagination, Spinner, Chip } from '@heroui/react';

interface Student {
  id: string;
  name: string;
  expLevel: number;
  expPoints: number;
  expTotalInPoints: number;
  averageScore: number;
  classId: number;
  className: string;
  levelId: number;
  levelName: string;
  levelKkm: number;
}

interface ClassStat {
  classId: number;
  className: string;
  userCount: number;
}

interface ApiResponse {
  success: boolean;
  data: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  classStats: ClassStat[];
  filters: {
    search?: string;
    levelId?: number;
    classId?: number;
  };
}

export default function StudentPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [classStats, setClassStats] = useState<ClassStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Available options
  interface ClassOption {
    classId: number;
    name: string;
  }
  interface LevelOption {
    id: number;
    name: string;
  }
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [levels, setLevels] = useState<LevelOption[]>([]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      if (search) params.append('search', search);
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedLevel) params.append('levelId', selectedLevel);

      const response = await fetch(`/api/admin/student?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setStudents(data.data);
        setClassStats(data.classStats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      // Fetch classes
      const classResponse = await fetch('/api/users/class');
      const classData = await classResponse.json();
      if (classData.success) {
        setClasses(classData.data);
      }

      // Fetch levels
      const levelResponse = await fetch('/api/users/level');
      const levelData = await levelResponse.json();
      if (levelData.success) {
        setLevels(levelData.data);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [pagination.page, search, selectedClass, selectedLevel]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchStudents();
  };

  const handleReset = () => {
    setSearch('');
    setSelectedClass('');
    setSelectedLevel('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getExpLevelColor = (expLevel: number) => {
    if (expLevel >= 80) return 'success';
    if (expLevel >= 60) return 'warning';
    if (expLevel >= 40) return 'primary';
    return 'danger';
  };

  return (
    <DashboardLayout title="Daftar Siswa" description="Kelola dan monitor progress siswa">
      <div className="space-y-6">
        {/* Class Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {classStats.map((stat) => (
            <Card key={stat.classId} className="shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{stat.className}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.userCount}</p>
                    <p className="text-xs text-gray-500">Siswa terdaftar</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input placeholder="Masukkan nama siswa..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
              </div>
              <div className="w-full md:w-48">
                <Select placeholder="Semua Kelas" selectedKeys={selectedClass ? [selectedClass] : []} onChange={(e) => setSelectedClass(e.target.value)}>
                  {classes.map((cls) => (
                    <SelectItem key={cls.classId.toString()}>{cls.name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select placeholder="Semua Level" selectedKeys={selectedLevel ? [selectedLevel] : []} onChange={(e) => setSelectedLevel(e.target.value)}>
                  {levels.map((level) => (
                    <SelectItem key={level.id.toString()}>{level.name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button color="primary" onPress={handleSearch}>
                  Filter
                </Button>
                <Button variant="bordered" onPress={handleReset}>
                  Reset
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Students Table */}
        <Card className="shadow-sm">
          <CardBody className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <Table aria-label="Daftar Siswa">
                  <TableHeader>
                    <TableColumn>NAMA</TableColumn>
                    <TableColumn>KELAS</TableColumn>
                    <TableColumn>LEVEL</TableColumn>
                    <TableColumn>EXP LEVEL</TableColumn>
                    <TableColumn>AVG SCORE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>AKSI</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const excessExpLevel = student.expLevel > student.expTotalInPoints ? student.expTotalInPoints : student.expLevel;
                      let percetage = parseFloat(((student.expLevel / student.expTotalInPoints) * 100).toFixed(1));
                      if (percetage > 100) {
                        percetage = 100;
                      }
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">{student.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{student.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip variant="flat" color="default">
                              {student.className}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Chip variant="flat" color="secondary">
                              {student.levelName}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Chip variant="flat" color={getExpLevelColor(student.expLevel)} size="sm">
                                {percetage}%
                              </Chip>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    student.expLevel >= 80 ? 'bg-green-500' : student.expLevel >= 60 ? 'bg-yellow-500' : student.expLevel >= 40 ? 'bg-blue-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${percetage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-blue-600">{student.averageScore.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <Chip variant="flat" color={student.averageScore >= student.levelKkm ? 'success' : 'warning'}>
                              {student.averageScore >= student.levelKkm ? 'Aktif' : 'Perlu Perhatian'}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" color="primary" variant="flat" onPress={() => router.push(`/student/${student.id}`)}>
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center p-4 border-t">
                    <span className="text-sm text-gray-500">
                      Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} siswa
                    </span>
                    <Pagination
                      total={pagination.totalPages}
                      page={pagination.page}
                      onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                      showControls
                      showShadow
                      color="primary"
                    />
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
