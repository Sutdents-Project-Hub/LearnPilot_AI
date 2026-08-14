import { RULE_VERSION, RISK_DISCLAIMER } from '../constants/rules';
import { subjects } from '../constants/subjects';

import type {
  Assessment,
  DashboardSnapshot,
  GoldenPeriod,
  Insight,
  RiskAssessment,
  RiskLevel,
  StudyPlanItem,
  StudySession,
  SubjectId,
  SubjectSummary,
  SubjectTarget,
} from './types';

const DISCLAIMER = RISK_DISCLAIMER;
const WINDOW_DAYS = 14;

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function getDurationMinutes(session: StudySession) {
  const start = new Date(session.startedAt).getTime();
  const end = new Date(session.endedAt).getTime();
  return Math.max(0, Math.round((end - start) / 60_000));
}

export function getAccuracy(session: StudySession) {
  if (!session.questionsAttempted || session.questionsCorrect > session.questionsAttempted) return null;
  return clamp((session.questionsCorrect / session.questionsAttempted) * 100);
}

export function calculateSessionEfficiency(session: StudySession) {
  const accuracy = getAccuracy(session);
  if (accuracy === null) return null;
  if (![session.focusScore, session.completionScore].every((score) => score >= 0 && score <= 100)) {
    return null;
  }
  return clamp(0.45 * accuracy + 0.35 * session.focusScore + 0.2 * session.completionScore);
}

export function sortNewestFirst<T extends { startedAt?: string; takenAt?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.startedAt ?? left.takenAt ?? 0).getTime();
    const rightTime = new Date(right.startedAt ?? right.takenAt ?? 0).getTime();
    return rightTime - leftTime;
  });
}

function getReferenceDate(sessions: StudySession[]) {
  const latest = sortNewestFirst(sessions)[0];
  return latest ? new Date(latest.startedAt) : new Date('2026-08-14T12:00:00+08:00');
}

function getRecentWindow(sessions: StudySession[]) {
  const reference = getReferenceDate(sessions);
  const cutoff = new Date(reference.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000).getTime();
  return sessions.filter((session) => new Date(session.startedAt).getTime() >= cutoff);
}

function efficiencyValues(sessions: StudySession[]) {
  return sessions
    .map(calculateSessionEfficiency)
    .filter((value): value is number => value !== null);
}

function recentAndPrevious(sessions: StudySession[]) {
  const chronological = sortNewestFirst(sessions).reverse();
  const split = Math.ceil(chronological.length / 2);
  return { previous: chronological.slice(0, split), recent: chronological.slice(split) };
}

export function calculateSubjectSummary(subjectId: SubjectId, sessions: StudySession[]): SubjectSummary {
  const subjectSessions = sessions.filter((session) => session.subjectId === subjectId);
  const { recent, previous } = recentAndPrevious(subjectSessions);
  const recentWindow = getRecentWindow(sessions).filter((session) => session.subjectId === subjectId);
  const overallEfficiency = average(efficiencyValues(subjectSessions));
  const recentEfficiency = average(efficiencyValues(recent));
  const previousEfficiency = average(efficiencyValues(previous));
  const recentAccuracy = average(recent.map(getAccuracy).filter((value): value is number => value !== null));
  const trendDelta =
    recentEfficiency !== null && previousEfficiency !== null
      ? Math.round(recentEfficiency - previousEfficiency)
      : null;

  return {
    subjectId,
    totalMinutes: subjectSessions.reduce((total, session) => total + getDurationMinutes(session), 0),
    recentMinutes: recentWindow.reduce((total, session) => total + getDurationMinutes(session), 0),
    overallEfficiency: overallEfficiency === null ? null : Math.round(overallEfficiency),
    recentEfficiency: recentEfficiency === null ? null : Math.round(recentEfficiency),
    recentAccuracy: recentAccuracy === null ? null : Math.round(recentAccuracy),
    previousEfficiency: previousEfficiency === null ? null : Math.round(previousEfficiency),
    sessionCount: subjectSessions.length,
    trendDelta,
    lastActivityAt: sortNewestFirst(subjectSessions)[0]?.startedAt,
  };
}

function periodLabel(startHour: number) {
  const endHour = (startHour + 2) % 24;
  return `${String(startHour).padStart(2, '0')}:00–${String(endHour).padStart(2, '0')}:00`;
}

function getSessionHour(session: StudySession) {
  const matchedHour = session.startedAt.match(/T(\d{2}):/);
  return matchedHour ? Number(matchedHour[1]) : new Date(session.startedAt).getHours();
}

