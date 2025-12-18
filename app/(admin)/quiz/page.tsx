'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { PlusIcon, MagnifyingGlassIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Quiz {
  id: number;
  title: string;
  description?: string;
  duration: number;
  status: 'DRAFT' | 'PUBLISHED';
  level: {
    id: number;
    name: string;
    order: number;
  };
  class: {
    classId: number;
    name: string;
  };
  _count: {
    questions: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface QuizData {
  data: Quiz[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Class {
  classId: number;
  name: string;
}

interface Level {
  id: number;
  name: string;
  order: number;
  kkm: number;
}

export default function QuizPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [deleteQuizId, setDeleteQuizId] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch classes and levels for filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [classRes, levelRes] = await Promise.all([fetch('/api/users/class'), fetch('/api/users/level')]);

        if (classRes.ok && levelRes.ok) {
          const classData = await classRes.json();
          const levelData = await levelRes.json();
          setClasses(classData.data || []);
          setLevels(levelData.data || []);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedLevel) params.append('levelId', selectedLevel);

      const response = await fetch(`/api/admin/quiz?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setQuizzes(result.data.data || []);
        setPagination(result.pagination);
      } else {
        console.error('Failed to fetch quizzes:', result.message);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quizzes when filters or pagination change
  useEffect(() => {
    fetchQuizzes();
  }, [pagination.page, selectedClass, selectedLevel, searchTerm]);

  // Handle search
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Handle delete quiz
  const handleDeleteQuiz = async () => {
    if (!deleteQuizId) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/admin/quiz?id=${deleteQuizId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchQuizzes();
        setDeleteQuizId(null);
      } else {
        console.error('Failed to delete quiz:', result.message);
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'default';
      default:
        return 'default';
    }
  };

  // Status text mapping
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Dipublikasi';
      case 'DRAFT':
        return 'Draft';
      default:
        return status;
    }
  };

  if (status === 'loading') {
    return (
      <DashboardLayout title="Bank Soal">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Bank Soal">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-end items-center">
          <Button as={Link} href="/quiz/new" color="primary" startContent={<PlusIcon className="w-4 h-4" />}>
            Buat Soal Baru
          </Button>
        </div>

        {/* Filters Card */}
        <Card className="shadow-sm">
          <CardBody className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Cari quiz..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  placeholder="Semua Kelas"
                  selectedKeys={selectedClass ? [selectedClass] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setSelectedClass(key || '');
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  {classes.map((cls) => (
                    <SelectItem key={cls.classId.toString()}>{cls.name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select
                  placeholder="Semua Level"
                  selectedKeys={selectedLevel ? [selectedLevel] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setSelectedLevel(key || '');
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  {levels.map((level) => (
                    <SelectItem key={level.id.toString()}>{level.name}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button color="primary" onPress={handleSearch}>
                  Filter
                </Button>
                <Button
                  variant="bordered"
                  onPress={() => {
                    setSearchTerm('');
                    setSelectedClass('');
                    setSelectedLevel('');
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Table Card */}
        <Card className="shadow-sm">
          <CardBody className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <Table aria-label="Daftar Quiz">
                  <TableHeader>
                    <TableColumn>QUIZ</TableColumn>
                    <TableColumn>KELAS</TableColumn>
                    <TableColumn>LEVEL</TableColumn>
                    <TableColumn>DURASI</TableColumn>
                    <TableColumn>SOAL</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>AKSI</TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent={
                      <div className="text-center py-20">
                        <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Belum ada quiz</p>
                        <p className="text-gray-400 text-sm">Buat quiz pertama Anda untuk memulai</p>
                      </div>
                    }
                  >
                    {quizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 line-clamp-1">{quiz.title}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip variant="flat" color="default">
                            {quiz.class.name}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip variant="flat" color="secondary">
                            {quiz.level.name}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{quiz.duration} menit</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-blue-600">{quiz._count.questions} soal</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip variant="flat" color={getStatusColor(quiz.status)} size="sm">
                            {getStatusText(quiz.status)}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button isIconOnly size="sm" variant="light" className="data-[hover=true]:bg-gray-100">
                                <EllipsisVerticalIcon className="w-4 h-4" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                              <DropdownItem key="view" startContent={<EyeIcon className="w-4 h-4" />} onPress={() => router.push(`/quiz/${quiz.id}`)}>
                                Lihat Detail
                              </DropdownItem>
                              <DropdownItem key="edit" startContent={<PencilIcon className="w-4 h-4" />} onPress={() => router.push(`/quiz/${quiz.id}/edit`)}>
                                Edit Quiz
                              </DropdownItem>
                              <DropdownItem
                                key="delete"
                                color="danger"
                                startContent={<TrashIcon className="w-4 h-4" />}
                                onPress={() => {
                                  setDeleteQuizId(quiz.id);
                                  onOpen();
                                }}
                              >
                                Hapus Quiz
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-between items-center p-4 border-t">
                    <span className="text-sm text-gray-500">
                      Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} quiz
                    </span>
                    <Pagination total={pagination.pages} page={pagination.page} onChange={handlePageChange} showControls showShadow color="primary" />
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Konfirmasi Hapus Quiz</ModalHeader>
                <ModalBody>
                  <p>Apakah Anda yakin ingin menghapus quiz ini?</p>
                  <p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan dan akan menghapus semua soal yang terkait.</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Batal
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => {
                      handleDeleteQuiz();
                      onClose();
                    }}
                    isLoading={deleteLoading}
                  >
                    Ya, Hapus
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
