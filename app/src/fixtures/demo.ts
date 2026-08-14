import { FIXTURE_VERSION, RULE_VERSION } from '../constants/rules';
import { subjects, subjectTargets } from '../constants/subjects';

import type {
  Assessment,
  StudentProfile,
  StudyPlanItem,
  StudySession,
} from '@/domain/types';

export { FIXTURE_VERSION, RULE_VERSION, subjects, subjectTargets };

export const demoProfile: StudentProfile = {
  id: 'synthetic-xiaohang',
  displayName: '小航',
  gradeBand: '學生示範情境',
  dataDisclosure: '此 App 使用完全合成的展示資料；不會上傳、同步或保存真實學生紀錄。',
};

const session = (
  id: string,
  subjectId: StudySession['subjectId'],
  startedAt: string,
  minutes: number,
  topic: string,
  focusScore: number,
  accuracy: number,
  completionScore = 100,
): StudySession => {
  const start = new Date(startedAt);
  return {
    id,
    subjectId,
    startedAt,
    endedAt: new Date(start.getTime() + minutes * 60_000).toISOString(),
    topic,
    focusScore,
    questionsAttempted: 20,
    questionsCorrect: Math.round((20 * accuracy) / 100),
    completionScore,
    source: 'synthetic',
  };
};

export const demoSessions: StudySession[] = [
  session('m-01', 'math', '2026-07-02T19:00:00+08:00', 60, '一元二次方程式', 90, 90, 95),
  session('m-02', 'math', '2026-07-05T19:30:00+08:00', 55, '一元二次方程式', 87, 85, 90),
  session('m-03', 'math', '2026-07-08T20:00:00+08:00', 50, '函數圖形', 86, 80, 90),
  session('m-04', 'math', '2026-07-16T16:00:00+08:00', 50, '函數圖形', 76, 75, 80),
  session('m-05', 'math', '2026-07-20T20:00:00+08:00', 45, '機率', 70, 70, 80),
  session('m-06', 'math', '2026-07-26T18:00:00+08:00', 50, '錯題整理', 68, 65, 70),
  session('m-07', 'math', '2026-08-02T17:00:00+08:00', 40, '二次函數', 60, 60, 70),
  session('m-08', 'math', '2026-08-06T20:00:00+08:00', 45, '二次函數', 58, 55, 60),
  session('m-09', 'math', '2026-08-10T19:00:00+08:00', 50, '錯題複習', 60, 60, 60),
  session('e-01', 'english', '2026-07-03T19:00:00+08:00', 40, '閱讀策略', 80, 75, 90),
  session('e-02', 'english', '2026-07-12T20:00:00+08:00', 45, '核心單字', 82, 80, 95),
  session('e-03', 'english', '2026-07-22T19:00:00+08:00', 45, '閱讀策略', 84, 85, 90),
  session('e-04', 'english', '2026-08-01T20:00:00+08:00', 50, '文法複習', 82, 85, 90),
  session('e-05', 'english', '2026-08-08T19:00:00+08:00', 45, '核心單字', 85, 85, 100),
  session('c-01', 'chinese', '2026-07-06T17:00:00+08:00', 35, '文言文閱讀', 78, 75, 90),
  session('c-02', 'chinese', '2026-07-18T19:00:00+08:00', 40, '國學常識', 80, 80, 85),
  session('c-03', 'chinese', '2026-07-28T18:00:00+08:00', 35, '修辭練習', 72, 65, 85),
  session('c-04', 'chinese', '2026-08-09T18:00:00+08:00', 45, '閱讀測驗', 82, 80, 95),
  session('s-01', 'science', '2026-07-09T18:00:00+08:00', 45, '電流與電壓', 84, 80, 90),
  session('s-02', 'science', '2026-07-24T19:00:00+08:00', 50, '化學反應', 82, 80, 90),
  session('s-03', 'science', '2026-08-05T19:00:00+08:00', 45, '力與運動', 85, 85, 90),
  session('s-04', 'science', '2026-08-11T20:00:00+08:00', 45, '力與運動', 84, 85, 95),
  session('so-01', 'social', '2026-07-10T18:00:00+08:00', 40, '臺灣地理', 74, 70, 85),
  session('so-02', 'social', '2026-07-25T19:00:00+08:00', 45, '歷史事件整理', 76, 75, 85),
  session('so-03', 'social', '2026-08-04T17:00:00+08:00', 35, '公民權利', 78, 75, 90),
  session('so-04', 'social', '2026-08-12T19:00:00+08:00', 40, '圖表判讀', 80, 80, 90),
];

