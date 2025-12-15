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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daftar Quiz</h2>
            <p className="text-sm text-gray-500">Kelola semua quiz dan soal</p>
          </div>
          <Button as={Link} href="/quiz/new" color="primary" startContent={<PlusIcon className="w-4 h-4" />}>
            Buat Soal Baru
          </Button>
        </div>

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari quiz..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select
                placeholder="Semua Kelas"
                selectedKeys={selectedClass ? [selectedClass] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string;
                  setSelectedClass(key || '');
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="max-w-48"
              >
                {classes.map((cls) => (
                  <SelectItem key={cls.classId.toString()}>{cls.name}</SelectItem>
                ))}
              </Select>
              <Select
                placeholder="Semua Level"
                selectedKeys={selectedLevel ? [selectedLevel] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string;
                  setSelectedLevel(key || '');
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="max-w-48"
              >
                {levels.map((level) => (
                  <SelectItem key={level.id.toString()}>{level.name}</SelectItem>
                ))}
              </Select>
              <Button color="primary" onPress={handleSearch}>
                Cari
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Table Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-[#0075e6]" />
                <span className="font-semibold">Daftar Quiz ({pagination.total})</span>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            <Table aria-label="Quiz table" removeWrapper>
              <TableHeader>
                <TableColumn className="w-2/5">JUDUL QUIZ</TableColumn>
                <TableColumn className="w-1/6">KELAS</TableColumn>
                <TableColumn className="w-1/6">LEVEL</TableColumn>
                <TableColumn className="w-1/12">DURASI</TableColumn>
                <TableColumn className="w-1/12">SOAL</TableColumn>
                <TableColumn className="w-1/8">STATUS</TableColumn>
                <TableColumn className="w-1/12">AKSI</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={loading}
                loadingContent={<Spinner label="Memuat data..." />}
                emptyContent={
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Belum ada quiz</p>
                  </div>
                }
              >
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{quiz.title}</p>
                        {quiz.description && <p className="text-sm text-gray-500 truncate max-w-xs">{quiz.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{quiz.class.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{quiz.level.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{quiz.duration} mnt</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{quiz._count.questions} soal</span>
                    </TableCell>
                    <TableCell>
                      <Chip color={getStatusColor(quiz.status)} variant="flat" size="sm">
                        {getStatusText(quiz.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
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
          </CardBody>
        </Card>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center">
            <Pagination total={pagination.pages} page={pagination.page} onChange={handlePageChange} showControls showShadow />
          </div>
        )}

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