export function calculateGoldenPeriod(sessions: StudySession[]): GoldenPeriod | null {
  const overallEfficiency = average(efficiencyValues(sessions));
  if (overallEfficiency === null) return null;
  const candidates = Array.from({ length: 23 }, (_, hour) => {
    const efficiencies = sessions
      .filter((session) => {
        const sessionHour = getSessionHour(session);
        return sessionHour >= hour && sessionHour < hour + 2;
      })
      .map(calculateSessionEfficiency)
      .filter((value): value is number => value !== null);
    return { hour, efficiencies, average: average(efficiencies) ?? 0 };
  })
    .filter((candidate) => candidate.efficiencies.length >= 3 && candidate.average > overallEfficiency)
    .sort((left, right) => right.average - left.average);
  const best = candidates[0];
  if (!best) return null;
  return {
    label: periodLabel(best.hour),
    averageEfficiency: Math.round(best.average),
    sampleSize: best.efficiencies.length,
    overallEfficiency: Math.round(overallEfficiency),
    evidence: `${best.efficiencies.length} 筆同時段紀錄的平均效率 ${Math.round(best.average)} 分，高於整體平均 ${Math.round(overallEfficiency)} 分。`,
  };
}

function calculateAssessmentDecline(subjectId: SubjectId, assessments: Assessment[]) {
  const values = sortNewestFirst(assessments.filter((assessment) => assessment.subjectId === subjectId))
    .reverse()
    .map((assessment) => (assessment.score / assessment.maxScore) * 100);
  if (values.length < 4) return { score: 0, evidence: '評量資料少於 4 筆，暫不判定成績趨勢。' };
  const midpoint = Math.floor(values.length / 2);
  const earlier = average(values.slice(0, midpoint)) ?? 0;
  const later = average(values.slice(midpoint)) ?? 0;
  const decline = Math.max(0, ((earlier - later) / Math.max(earlier, 1)) * 500);
  return {
    score: Math.round(clamp(decline)),
    evidence:
      later < earlier
        ? `近期評量平均 ${Math.round(later)} 分，較前期 ${Math.round(earlier)} 分下降。`
        : `近期評量平均 ${Math.round(later)} 分，未低於前期 ${Math.round(earlier)} 分。`,
  };
}

function calculateEfficiencyDecline(summary: SubjectSummary) {
  if (summary.recentEfficiency === null || summary.previousEfficiency === null) {
    return { score: 0, evidence: '效率資料不足，暫不判定近期變化。' };
  }
  const decline = Math.max(
    0,
    ((summary.previousEfficiency - summary.recentEfficiency) / Math.max(summary.previousEfficiency, 1)) * 400,
  );
  return {
    score: Math.round(clamp(decline)),
    evidence:
      summary.recentEfficiency < summary.previousEfficiency
        ? `近期效率 ${summary.recentEfficiency} 分，較前期 ${summary.previousEfficiency} 分下降。`
        : `近期效率 ${summary.recentEfficiency} 分，沒有低於前期 ${summary.previousEfficiency} 分。`,
  };
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 60) return 'risk';
  if (score >= 40) return 'attention';
  return 'stable';
}

export function calculateRisk(
  subjectId: SubjectId,
  sessions: StudySession[],
  assessments: Assessment[],
  plan: StudyPlanItem[],
  targets: SubjectTarget,
): RiskAssessment {
  const summary = calculateSubjectSummary(subjectId, sessions);
  const performance = calculateAssessmentDecline(subjectId, assessments);
  const efficiency = calculateEfficiencyDecline(summary);
  const target = targets[subjectId];
  const timeScore = Math.round(clamp(((target - summary.recentMinutes) / Math.max(target, 1)) * 100));
  const subjectPlan = plan.filter((item) => item.subjectId === subjectId);
  const planScore = subjectPlan.length
    ? Math.round((subjectPlan.filter((item) => item.status === 'pending').length / subjectPlan.length) * 100)
    : 0;
  const score = Math.round(
    clamp(performance.score * 0.4 + timeScore * 0.25 + efficiency.score * 0.25 + planScore * 0.1),
  );

  return {
    subjectId,
    score,
    level: getRiskLevel(score),
    factors: [
      {
        id: 'performance',
        label: '近期表現趨勢',
        score: performance.score,
        contribution: Math.round(performance.score * 0.4),
        evidence: performance.evidence,
      },
      {
        id: 'time',
        label: '近期投入與目標',
        score: timeScore,
        contribution: Math.round(timeScore * 0.25),
        evidence: `最近 ${WINDOW_DAYS} 天投入 ${summary.recentMinutes} 分鐘；此 Demo 科目目標為 ${target} 分鐘。`,
      },
      {
        id: 'efficiency',
        label: '近期效率變化',
        score: efficiency.score,
        contribution: Math.round(efficiency.score * 0.25),
        evidence: efficiency.evidence,
      },
      {
        id: 'plan',
        label: '計畫完成狀態',
        score: planScore,
        contribution: Math.round(planScore * 0.1),
        evidence: subjectPlan.length
          ? `${subjectPlan.filter((item) => item.status === 'pending').length} 項待辦尚未完成。`
          : '此科目沒有待完成計畫。',
      },
    ],
    sampleSize: summary.sessionCount,
    evaluatedAt: getReferenceDate(sessions).toISOString(),
    ruleVersion: RULE_VERSION,
    disclaimer: DISCLAIMER,
  };
}

export function calculatePlanCompletion(plan: StudyPlanItem[]) {
  if (!plan.length) return 0;
  return Math.round((plan.filter((item) => item.status === 'done').length / plan.length) * 100);
}

