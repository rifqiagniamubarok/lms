import kelas3level1 from './kelas3level1.json';
import kelas3level2 from './kelas3level2.json';

export interface SoalOption {
  title: string;
  description: string;
  level: number;
  class: number;
  duration: number;
  questions: {
    question: string;
    options: {
      option: string;
      isCorrect: boolean;
    }[];
  }[];
}

const dataSoal: SoalOption[] = [...kelas3level1, ...kelas3level2];

export default dataSoal;
