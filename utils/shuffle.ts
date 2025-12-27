/**
 * Array Shuffle Utility
 *
 * Fungsi utilitas untuk mengacak urutan elemen dalam array
 * menggunakan Fisher-Yates shuffle algorithm.
 *
 * Algorithm:
 * 1. Map setiap elemen dengan random number
 * 2. Sort berdasarkan random number
 * 3. Extract nilai asli tanpa random number
 *
 * Usage:
 * const shuffled = shuffle([1, 2, 3, 4, 5]);
 * const shuffledQuestions = shuffle(questions);
 * const shuffledOptions = shuffle(options);
 *
 * Use Cases:
 * - Mengacak urutan soal quiz
 * - Mengacak pilihan jawaban
 * - Randomize data untuk testing
 *
 * Type Safety:
 * - Generic function mendukung semua tipe data
 * - Preserves original array type
 */

export function shuffle<T>(arr: T[]) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(({ v }) => v);
}
