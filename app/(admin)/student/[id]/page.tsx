'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardBody, Button, Chip, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Progress } from '@heroui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface StudentDetail {
  name: string;
  username: string;
  email: string;
  class: {
    classId: number;
    name: string;
  };
  level: {
    id: number;
    name: string;
    kkm: number;
    expTotalInPoints: number;
  };
  expLevel: number;
  expPoints: number;
  quizzes: Array<{
    id: number;
    title: string;
    description: string;
    classId: number;
    levelId: number;
    status: string;
    bestScore: number | null;
    currentScore: number | null;
    pastScore: number | null;
  }>;
}

interface ApiResponse {
  success: boolean;
  data: StudentDetail;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const studentId = params?.id as string;

  const fetchStudentDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/student/${studentId}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setStudent(data.data);
      }
    } catch (error) {
      console.error('Error fetching student detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentDetail();
    }
  }, [studentId]);

  const getScoreColor = (score: number | null, kkm: number) => {
    if (!score) return 'default';
    if (score >= kkm) return 'success';
    if (score >= kkm * 0.8) return 'warning';
    return 'danger';
  };

  const getExpProgressPercentage = () => {
    if (!student || !student.level?.expTotalInPoints) return 0;
    return Math.min((student.expLevel / student.level.expTotalInPoints) * 100, 100);
  };

  const calculateQuizStats = () => {
    if (!student || !student.quizzes.length) {
      return { completed: 0, passed: 0, averageScore: 0 };
    }

    const completed = student.quizzes.filter((quiz) => quiz.bestScore !== null).length;
    const passed = student.quizzes.filter((quiz) => quiz.bestScore !== null && quiz.bestScore >= (student.level?.kkm || 0)).length;

    const totalScore = student.quizzes.reduce((sum, quiz) => sum + (quiz.bestScore || 0), 0);
    const averageScore = completed > 0 ? totalScore / completed : 0;

    return { completed, passed, averageScore };
  };

  const quizStats = calculateQuizStats();

  if (loading) {
    return (
      <DashboardLayout title="Detail Siswa" description="Informasi lengkap siswa dan progress">
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout title="Detail Siswa" description="Siswa tidak ditemukan">
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Siswa tidak ditemukan</p>
          <Button color="primary" onPress={() => router.back()}>
            Kembali
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Detail Siswa: ${student.name}`} description="Informasi lengkap siswa dan progress">
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="bordered" startContent={<ArrowLeftIcon className="w-4 h-4" />} onPress={() => router.back()} className="mb-4">
          Kembali ke Daftar Siswa
        </Button>

        {/* Student Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Info Card */}
          <Card className="shadow-sm lg:col-span-2">
            <CardBody className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-2xl">{student.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{student.name}</h2>
                  <p className="text-gray-600 mb-4">@{student.username}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Kelas</label>
                      <div className="mt-1">
                        <Chip variant="flat" color="default" size="lg">
                          {student.class.name}
                        </Chip>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Level</label>
                      <div className="mt-1">
                        <Chip variant="flat" color="secondary" size="lg">
                          {student.level.name}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Experience Progress Card */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <div className="text-center">
                <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Experience Level</h3>
                <p className="text-3xl font-bold text-purple-600 mb-2">{student.expLevel?.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-500 mb-4">/ {student.level?.expTotalInPoints?.toLocaleString() || '0'} XP</p>
                <Progress value={getExpProgressPercentage()} color="secondary" size="lg" className="mb-2" />
                <p className="text-sm text-gray-600">{getExpProgressPercentage().toFixed(1)}% Complete</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quiz Diselesaikan</h3>
                  <p className="text-2xl font-bold text-gray-900">{quizStats.completed}</p>
                  <p className="text-xs text-gray-500">dari {student.quizzes.length} quiz</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quiz Lulus</h3>
                  <p className="text-2xl font-bold text-gray-900">{quizStats.passed}</p>
                  <p className="text-xs text-gray-500">≥ {student.level?.kkm || 0} poin</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rata-rata Skor</h3>
                  <p className="text-2xl font-bold text-gray-900">{quizStats.averageScore.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">dari quiz selesai</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quiz Progress Table */}
        <Card className="shadow-sm">
          <CardBody className="p-0">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Progress Quiz</h3>
              <p className="text-sm text-gray-600">Detail progress untuk setiap quiz</p>
            </div>

            {student.quizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada quiz tersedia untuk level ini</p>
              </div>
            ) : (
              <Table aria-label="Quiz Progress">
                <TableHeader>
                  <TableColumn>QUIZ</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>SKOR TERBAIK</TableColumn>
                  <TableColumn>SKOR SAAT INI</TableColumn>
                  <TableColumn>SKOR SEBELUMNYA</TableColumn>
                  <TableColumn>HASIL</TableColumn>
                </TableHeader>
                <TableBody>
                  {student.quizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{quiz.title}</div>
                          <div className="text-sm text-gray-500">{quiz.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip variant="flat" color={quiz.bestScore !== null ? 'success' : 'default'} size="sm">
                          {quiz.bestScore !== null ? 'Selesai' : 'Belum Dimulai'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {quiz.bestScore !== null ? (
                          <Chip variant="flat" color={getScoreColor(quiz.bestScore, student.level?.kkm || 0)} size="sm">
                            {quiz.bestScore}
                          </Chip>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {quiz.currentScore !== null ? <span className="font-medium text-gray-900">{quiz.currentScore}</span> : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        {quiz.pastScore !== null ? <span className="font-medium text-gray-900">{quiz.pastScore}</span> : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        {quiz.bestScore !== null ? (
                          <Chip variant="flat" color={quiz.bestScore >= (student.level?.kkm || 0) ? 'success' : 'danger'} size="sm">
                            {quiz.bestScore >= (student.level?.kkm || 0) ? 'LULUS' : 'TIDAK LULUS'}
                          </Chip>
                        ) : (
                          <Chip variant="flat" color="default" size="sm">
                            BELUM DIMULAI
                          </Chip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