export function generateInsights(
  risks: RiskAssessment[],
  goldenPeriod: GoldenPeriod | null,
  summaries: SubjectSummary[],
  statuses: Record<string, Insight['status']> = {},
): Insight[] {
  const highestRisk = [...risks].sort((left, right) => right.score - left.score)[0];
  const insights: Insight[] = [];
  if (highestRisk && highestRisk.level !== 'stable') {
    const subjectName = subjects.find((subject) => subject.id === highestRisk.subjectId)?.name ?? '該科目';
    insights.push({
      id: `risk-${highestRisk.subjectId}`,
      kind: 'risk',
      severity: highestRisk.level === 'risk' ? 'high' : 'attention',
      title: `${subjectName}需要優先照顧`,
      reason: `規則式風險分數 ${highestRisk.score}，目前為「${highestRisk.level === 'risk' ? '風險' : '注意'}」等級。`,
      evidence: highestRisk.factors
        .filter((factor) => factor.contribution > 0)
        .sort((left, right) => right.contribution - left.contribution)
        .slice(0, 2)
        .map((factor) => factor.evidence)
        .join(' '),
      action: goldenPeriod
        ? `把 ${subjectName} 的錯題複習排在 ${goldenPeriod.label}，先完成 45 分鐘的小目標。`
        : `先安排一次 ${subjectName} 錯題複習，補足更多紀錄後再判讀。`,
      disclaimer: DISCLAIMER,
      relatedSubjectId: highestRisk.subjectId,
      status: statuses[`risk-${highestRisk.subjectId}`] ?? 'pending',
    });
  }
  if (goldenPeriod) {
    insights.push({
      id: 'golden-period',
      kind: 'golden-period',
      severity: 'info',
      title: `${goldenPeriod.label} 是你的相對高效時段`,
      reason: `同一時段平均效率為 ${goldenPeriod.averageEfficiency} 分。`,
      evidence: goldenPeriod.evidence,
      action: '把需要專注的錯題整理或閱讀任務排到這個時段。',
      disclaimer: DISCLAIMER,
      status: statuses['golden-period'] ?? 'pending',
    });
  }
  const improving = summaries
    .filter((summary) => (summary.trendDelta ?? 0) > 0)
    .sort((left, right) => (right.trendDelta ?? 0) - (left.trendDelta ?? 0))[0];
  if (improving) {
    const subjectName = subjects.find((subject) => subject.id === improving.subjectId)?.name ?? '一科';
    insights.push({
      id: `progress-${improving.subjectId}`,
      kind: 'progress',
      severity: 'info',
      title: `${subjectName}維持穩定節奏`,
      reason: `近期效率較前期增加 ${improving.trendDelta} 分。`,
      evidence: `目前已有 ${improving.sessionCount} 筆 ${subjectName} 合成學習紀錄。`,
      action: '維持目前節奏，下一次可安排複習而非一次增加更多任務。',
      disclaimer: DISCLAIMER,
      relatedSubjectId: improving.subjectId,
      status: statuses[`progress-${improving.subjectId}`] ?? 'pending',
    });
  }
  return insights;
}

export function buildDashboard(
  sessions: StudySession[],
  assessments: Assessment[],
  plan: StudyPlanItem[],
  targets: SubjectTarget,
  statuses: Record<string, Insight['status']> = {},
): DashboardSnapshot {
  const subjectSummaries = subjects.map((subject) => calculateSubjectSummary(subject.id, sessions));
  const risks = subjects.map((subject) => calculateRisk(subject.id, sessions, assessments, plan, targets));
  const goldenPeriod = calculateGoldenPeriod(sessions);
  const reference = getReferenceDate(sessions);
  const todayKey = reference.toISOString().slice(0, 10);
  const todayMinutes = sessions
    .filter((session) => new Date(session.startedAt).toISOString().slice(0, 10) === todayKey)
    .reduce((total, session) => total + getDurationMinutes(session), 0);
  const weeklyCutoff = reference.getTime() - 7 * 24 * 60 * 60 * 1000;
  const weeklyMinutes = sessions
    .filter((session) => new Date(session.startedAt).getTime() >= weeklyCutoff)
    .reduce((total, session) => total + getDurationMinutes(session), 0);
  return {
    overallEfficiency: (() => {
      const value = average(efficiencyValues(sessions));
      return value === null ? null : Math.round(value);
    })(),
    todayMinutes,
    weeklyMinutes,
    planCompletion: calculatePlanCompletion(plan),
    subjectSummaries,
    risks,
    goldenPeriod,
    insights: generateInsights(risks, goldenPeriod, subjectSummaries, statuses),
    evaluatedAt: reference.toISOString(),
  };
}

export function validateSessionInput(input: Omit<StudySession, 'id' | 'endedAt' | 'source'>) {
  if (!input.topic.trim()) return '請輸入本次學習單元。';
  if (!input.questionsAttempted || input.questionsCorrect > input.questionsAttempted) {
    return '答題數需要大於 0，且答對題數不能超過總題數。';
  }
  if (![input.focusScore, input.completionScore].every((score) => score >= 0 && score <= 100)) {
    return '專注度與完成度需介於 0 到 100。';
  }
  return null;
}
