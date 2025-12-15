'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody, Divider, Chip, Button, Textarea, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { DocumentIcon, PencilIcon, TrashIcon, ClockIcon, AcademicCapIcon, UserGroupIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface QuizOption {
  id: number;
  option: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

interface QuizDetail {
  id: number;
  title: string;
  description?: string;
  levelId: number;
  classId: number;
  duration: number;
  status: 'DRAFT' | 'PUBLISHED';
  level: {
    id: number;
    name: string;
    order: number;
    kkm: number;
  };
  class: {
    classId: number;
    name: string;
  };
  questions: QuizQuestion[];
  _count: {
    questions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DetailQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quizId = params?.id as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/quiz/${quizId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }

        const result = await response.json();

        if (result.success) {
          setQuiz(result.data);
        } else {
          setError(result.message || 'Quiz tidak ditemukan');
        }
      } catch (error) {
        setError('Terjadi kesalahan saat mengambil data quiz');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchQuiz();
    }
  }, [quizId, status]);

  // Delete quiz
  const handleDelete = async () => {
    if (!quiz) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/quiz/${quiz.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        router.push('/quiz');
      } else {
        setError(result.message || 'Gagal menghapus quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setError('Terjadi kesalahan saat menghapus quiz');
    } finally {
      setDeleting(false);
      onOpenChange();
    }
  };

  if (status === 'loading') {
    return (
      <DashboardLayout title="Detail Quiz">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Memeriksa autentikasi...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Detail Quiz">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Memuat data quiz...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Detail Quiz">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button color="primary" variant="flat" onPress={() => router.push('/quiz')} className="mt-4">
              Kembali ke Daftar Quiz
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <DashboardLayout title="Detail Quiz">
      <Button as={Link} href="/quiz" color="primary" variant="light" className="mb-4">
        <ArrowLeftIcon />
        Back
      </Button>
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <div className="flex gap-2 mt-2">
              <Chip color={quiz.status === 'PUBLISHED' ? 'success' : 'warning'} variant="flat" size="sm">
                {quiz.status === 'PUBLISHED' ? 'Dipublikasikan' : 'Draft'}
              </Chip>
              <Chip variant="flat" size="sm">
                {quiz._count.questions} Soal
              </Chip>
            </div>
          </div>
          <div className="flex gap-2">
            <Button color="primary" variant="flat" startContent={<PencilIcon className="w-4 h-4" />} onPress={() => router.push(`/quiz/${quiz.id}/edit`)}>
              Edit Quiz
            </Button>
            <Button color="danger" variant="flat" startContent={<TrashIcon className="w-4 h-4" />} onPress={onOpen}>
              Hapus Quiz
            </Button>
          </div>
        </div>

        {/* Quiz Information */}
        <Card>
          <CardHeader className="flex gap-3">
            <DocumentIcon className="w-6 h-6 text-[#0075e6]" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Informasi Quiz</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Judul Quiz</label>
                <Input value={quiz.title} isReadOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Durasi</label>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span>{quiz.duration} menit</span>
                </div>
              </div>
            </div>

            {quiz.description && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                <Textarea value={quiz.description} isReadOnly maxRows={3} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Level</label>
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                  <span>{quiz.level.name}</span>
                  <Chip size="sm" variant="flat">
                    KKM: {quiz.level.kkm}
                  </Chip>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Kelas</label>
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 text-gray-400" />
                  <span>{quiz.class.name}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Dibuat pada</label>
                <span className="text-sm">{new Date(quiz.createdAt).toLocaleString('id-ID')}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Terakhir diperbarui</label>
                <span className="text-sm">{new Date(quiz.updatedAt).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Soal Quiz</p>
              <p className="text-sm text-gray-500">Daftar soal dan pilihan jawaban ({quiz.questions.length} soal)</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-6">
            {quiz.questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada soal untuk quiz ini</p>
              </div>
            ) : (
              quiz.questions.map((question, questionIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <Chip color="primary" variant="flat" size="sm">
                      Soal {questionIndex + 1}
                    </Chip>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Pertanyaan</label>
                    <Textarea value={question.question} isReadOnly maxRows={3} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Pilihan Jawaban</label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={option.id} className={`flex items-center gap-2 p-2 rounded-lg ${option.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            {option.isCorrect && <CheckCircleIcon className="w-4 h-4 text-green-600" />}
                            <span className="text-sm font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                          </div>
                          <span className={`flex-1 ${option.isCorrect ? 'font-medium text-green-800' : ''}`}>{option.option}</span>
                          {option.isCorrect && (
                            <Chip color="success" size="sm" variant="flat">
                              Jawaban Benar
                            </Chip>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="bordered" onPress={() => router.push('/quiz')}>
            Kembali
          </Button>
          <Button color="primary" startContent={<PencilIcon className="w-4 h-4" />} onPress={() => router.push(`/quiz/${quiz.id}/edit`)}>
            Edit Quiz
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Konfirmasi Hapus Quiz</ModalHeader>
                <ModalBody>
                  <p>
                    Apakah Anda yakin ingin menghapus quiz <strong>&quot;{quiz.title}&quot;</strong>?
                  </p>
                  <p className="text-sm text-red-500">Tindakan ini tidak dapat dibatalkan. Semua data soal dan pilihan jawaban akan terhapus.</p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Batal
                  </Button>
                  <Button color="danger" onPress={handleDelete} isLoading={deleting}>
                    {deleting ? 'Menghapus...' : 'Ya, Hapus'}
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
