'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Chip } from '@heroui/react';
import { InfoPopover } from '@/components/InfoPopover';
import dynamic from 'next/dynamic';
const MatrixLineChart = dynamic(() => import('@/components/MatrixLineChart'), { ssr: false });

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
    classSummary?: Array<{
      classId: number;
      className: string;
      completions: number;
    }>;
    totalCompletions: number;
    matrix: Array<{
      levelId: number;
      levelName: string;
      data: Array<{
        classId: number;
        className: string;
        count: number;
      }>;
    }>;
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
      <div className="">
        {/* Overview Cards (Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
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
        </div>

        {/* Main Chart Feature and Secondary Cards */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Chart Main View (2/3 width) */}
          <Card className="shadow-lg border-2 border-blue-100 flex-1 lg:basis-2/3">
            <CardBody className="p-6 md:p-8">
              <div className="flex items-center mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-blue-900">Matriks Penyelesaian Kuis (Level x Kelas)</h3>
                <InfoPopover
                  description={
                    'Grafik ini menunjukkan jumlah penyelesaian kuis oleh siswa untuk setiap kombinasi level dan kelas. Setiap garis mewakili satu kelas, dan titik-titik pada garis menunjukkan berapa kali kuis pada level tertentu telah diselesaikan oleh siswa di kelas tersebut. Gunakan grafik ini untuk memantau aktivitas siswa lintas kelas dan level, serta mengidentifikasi tren atau ketimpangan dalam penyelesaian kuis.'
                  }
                />
              </div>
              <div className="bg-white rounded-lg p-2 md:p-6 shadow-none border border-gray-100">
                <MatrixLineChart matrix={data.quizCompletionChart.matrix} />
              </div>
            </CardBody>
          </Card>

          {/* Secondary Cards: Recent Students & Needs Attention (1/3 width) */}
          <div className="flex flex-col gap-6 lg:basis-1/3 min-w-0">
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
        </div>
      </div>

      {/* Top 5 Most Completed Quizzes Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">5 Kuis Paling Sering Dikerjakan</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Total: {data.quizCompletionChart.totalCompletions} kuis diselesaikan</span>
              </div>
              {/* Horizontal Bar Chart */}
              <div className="space-y-4">
                {(data.quizCompletionChart.topQuizzes ?? []).map((quiz, index) => {
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
                                ? 'bg-linear-to-r from-yellow-400 to-yellow-600'
                                : index === 1
                                ? 'bg-linear-to-r from-gray-400 to-gray-600'
                                : index === 2
                                ? 'bg-linear-to-r from-orange-400 to-orange-600'
                                : 'bg-linear-to-r from-blue-400 to-blue-600'
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
              {(data.quizCompletionChart.topQuizzes ?? []).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Belum ada data penyelesaian kuis</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
