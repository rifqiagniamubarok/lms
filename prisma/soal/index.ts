import kelas3level1 from './kelas3level1.json';
import kelas3level2 from './kelas3level2.json';
import kelas3level3 from './kelas3level3.json';
import kelas3level4 from './kelas3level4.json';
import kelas3level5 from './kelas3level5.json';
import kelas4level1 from './kelas4level1.json';
import kelas4level2 from './kelas4level2.json';
import kelas4level3 from './kelas4level3.json';
import kelas4level4 from './kelas4level4.json';
import kelas4level5 from './kelas4level5.json';
import kelas5level1 from './kelas5level1.json';
import kelas5level2 from './kelas5level2.json';
import kelas5level3 from './kelas5level3.json';
import kelas5level4 from './kelas5level4.json';
import kelas5level5 from './kelas5level5.json';

export interface SoalOption {
  title: string;
  description?: string;
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

const dataSoal: SoalOption[] = [
  ...kelas3level1,
  ...kelas3level2,
  ...kelas3level3,
  ...kelas3level4,
  ...kelas3level5,
  ...kelas4level1,
  ...kelas4level2,
  ...kelas4level3,
  ...kelas4level4,
  ...kelas4level5,
  ...kelas5level1,
  ...kelas5level2,
  ...kelas5level3,
  ...kelas5level4,
  ...kelas5level5,
];

export default dataSoal;
