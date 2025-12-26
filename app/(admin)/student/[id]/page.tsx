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
  badges: Array<{
    id: number;
    name: string;
    expPoints: number;
    isAwarded: boolean;
    awardedAt: string | null;
  }>;
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

interface DetailedQuiz {
  id: number;
  title: string;
  classId: number;
  class: {
    classId: number;
    name: string;
  };
  levelId: number;
  level: {
    id: number;
    name: string;
    order: number;
  };
  status: string;
  bestScore: number | null;
  currentScore: number | null;
  pastScore: number | null;
}

interface DetailedQuizResponse {
  success: boolean;
  data: DetailedQuiz[];
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
  const [detailedQuizzes, setDetailedQuizzes] = useState<DetailedQuiz[]>([]);
  const [showDetailedQuizzes, setShowDetailedQuizzes] = useState(false);
  const [loadingDetailedQuizzes, setLoadingDetailedQuizzes] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);

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

  const fetchDetailedQuizzes = async () => {
    setLoadingDetailedQuizzes(true);
    try {
      const response = await fetch(`/api/admin/student/${studentId}/journey`);
      const data: DetailedQuizResponse = await response.json();

      if (data.success) {
        setDetailedQuizzes(data.data);
        setShowDetailedQuizzes(true);
      }
    } catch (error) {
      console.error('Error fetching detailed quizzes:', error);
    } finally {
      setLoadingDetailedQuizzes(false);
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

  const calculateDetailedQuizStats = () => {
    if (!detailedQuizzes.length) {
      return { completed: 0, passed: 0, averageScore: 0 };
    }

    const completed = detailedQuizzes.filter((quiz) => quiz.bestScore !== null).length;
    const passed = detailedQuizzes.filter((quiz) => quiz.bestScore !== null && quiz.bestScore >= (student?.level?.kkm || 0)).length;

    const totalScore = detailedQuizzes.reduce((sum, quiz) => sum + (quiz.bestScore || 0), 0);
    const averageScore = completed > 0 ? totalScore / completed : 0;

    return { completed, passed, averageScore };
  };

  const quizStats = calculateQuizStats();
  const detailedQuizStats = calculateDetailedQuizStats();

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
        <div className={showDetailedQuizzes ? 'grid grid-cols-1 md:grid-cols-4 gap-4' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}>
          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quiz Diselesaikan</h3>
                  <p className="text-2xl font-bold text-gray-900">{!showDetailedQuizzes ? quizStats.completed : detailedQuizStats.completed}</p>
                  <p className="text-xs text-gray-500">dari {!showDetailedQuizzes ? student.quizzes.length : detailedQuizzes.length} quiz</p>
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
                  <p className="text-2xl font-bold text-gray-900">{!showDetailedQuizzes ? quizStats.passed : detailedQuizStats.passed}</p>
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
                  <h3 className="text-sm font-medium text-gray-500">{!showDetailedQuizzes ? `Rata-rata Skor (${student.level.name})` : 'Rata-rata Skor (Level Ini)'}</h3>
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

          {showDetailedQuizzes && (
            <Card className="shadow-sm">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rata-rata Skor (Semua Level)</h3>
                    <p className="text-2xl font-bold text-gray-900">{detailedQuizStats.averageScore.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">dari semua quiz selesai</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Badges Section */}
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Badge Pencapaian</h3>
                {student.badges && student.badges.length > 0 ? (
                  <p className="text-sm text-gray-600">
                    {student.badges.filter((badge) => badge.isAwarded).length} dari {student.badges.length} badge telah diraih
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Belum ada badge yang tersedia</p>
                )}
              </div>
              {student.badges && student.badges.length > 0 && (
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  onPress={() => setShowAllBadges(!showAllBadges)}
                  startContent={
                    showAllBadges ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )
                  }
                >
                  {showAllBadges ? 'Sembunyikan' : 'Lihat Semua'}
                </Button>
              )}
            </div>

            {student.badges && student.badges.length > 0 ? (
              !showAllBadges ? (
                // Compact view - show only earned badges in a single row
                // <div className="flex flex-wrap gap-2">
                //   {student.badges
                //     .filter((badge) => badge.isAwarded)
                //     .map((badge) => (
                //       <div key={badge.id} className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                //         <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                //           <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 504 504">
                //             <g>
                //               <path
                //                 style={{ fill: '#E9B526' }}
                //                 d="M327.2,463.2c-34-1.2-62-29.6-63.2-63.6l-0.4-104H232V400c0,34-28,61.6-62.4,62.8l-1.6,6v26.4h164v-26.4L327.2,463.2z"
                //               />
                //               <path
                //                 style={{ fill: '#E9B526' }}
                //                 d="M5.6,29.6c0,100.8,60.8,192.4,152,230.8c-6.8-9.2-13.2-19.2-19.2-30C72.8,192,29.6,120,25.6,42.8c0-0.4,0-1.2,0.4-1.6s0.8-0.8,1.6-0.8h62c-0.4-8-0.8-12-0.8-20H15.6C10,20,5.6,24.4,5.6,29.6z"
                //               />
                //               <path
                //                 style={{ fill: '#E9B526' }}
                //                 d="M476,40c0.4,0,1.2,0.4,1.6,0.8s0.4,1.2,0.4,1.6c-4,77.6-47.6,150-113.6,188.4c-0.4,0-0.8,0.4-0.8,0.4l0,0c-6.4,11.6-13.6,22-20.8,31.2c93.2-38,155.6-130.8,155.6-233.2c0-5.2-4-9.2-10-9.2h-73.2c0,8-0.4,12-0.8,20L476,40L476,40z"
                //               />
                //               <path
                //                 style={{ fill: '#E9B526' }}
                //                 d="M94.4,28h314.8c0.8-4,1.2-2.8,1.6-2.4c0.4-6.8,0.4-13.6,0.4-21.6H92.4c0,8,0,14.8,0.4,21.6C93.2,25.2,93.6,24,94.4,28z"
                //               />
                //             </g>
                //             <path
                //               style={{ fill: '#FFC52F' }}
                //               d="M409.2,24L92.8,25.6c-0.4,4,0.4,1.6,0,1.2c0,0.4,0,1.2,0,1.6c0.4,11.2,1.2,22.8,2.4,34c6,60.4,20.8,114.8,42,156.8c1.2,2.8,2.8,5.2,4,8c0.8,0.4,0.8,1.2,0.8,2c6.8,12.8,14.4,24,22.4,34.4c0.4,0,0.4,0.4,0.8,0.4c0.4,0.4,0.4,1.6,0.8,2c1.2,0.4,1.6,0,1.2,1.2c0,0.4,0.8,0.4,0.4,0.8c19.6,23.2,42,38,66.4,42.8c0.8,0,1.6,0.8,1.6,2l0,0h28l0,0c0-0.8,0.4-1.6,1.6-2c26.4-4.8,51.6-22.4,73.6-50.4c10.8-13.6,20.4-29.6,29.6-48c0,0,0,0,0-0.4c20.4-42,33.6-93.2,39.6-148.4c1.2-11.2,2-22.8,2.4-34.4c0-0.4,0-1.6,0-2C410.4,27.2,410,28,409.2,24z M308,150.4L288,170l4.8,27.6c0.8,5.6-0.4,10-3.2,12.4c-3.2,2.4-7.6,2-12.8-0.4L252,196.8L227.2,210c-2.8,1.6-5.2,2-7.6,2c-2,0-3.6-0.4-5.2-1.6c-3.2-2.4-4.4-6.8-3.6-12.4l4.8-27.6l-20-19.2l0,0c0,0,0,0-0.4-0.4l-0.4-0.4c0,0,0,0,0-0.4c-3.6-3.6-4.8-7.6-3.6-11.2s5.2-6.4,10.8-7.2l27.6-4l12.4-24.4c2.4-5.2,6-7.2,10-7.2l0,0c4,0,7.6,2,10,7.2c0.4,0.8,0,1.6-0.8,2l11.2,22.4c0.4,0,0.8-0.4,1.2-0.4l28.8,4c5.6,0.8,9.6,3.2,10.8,7.2C313.6,142,312,146.4,308,150.4z"
                //             />
                //           </svg>
                //         </div>
                //         <div>
                //           <p className="text-sm font-medium text-yellow-800">{badge.name}</p>
                //           <p className="text-xs text-yellow-600">{badge.expPoints} XP</p>
                //         </div>
                //       </div>
                //     ))}
                //   {student.badges.filter((badge) => badge.isAwarded).length === 0 && (
                //     <div className="text-center py-4 w-full">
                //       <p className="text-gray-500 text-sm">Belum ada badge yang diraih</p>
                //     </div>
                //   )}
                // </div>
                <></>
              ) : (
                // Full view - show all badges in grid
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {student.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                        badge.isAwarded ? 'border-yellow-200 bg-yellow-50 shadow-md' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badge.isAwarded ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                        {badge.isAwarded ? (
                          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 504 504">
                            <g>
                              <path
                                style={{ fill: '#E9B526' }}
                                d="M327.2,463.2c-34-1.2-62-29.6-63.2-63.6l-0.4-104H232V400c0,34-28,61.6-62.4,62.8l-1.6,6v26.4h164v-26.4L327.2,463.2z"
                              />
                              <path
                                style={{ fill: '#E9B526' }}
                                d="M5.6,29.6c0,100.8,60.8,192.4,152,230.8c-6.8-9.2-13.2-19.2-19.2-30C72.8,192,29.6,120,25.6,42.8c0-0.4,0-1.2,0.4-1.6s0.8-0.8,1.6-0.8h62c-0.4-8-0.8-12-0.8-20H15.6C10,20,5.6,24.4,5.6,29.6z"
                              />
                              <path
                                style={{ fill: '#E9B526' }}
                                d="M476,40c0.4,0,1.2,0.4,1.6,0.8s0.4,1.2,0.4,1.6c-4,77.6-47.6,150-113.6,188.4c-0.4,0-0.8,0.4-0.8,0.4l0,0c-6.4,11.6-13.6,22-20.8,31.2c93.2-38,155.6-130.8,155.6-233.2c0-5.2-4-9.2-10-9.2h-73.2c0,8-0.4,12-0.8,20L476,40L476,40z"
                              />
                              <path
                                style={{ fill: '#E9B526' }}
                                d="M94.4,28h314.8c0.8-4,1.2-2.8,1.6-2.4c0.4-6.8,0.4-13.6,0.4-21.6H92.4c0,8,0,14.8,0.4,21.6C93.2,25.2,93.6,24,94.4,28z"
                              />
                            </g>
                            <path
                              style={{ fill: '#FFC52F' }}
                              d="M409.2,24L92.8,25.6c-0.4,4,0.4,1.6,0,1.2c0,0.4,0,1.2,0,1.6c0.4,11.2,1.2,22.8,2.4,34c6,60.4,20.8,114.8,42,156.8c1.2,2.8,2.8,5.2,4,8c0.8,0.4,0.8,1.2,0.8,2c6.8,12.8,14.4,24,22.4,34.4c0.4,0,0.4,0.4,0.8,0.4c0.4,0.4,0.4,1.6,0.8,2c1.2,0.4,1.6,0,1.2,1.2c0,0.4,0.8,0.4,0.4,0.8c19.6,23.2,42,38,66.4,42.8c0.8,0,1.6,0.8,1.6,2l0,0h28l0,0c0-0.8,0.4-1.6,1.6-2c26.4-4.8,51.6-22.4,73.6-50.4c10.8-13.6,20.4-29.6,29.6-48c0,0,0,0,0-0.4c20.4-42,33.6-93.2,39.6-148.4c1.2-11.2,2-22.8,2.4-34.4c0-0.4,0-1.6,0-2C410.4,27.2,410,28,409.2,24z M308,150.4L288,170l4.8,27.6c0.8,5.6-0.4,10-3.2,12.4c-3.2,2.4-7.6,2-12.8-0.4L252,196.8L227.2,210c-2.8,1.6-5.2,2-7.6,2c-2,0-3.6-0.4-5.2-1.6c-3.2-2.4-4.4-6.8-3.6-12.4l4.8-27.6l-20-19.2l0,0c0,0,0,0-0.4-0.4l-0.4-0.4c0,0,0,0,0-0.4c-3.6-3.6-4.8-7.6-3.6-11.2s5.2-6.4,10.8-7.2l27.6-4l12.4-24.4c2.4-5.2,6-7.2,10-7.2l0,0c4,0,7.6,2,10,7.2c0.4,0.8,0,1.6-0.8,2l11.2,22.4c0.4,0,0.8-0.4,1.2-0.4l28.8,4c5.6,0.8,9.6,3.2,10.8,7.2C313.6,142,312,146.4,308,150.4z"
                            />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
                          </svg>
                        )}
                      </div>
                      <h4 className={`text-xs font-medium text-center mb-1 ${badge.isAwarded ? 'text-yellow-800' : 'text-gray-500'}`}>{badge.name}</h4>
                      <p className={`text-xs text-center ${badge.isAwarded ? 'text-yellow-600' : 'text-gray-400'}`}>{badge.expPoints} XP</p>
                      {badge.isAwarded && badge.awardedAt && <p className="text-xs text-yellow-600 text-center mt-1">{new Date(badge.awardedAt).toLocaleDateString('id-ID')}</p>}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Belum ada badge yang tersedia</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quiz Progress Table */}
        <Card className="shadow-sm">
          <CardBody className="p-0">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Progress Quiz</h3>
                  <p className="text-sm text-gray-600">{showDetailedQuizzes ? 'Detail semua quiz di setiap kelas dan level' : 'Detail progress untuk setiap quiz'}</p>
                </div>
                <div className="flex gap-2">
                  {showDetailedQuizzes && (
                    <Button variant="bordered" size="sm" onPress={() => setShowDetailedQuizzes(false)}>
                      Tampilkan Quiz Student
                    </Button>
                  )}
                  <Button color="primary" variant="flat" size="sm" onPress={fetchDetailedQuizzes} isLoading={loadingDetailedQuizzes} isDisabled={showDetailedQuizzes}>
                    {showDetailedQuizzes ? 'Quiz Semua Level Ditampilkan' : 'Lihat Quiz Semua Level'}
                  </Button>
                </div>
              </div>
            </div>

            {!showDetailedQuizzes ? (
              // Show student's level quizzes
              student.quizzes.length === 0 ? (
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
              )
            ) : // Show detailed quizzes from all levels
            detailedQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada quiz tersedia</p>
              </div>
            ) : (
              <Table aria-label="Detailed Quiz Journey">
                <TableHeader>
                  <TableColumn>QUIZ</TableColumn>
                  <TableColumn>KELAS</TableColumn>
                  <TableColumn>LEVEL</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>SKOR TERBAIK</TableColumn>
                  <TableColumn>SKOR SAAT INI</TableColumn>
                  <TableColumn>HASIL</TableColumn>
                </TableHeader>
                <TableBody>
                  {detailedQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900">{quiz.title}</div>
                      </TableCell>
                      <TableCell>
                        <Chip variant="flat" color="default" size="sm">
                          {quiz.class.name}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip variant="flat" color="secondary" size="sm">
                          {quiz.level.name}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip variant="flat" color={quiz.bestScore !== null ? 'success' : 'default'} size="sm">
                          {quiz.bestScore !== null ? 'Selesai' : 'Belum Dimulai'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {quiz.bestScore !== null ? (
                          <Chip variant="flat" color={getScoreColor(quiz.bestScore, student?.level?.kkm || 0)} size="sm">
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
                        {quiz.bestScore !== null ? (
                          <Chip variant="flat" color={quiz.bestScore >= (student?.level?.kkm || 0) ? 'success' : 'danger'} size="sm">
                            {quiz.bestScore >= (student?.level?.kkm || 0) ? 'LULUS' : 'TIDAK LULUS'}
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
