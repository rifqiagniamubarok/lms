'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Chip, Avatar, Progress } from '@heroui/react';

interface DashboardData {
  overview: {
    totalStudents: number;
    totalQuizzes: number;
    totalClasses: number;
    totalLevels: number;
    completionRate: number;
  };
  classStats: Array<{
    classId: number;
    className: string;
    studentCount: number;
  }>;
  levelStats: Array<{
    levelId: number;
    levelName: string;
    levelOrder: number;
    studentCount: number;
  }>;
  quizDistribution: Array<{
    classId: number;
    levelId: number;
    quizCount: number;
  }>;
  recentStudents: Array<{
    id: string;
    name: string;
    className: string;
    levelName: string;
    registeredAt: string;
  }>;
  needsAttention: Array<{
    id: string;
    name: string;
    className: string;
    levelName: string;
    averageScore: number;
    expPercentage: number;
    kkm: number;
  }>;
  weeklyActivity: Array<{
    date: string;
    count: number;
  }>;
  quizCompletionChart: {
    topQuizzes: Array<{
      title: string;
      count: number;
      classId: number;
      levelId: number;
    }>;
    classSummary: Array<{
      classId: number;
      className: string;
      completions: number;
    }>;
    totalCompletions: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Guru" description="Ringkasan sistem pembelajaran">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="Dashboard Guru" description="Ringkasan sistem pembelajaran">
        <div className="text-center py-20">
          <p className="text-gray-500">Data tidak dapat dimuat</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Guru" description="Ringkasan sistem pembelajaran">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Siswa</p>
                  <p className="text-3xl font-bold text-blue-600">{data.overview.totalStudents}</p>
                  <p className="text-xs text-gray-500">Terdaftar aktif</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <Card className="shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Kuis</p>
                  <p className="text-3xl font-bold text-green-600">{data.overview.totalQuizzes}</p>
                  <p className="text-xs text-gray-500">Tersedia untuk siswa</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Kelas</p>
                  <p className="text-3xl font-bold text-purple-600">{data.overview.totalClasses}</p>
                  <p className="text-xs text-gray-500">Kelas aktif</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tingkat Penyelesaian</p>
                  <p className="text-3xl font-bold text-orange-600">{data.overview.completionRate}%</p>
                  <p className="text-xs text-gray-500">Rata-rata kuis</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Distribution */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Siswa per Kelas</h3>
              <div className="space-y-3">
                {data.classStats.map((classItem) => (
                  <div key={classItem.classId} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{classItem.className}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{classItem.studentCount} siswa</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.round((classItem.studentCount / data.overview.totalStudents) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Level Distribution */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Siswa per Level</h3>
              <div className="space-y-3">
                {data.levelStats.map((level) => (
                  <div key={level.levelId} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{level.levelName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{level.studentCount} siswa</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{
                            width: `${Math.round((level.studentCount / data.overview.totalStudents) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Weekly Activity */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas 7 Hari Terakhir</h3>
              <div className="space-y-3">
                {data.weeklyActivity.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{day.date}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{day.count} aktivitas</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{
                            width: `${Math.min((day.count / Math.max(...data.weeklyActivity.map((d) => d.count), 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Siswa Terbaru</h3>
              <div className="space-y-4">
                {data.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{student.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <div className="flex space-x-2">
                        <Chip variant="flat" color="default" size="sm">
                          {student.className}
                        </Chip>
                        <Chip variant="flat" color="secondary" size="sm">
                          {student.levelName}
                        </Chip>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(student.registeredAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Students Need Attention */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Siswa Perlu Diperhatikan</h3>
              <div className="space-y-4">
                {data.needsAttention.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">Semua siswa dalam kondisi baik!</p>
                  </div>
                ) : (
                  data.needsAttention.map((student) => (
                    <div key={student.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-sm">{student.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                        <div className="flex space-x-2 mb-1">
                          <Chip variant="flat" color="default" size="sm">
                            {student.className}
                          </Chip>
                          <Chip variant="flat" color="secondary" size="sm">
                            {student.levelName}
                          </Chip>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Rata-rata: {student.averageScore}</span>
                          <Chip variant="flat" color={student.averageScore >= student.kkm ? 'success' : 'danger'} size="sm">
                            KKM: {student.kkm}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quiz Completion Tracking Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Most Completed Quizzes Chart */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">5 Kuis Paling Sering Dikerjakan</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Total: {data.quizCompletionChart.totalCompletions} kuis diselesaikan</span>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="space-y-4">
                  {data.quizCompletionChart.topQuizzes.map((quiz, index) => {
                    const percentage = data.quizCompletionChart.totalCompletions > 0 ? (quiz.count / data.quizCompletionChart.totalCompletions) * 100 : 0;
                    const maxCount = Math.max(...data.quizCompletionChart.topQuizzes.map((q) => q.count));
                    const barWidth = maxCount > 0 ? (quiz.count / maxCount) * 100 : 0;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {index + 1}. {quiz.title}
                              </span>
                              <Chip variant="flat" color="secondary" size="sm">
                                Kelas {quiz.classId}
                              </Chip>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-sm font-bold text-blue-600">{quiz.count}x</span>
                            <Chip variant="flat" color="primary" size="sm">
                              {percentage.toFixed(1)}%
                            </Chip>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                index === 0
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                  : index === 1
                                  ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                                  : index === 2
                                  ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                                  : 'bg-gradient-to-r from-blue-400 to-blue-600'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <div className="absolute right-2 top-0 text-xs font-semibold text-gray-700 leading-3">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {data.quizCompletionChart.topQuizzes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Belum ada data penyelesaian kuis</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Quiz Completion by Class */}
          <Card className="shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Penyelesaian Kuis per Kelas</h3>
              <div className="space-y-4">
                {data.quizCompletionChart.classSummary.map((classItem) => {
                  const percentage = data.quizCompletionChart.totalCompletions > 0 ? (classItem.completions / data.quizCompletionChart.totalCompletions) * 100 : 0;
                  return (
                    <div key={classItem.classId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{classItem.className}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{classItem.completions} kuis</span>
                          <Chip variant="flat" color="primary" size="sm">
                            {percentage.toFixed(1)}%
                          </Chip>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        color="primary"
                        size="sm"
                        classNames={{
                          track: 'bg-gray-200',
                          indicator: 'bg-gradient-to-r from-blue-400 to-blue-600',
                        }}
                      />
                      <div className="text-xs text-gray-500">
                        {classItem.completions} dari {data.quizCompletionChart.totalCompletions} total penyelesaian
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.quizCompletionChart.topQuizzes.length > 0 ? Math.round(data.quizCompletionChart.totalCompletions / data.quizCompletionChart.topQuizzes.length) : 0}
                    </div>
                    <div className="text-xs text-gray-500">Rata-rata per kuis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.quizCompletionChart.topQuizzes.length > 0 ? Math.max(...data.quizCompletionChart.topQuizzes.map((q) => q.count)) : 0}
                    </div>
                    <div className="text-xs text-gray-500">Kuis terpopuler</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
