'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody, Divider, Chip, Button, Textarea, Input, Select, SelectItem, RadioGroup, Radio } from '@heroui/react';
import { ArrowLeftIcon, DocumentPlusIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

interface QuizOption {
  option: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

interface QuizForm {
  title: string;
  description: string;
  levelId: number | null;
  classId: number | null;
  duration: number;
  status: 'DRAFT' | 'PUBLISHED';
  questions: QuizQuestion[];
}

interface Class {
  classId: number;
  name: string;
}

interface Level {
  id: number;
  name: string;
  order: number;
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
  questions: {
    id: number;
    question: string;
    options: {
      id: number;
      option: string;
      isCorrect: boolean;
    }[];
  }[];
}

// Memoized Option Input Component
const OptionInput = React.memo(
  ({
    option,
    optionIndex,
    questionIndex,
    isCorrect,
    error,
    onUpdate,
    onRemove,
    canRemove,
  }: {
    option: string;
    optionIndex: number;
    questionIndex: number;
    isCorrect: boolean;
    error?: string;
    onUpdate: (questionIndex: number, optionIndex: number, value: string) => void;
    onRemove: (questionIndex: number, optionIndex: number) => void;
    canRemove: boolean;
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(questionIndex, optionIndex, e.target.value);
      },
      [questionIndex, optionIndex, onUpdate]
    );

    const handleRemove = useCallback(() => {
      onRemove(questionIndex, optionIndex);
    }, [questionIndex, optionIndex, onRemove]);

    return (
      <div className="flex items-center gap-2">
        <Radio value={optionIndex.toString()} size="sm" />
        <Input
          placeholder={`Pilihan ${String.fromCharCode(65 + optionIndex)}`}
          value={option}
          onChange={handleChange}
          isInvalid={!!error}
          errorMessage={error}
          className="flex-1"
          size="sm"
        />
        {canRemove && (
          <Button color="danger" variant="light" size="sm" isIconOnly onPress={handleRemove}>
            <XMarkIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }
);

OptionInput.displayName = 'OptionInput';

// Memoized Question Component
const QuestionComponent = React.memo(
  ({
    question,
    questionIndex,
    errors,
    onUpdateQuestion,
    onAddOption,
    onRemoveOption,
    onSetCorrectOption,
    onRemoveQuestion,
    updateOption,
    canRemoveQuestion,
  }: {
    question: QuizQuestion;
    questionIndex: number;
    errors: Record<string, string>;
    onUpdateQuestion: (questionIndex: number, value: string) => void;
    onAddOption: (questionIndex: number) => void;
    onRemoveOption: (questionIndex: number, optionIndex: number) => void;
    onSetCorrectOption: (questionIndex: number, optionIndex: number) => void;
    onRemoveQuestion: (questionIndex: number) => void;
    updateOption: (questionIndex: number, optionIndex: number, value: string) => void;
    canRemoveQuestion: boolean;
  }) => {
    const handleQuestionChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateQuestion(questionIndex, e.target.value);
      },
      [questionIndex, onUpdateQuestion]
    );

    const handleAddOption = useCallback(() => {
      onAddOption(questionIndex);
    }, [questionIndex, onAddOption]);

    const handleRemoveQuestion = useCallback(() => {
      onRemoveQuestion(questionIndex);
    }, [questionIndex, onRemoveQuestion]);

    const handleCorrectOptionChange = useCallback(
      (value: string) => {
        onSetCorrectOption(questionIndex, parseInt(value));
      },
      [questionIndex, onSetCorrectOption]
    );

    return (
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-start">
          <Chip color="primary" variant="flat" size="sm">
            Soal {questionIndex + 1}
          </Chip>
          {canRemoveQuestion && (
            <Button color="danger" variant="light" size="sm" isIconOnly onPress={handleRemoveQuestion}>
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Textarea
          label={`Pertanyaan ${questionIndex + 1}`}
          placeholder="Masukkan pertanyaan"
          value={question.question}
          onChange={handleQuestionChange}
          isInvalid={!!errors[`question_${questionIndex}`]}
          errorMessage={errors[`question_${questionIndex}`]}
          maxRows={3}
          isRequired
        />

        {errors[`question_${questionIndex}_correct`] && <p className="text-sm text-red-500">{errors[`question_${questionIndex}_correct`]}</p>}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Pilihan Jawaban</p>
            <Button color="primary" variant="light" size="sm" startContent={<PlusIcon className="w-4 h-4" />} onPress={handleAddOption} isDisabled={question.options.length >= 6}>
              Tambah Pilihan
            </Button>
          </div>

          <RadioGroup value={question.options.findIndex((option) => option.isCorrect).toString()} onValueChange={handleCorrectOptionChange}>
            {question.options.map((option, optionIndex) => (
              <OptionInput
                key={optionIndex}
                option={option.option}
                optionIndex={optionIndex}
                questionIndex={questionIndex}
                isCorrect={option.isCorrect}
                error={errors[`option_${questionIndex}_${optionIndex}`]}
                onUpdate={updateOption}
                onRemove={onRemoveOption}
                canRemove={question.options.length > 2}
              />
            ))}
          </RadioGroup>
          <p className="text-xs text-gray-500">Pilih radio button untuk menandai jawaban yang benar</p>
        </div>
      </div>
    );
  }
);

QuestionComponent.displayName = 'QuestionComponent';

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();

  const [classes, setClasses] = useState<Class[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const quizId = params?.id as string;

  const [formData, setFormData] = useState<QuizForm>({
    title: '',
    description: '',
    levelId: null,
    classId: null,
    duration: 30,
    status: 'DRAFT',
    questions: [
      {
        question: '',
        options: [
          { option: '', isCorrect: true },
          { option: '', isCorrect: false },
          { option: '', isCorrect: false },
          { option: '', isCorrect: false },
        ],
      },
    ],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, levelRes, quizRes] = await Promise.all([fetch('/api/users/class'), fetch('/api/users/level'), fetch(`/api/admin/quiz/${quizId}`)]);

        if (classRes.ok && levelRes.ok && quizRes.ok) {
          const classData = await classRes.json();
          const levelData = await levelRes.json();
          const quizData = await quizRes.json();

          setClasses(classData.data || []);
          setLevels(levelData.data || []);

          if (quizData.success) {
            const quiz: QuizDetail = quizData.data;
            setFormData({
              title: quiz.title,
              description: quiz.description || '',
              levelId: quiz.levelId,
              classId: quiz.classId,
              duration: quiz.duration,
              status: quiz.status,
              questions: quiz.questions.map((q) => ({
                question: q.question,
                options: q.options.map((o) => ({
                  option: o.option,
                  isCorrect: o.isCorrect,
                })),
              })),
            });
          } else {
            setErrors({ submit: 'Quiz tidak ditemukan' });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ submit: 'Terjadi kesalahan saat memuat data' });
      } finally {
        setLoadingData(false);
      }
    };

    if (quizId) {
      fetchData();
    }
  }, [quizId]);

  // Add new question
  const addQuestion = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: [
            { option: '', isCorrect: true },
            { option: '', isCorrect: false },
            { option: '', isCorrect: false },
            { option: '', isCorrect: false },
          ],
        },
      ],
    }));
  }, []);

  // Remove question
  const removeQuestion = useCallback(
    (index: number) => {
      if (formData.questions.length > 1) {
        setFormData((prev) => ({
          ...prev,
          questions: prev.questions.filter((_, i) => i !== index),
        }));
      }
    },
    [formData.questions.length]
  );

  // Add option to question
  const addOption = useCallback((questionIndex: number) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      if (newQuestions[questionIndex].options.length < 6) {
        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          options: [...newQuestions[questionIndex].options, { option: '', isCorrect: false }],
        };
      }
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  }, []);

  // Remove option from question
  const removeOption = useCallback((questionIndex: number, optionIndex: number) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      if (newQuestions[questionIndex].options.length > 2) {
        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          options: newQuestions[questionIndex].options.filter((_, oi) => oi !== optionIndex),
        };
      }
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  }, []);

  // Update question text
  const updateQuestion = useCallback((questionIndex: number, value: string) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        question: value,
      };
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  }, []);

  // Update option text - Most optimized since this is called most frequently
  const updateOption = useCallback((questionIndex: number, optionIndex: number, value: string) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        option: value,
      };
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newOptions,
      };
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  }, []);

  // Set correct option (only one can be correct)
  const setCorrectOption = useCallback((questionIndex: number, optionIndex: number) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      const newOptions = newQuestions[questionIndex].options.map((o, oi) => ({
        ...o,
        isCorrect: oi === optionIndex,
      }));
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newOptions,
      };
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  }, []);

  // Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Judul quiz wajib diisi';
    if (!formData.levelId) newErrors.levelId = 'Level wajib dipilih';
    if (!formData.classId) newErrors.classId = 'Kelas wajib dipilih';
    if (formData.duration < 1) newErrors.duration = 'Durasi minimal 1 menit';

    formData.questions.forEach((question, qIndex) => {
      if (!question.question.trim()) {
        newErrors[`question_${qIndex}`] = 'Pertanyaan wajib diisi';
      }

      const hasCorrectOption = question.options.some((option) => option.isCorrect);
      if (!hasCorrectOption) {
        newErrors[`question_${qIndex}_correct`] = 'Pilih satu jawaban yang benar';
      }

      question.options.forEach((option, oIndex) => {
        if (!option.option.trim()) {
          newErrors[`option_${qIndex}_${oIndex}`] = 'Pilihan jawaban wajib diisi';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Memoized computed values
  const canAddQuestions = useMemo(() => formData.questions.length < 50, [formData.questions.length]);
  const questionCount = useMemo(() => formData.questions.length, [formData.questions.length]);

  // Submit form
  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        title: formData.title,
        description: formData.description || undefined,
        levelId: formData.levelId!,
        classId: formData.classId!,
        duration: formData.duration,
        status: status,
        questions: formData.questions,
      };

      const response = await fetch(`/api/admin/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/quiz/${quizId}`);
      } else {
        setErrors({ submit: result.message || 'Terjadi kesalahan' });
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      setErrors({ submit: 'Terjadi kesalahan saat menyimpan quiz' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loadingData) {
    return (
      <DashboardLayout title="Edit Quiz">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Quiz">
      <Button as={Link} href="/quiz" color="primary" variant="light" className="mb-4">
        <ArrowLeftIcon />
        Back
      </Button>
      <div className="mx-auto space-y-6">
        {/* Quiz Information Card */}
        <Card>
          <CardHeader className="flex gap-3">
            <DocumentPlusIcon className="w-6 h-6 text-[#0075e6]" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Edit Quiz</p>
              <p className="text-sm text-gray-500">Perbarui detail quiz dan soal-soal</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            {errors.submit && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{errors.submit}</div>}

            <div className="grid grid-cols-1  gap-4">
              <Input
                label="Judul Quiz"
                placeholder="Masukkan judul quiz"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                isRequired
              />
            </div>

            <Textarea
              label="Deskripsi (Opsional)"
              placeholder="Masukkan deskripsi quiz"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              maxRows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Level"
                placeholder="Pilih level"
                selectedKeys={formData.levelId ? [formData.levelId.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData((prev) => ({ ...prev, levelId: selectedKey ? parseInt(selectedKey) : null }));
                }}
                isInvalid={!!errors.levelId}
                errorMessage={errors.levelId}
                isRequired
              >
                {levels.map((level) => (
                  <SelectItem key={level.id.toString()}>{level.name}</SelectItem>
                ))}
              </Select>

              <Select
                label="Kelas"
                placeholder="Pilih kelas"
                selectedKeys={formData.classId ? [formData.classId.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData((prev) => ({ ...prev, classId: selectedKey ? parseInt(selectedKey) : null }));
                }}
                isInvalid={!!errors.classId}
                errorMessage={errors.classId}
                isRequired
              >
                {classes.map((cls) => (
                  <SelectItem key={cls.classId.toString()}>{cls.name}</SelectItem>
                ))}
              </Select>
              <Select
                label="Durasi"
                placeholder="Pilih durasi quiz"
                selectedKeys={[formData.duration.toString()]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData((prev) => ({ ...prev, duration: selectedKey ? parseInt(selectedKey) : 30 }));
                }}
                isInvalid={!!errors.duration}
                errorMessage={errors.duration}
                isRequired
              >
                <SelectItem key="15">15 menit</SelectItem>
                <SelectItem key="30">30 menit</SelectItem>
                <SelectItem key="45">45 menit</SelectItem>
                <SelectItem key="60">60 menit</SelectItem>
                <SelectItem key="90">90 menit</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Questions Card */}
        <Card>
          <CardHeader className="flex justify-between">
            <div className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Soal Quiz</p>
                <p className="text-sm text-gray-500">Perbarui soal dan pilihan jawaban ({questionCount}/50)</p>
              </div>
            </div>
            <Button color="primary" variant="flat" startContent={<PlusIcon className="w-4 h-4" />} onPress={addQuestion} isDisabled={!canAddQuestions} size="sm">
              Tambah Soal
            </Button>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-6">
            {formData.questions.map((question, questionIndex) => (
              <QuestionComponent
                key={questionIndex}
                question={question}
                questionIndex={questionIndex}
                errors={errors}
                onUpdateQuestion={updateQuestion}
                onAddOption={addOption}
                onRemoveOption={removeOption}
                onSetCorrectOption={setCorrectOption}
                onRemoveQuestion={removeQuestion}
                updateOption={updateOption}
                canRemoveQuestion={formData.questions.length > 1}
              />
            ))}
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="bordered" onPress={() => router.push(`/quiz/${quizId}`)}>
            Batal
          </Button>
          <Button color="default" variant="flat" onPress={() => handleSubmit('DRAFT')} isDisabled={loading}>
            Simpan Sebagai Draft
          </Button>
          <Button color="primary" onPress={() => handleSubmit('PUBLISHED')} isDisabled={loading}>
            Publikasikan Quiz
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