const assessment = (
  id: string,
  subjectId: Assessment['subjectId'],
  takenAt: string,
  score: number,
): Assessment => ({ id, subjectId, takenAt, score, maxScore: 100, source: 'synthetic' });

export const demoAssessments: Assessment[] = [
  assessment('ma-01', 'math', '2026-07-01T12:00:00+08:00', 88),
  assessment('ma-02', 'math', '2026-07-17T12:00:00+08:00', 84),
  assessment('ma-03', 'math', '2026-07-31T12:00:00+08:00', 74),
  assessment('ma-04', 'math', '2026-08-10T12:00:00+08:00', 70),
  assessment('en-01', 'english', '2026-07-02T12:00:00+08:00', 76),
  assessment('en-02', 'english', '2026-07-18T12:00:00+08:00', 79),
  assessment('en-03', 'english', '2026-08-03T12:00:00+08:00', 80),
  assessment('en-04', 'english', '2026-08-11T12:00:00+08:00', 81),
  assessment('ch-01', 'chinese', '2026-07-08T12:00:00+08:00', 78),
  assessment('ch-02', 'chinese', '2026-07-28T12:00:00+08:00', 79),
  assessment('ch-03', 'chinese', '2026-08-09T12:00:00+08:00', 80),
  assessment('sc-01', 'science', '2026-07-09T12:00:00+08:00', 81),
  assessment('sc-02', 'science', '2026-07-25T12:00:00+08:00', 82),
  assessment('sc-03', 'science', '2026-08-11T12:00:00+08:00', 84),
  assessment('so-01', 'social', '2026-07-10T12:00:00+08:00', 74),
  assessment('so-02', 'social', '2026-07-25T12:00:00+08:00', 76),
  assessment('so-03', 'social', '2026-08-12T12:00:00+08:00', 78),
];

export const demoPlan: StudyPlanItem[] = [
  {
    id: 'math-error-review',
    subjectId: 'math',
    topic: '二次函數錯題複習',
    scheduledAt: '2026-08-14T19:00:00+08:00',
    durationMinutes: 45,
    status: 'pending',
    reasonInsightId: 'risk-math',
  },
  {
    id: 'english-vocabulary',
    subjectId: 'english',
    topic: '核心單字 20 個',
    scheduledAt: '2026-08-14T20:00:00+08:00',
    durationMinutes: 30,
    status: 'pending',
  },
  {
    id: 'science-review',
    subjectId: 'science',
    topic: '力與運動重點回顧',
    scheduledAt: '2026-08-15T19:00:00+08:00',
    durationMinutes: 30,
    status: 'done',
  },
];

export const growthScenario = {
  title: '調整後的合成示意',
  summary: '小航把數學錯題複習安排到晚間高效時段後，兩次練習的正確率由 60% 提升到 80% 與 85%。這是展示情境，不代表真實成效保證。',
  points: [60, 58, 61, 72, 80, 85],
  sessions: [
    session('growth-01', 'math', '2026-08-15T19:00:00+08:00', 45, '二次函數錯題複習', 78, 80, 90),
    session('growth-02', 'math', '2026-08-17T19:00:00+08:00', 45, '二次函數錯題複習', 82, 85, 95),
  ],
};
