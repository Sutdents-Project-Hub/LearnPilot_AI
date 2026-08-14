import { createContext, useContext, useMemo, useReducer, type PropsWithChildren } from 'react';

import { subjectTargets } from '@/constants/subjects';
import { buildDashboard, validateSessionInput } from '@/domain/analysis';
import type { Insight, InsightStatus, PlanStatus, StudyPlanItem, StudySession, SubjectId } from '@/domain/types';
import { demoAssessments, demoPlan, demoSessions } from '@/fixtures/demo';

type RecordDraft = {
  subjectId: SubjectId;
  topic: string;
  durationMinutes: number;
  focusScore: number;
  accuracyScore: number;
  completionScore: number;
  startHour: number;
};

type DemoState = {
  sessions: StudySession[];
  plan: StudyPlanItem[];
  insightStatuses: Record<string, InsightStatus>;
  lastAddedSessionId?: string;
};

type DemoAction =
  | { type: 'record/add'; session: StudySession }
  | { type: 'plan/set-status'; id: string; status: PlanStatus }
  | { type: 'insight/set-status'; id: string; status: InsightStatus }
  | { type: 'demo/reset' };

const initialState: DemoState = {
  sessions: demoSessions,
  plan: demoPlan,
  insightStatuses: {},
};

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'record/add':
      return { ...state, sessions: [...state.sessions, action.session], lastAddedSessionId: action.session.id };
    case 'plan/set-status':
      return {
        ...state,
        plan: state.plan.map((item) => (item.id === action.id ? { ...item, status: action.status } : item)),
      };
    case 'insight/set-status':
      return {
        ...state,
        insightStatuses: { ...state.insightStatuses, [action.id]: action.status },
        plan: state.plan.map((item) =>
          item.reasonInsightId === action.id && action.status === 'skipped'
            ? { ...item, status: 'skipped' }
            : item,
        ),
      };
    case 'demo/reset':
      return initialState;
  }
}

type DemoContextValue = {
  state: DemoState;
  dashboard: ReturnType<typeof buildDashboard>;
  addRecord: (draft: RecordDraft) => { error?: string; session?: StudySession };
  setPlanStatus: (id: string, status: PlanStatus) => void;
  setInsightStatus: (id: string, status: InsightStatus) => void;
  resetDemo: () => void;
  getInsight: (id: string) => Insight | undefined;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dashboard = useMemo(
    () => buildDashboard(state.sessions, demoAssessments, state.plan, subjectTargets, state.insightStatuses),
    [state.insightStatuses, state.plan, state.sessions],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      dashboard,
      addRecord: (draft) => {
        const startedAt = `2026-08-14T${String(draft.startHour).padStart(2, '0')}:00:00+08:00`;
        const session: StudySession = {
          id: `demo-input-${state.sessions.length + 1}`,
          subjectId: draft.subjectId,
          startedAt,
          endedAt: new Date(new Date(startedAt).getTime() + draft.durationMinutes * 60_000).toISOString(),
          topic: draft.topic.trim(),
          focusScore: draft.focusScore,
          questionsAttempted: 20,
          questionsCorrect: Math.round((draft.accuracyScore / 100) * 20),
          completionScore: draft.completionScore,
          source: 'demo-input',
        };
        const error = validateSessionInput(session);
        if (error) return { error };
        dispatch({ type: 'record/add', session });
        return { session };
      },
      setPlanStatus: (id, status) => dispatch({ type: 'plan/set-status', id, status }),
      setInsightStatus: (id, status) => dispatch({ type: 'insight/set-status', id, status }),
      resetDemo: () => dispatch({ type: 'demo/reset' }),
      getInsight: (id) => dashboard.insights.find((insight) => insight.id === id),
    }),
    [dashboard, state],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
}

export type { RecordDraft };
