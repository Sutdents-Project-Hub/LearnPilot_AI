import { describe, expect, it } from 'vitest';

import {
  buildDashboard,
  calculateGoldenPeriod,
  calculateRisk,
  calculateSessionEfficiency,
  getAccuracy,
  validateSessionInput,
} from './analysis';
import { subjectTargets } from '../constants/subjects';
import { demoAssessments, demoPlan, demoSessions } from '../fixtures/demo';
import type { StudySession } from './types';

const sampleSession: StudySession = {
  id: 'test',
  subjectId: 'math',
  startedAt: '2026-08-14T19:00:00+08:00',
  endedAt: '2026-08-14T19:30:00+08:00',
  topic: '測試',
  focusScore: 80,
  questionsAttempted: 20,
  questionsCorrect: 16,
  completionScore: 90,
  source: 'synthetic',
};

describe('LearnPilot rule-based analysis', () => {
  it('calculates accuracy and weighted efficiency deterministically', () => {
    expect(getAccuracy(sampleSession)).toBe(80);
    expect(calculateSessionEfficiency(sampleSession)).toBe(82);
  });

  it('rejects an impossible accuracy input', () => {
    expect(getAccuracy({ ...sampleSession, questionsCorrect: 21 })).toBeNull();
    expect(calculateSessionEfficiency({ ...sampleSession, questionsCorrect: 21 })).toBeNull();
  });

  it('requires at least three samples before reporting a golden period', () => {
    expect(calculateGoldenPeriod(demoSessions.slice(0, 2))).toBeNull();
  });

  it('finds the documented evening golden period from the fixture', () => {
    const result = calculateGoldenPeriod(demoSessions);
    expect(result?.label).toBe('19:00–21:00');
    expect(result?.sampleSize).toBeGreaterThanOrEqual(3);
  });

  it('marks math as the highest actionable risk in the documented demo fixture', () => {
    const mathRisk = calculateRisk('math', demoSessions, demoAssessments, demoPlan, subjectTargets);
    expect(mathRisk.level).toBe('risk');
    expect(mathRisk.score).toBeGreaterThanOrEqual(60);
  });

  it('keeps a stable subject below the risk threshold', () => {
    const englishRisk = calculateRisk('english', demoSessions, demoAssessments, demoPlan, subjectTargets);
    expect(englishRisk.level).toBe('stable');
  });

  it('builds the same snapshot for the same fixture every time', () => {
    expect(buildDashboard(demoSessions, demoAssessments, demoPlan, subjectTargets)).toEqual(
      buildDashboard(demoSessions, demoAssessments, demoPlan, subjectTargets),
    );
  });

  it('validates required record fields before creating a session', () => {
    expect(validateSessionInput({ ...sampleSession, topic: '   ' })).toBe('請輸入本次學習單元。');
    expect(validateSessionInput({ ...sampleSession, questionsAttempted: 0 })).toContain('答題數');
    expect(validateSessionInput(sampleSession)).toBeNull();
  });
});
