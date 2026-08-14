export const SUBJECT_IDS = ['chinese', 'english', 'math', 'science', 'social'] as const;

export type SubjectId = (typeof SUBJECT_IDS)[number];
export type SessionSource = 'synthetic' | 'demo-input';
export type PlanStatus = 'pending' | 'done' | 'skipped';
export type RiskLevel = 'stable' | 'attention' | 'risk';
export type InsightStatus = 'pending' | 'accepted' | 'skipped';

export type Subject = {
  id: SubjectId;
  name: string;
  shortName: string;
  color: string;
  lightColor: string;
};

export type StudentProfile = {
  id: string;
  displayName: string;
  gradeBand: string;
  dataDisclosure: string;
};

export type StudySession = {
  id: string;
  startedAt: string;
  endedAt: string;
  subjectId: SubjectId;
  topic: string;
  focusScore: number;
  questionsAttempted: number;
  questionsCorrect: number;
  completionScore: number;
  source: SessionSource;
};

export type Assessment = {
  id: string;
  subjectId: SubjectId;
  takenAt: string;
  score: number;
  maxScore: number;
  source: 'synthetic';
};

export type StudyPlanItem = {
  id: string;
  subjectId: SubjectId;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  status: PlanStatus;
  reasonInsightId?: string;
};

export type SubjectTarget = Record<SubjectId, number>;

export type RiskFactor = {
  id: 'performance' | 'time' | 'efficiency' | 'plan';
  label: string;
  score: number;
  contribution: number;
  evidence: string;
};

export type RiskAssessment = {
  subjectId: SubjectId;
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  sampleSize: number;
  evaluatedAt: string;
  ruleVersion: string;
  disclaimer: string;
};

export type GoldenPeriod = {
  label: string;
  averageEfficiency: number;
  sampleSize: number;
  overallEfficiency: number;
  evidence: string;
};

export type SubjectSummary = {
  subjectId: SubjectId;
  totalMinutes: number;
  recentMinutes: number;
  overallEfficiency: number | null;
  recentEfficiency: number | null;
  recentAccuracy: number | null;
  previousEfficiency: number | null;
  sessionCount: number;
  trendDelta: number | null;
  lastActivityAt?: string;
};

export type Insight = {
  id: string;
  kind: 'risk' | 'golden-period' | 'progress' | 'data';
  severity: 'info' | 'attention' | 'high';
  title: string;
  reason: string;
  evidence: string;
  action: string;
  disclaimer: string;
  relatedSubjectId?: SubjectId;
  status: InsightStatus;
};

export type DashboardSnapshot = {
  overallEfficiency: number | null;
  todayMinutes: number;
  weeklyMinutes: number;
  planCompletion: number;
  subjectSummaries: SubjectSummary[];
  risks: RiskAssessment[];
  goldenPeriod: GoldenPeriod | null;
  insights: Insight[];
  evaluatedAt: string;
};
