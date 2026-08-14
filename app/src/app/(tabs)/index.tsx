import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Disclosure,
  Metric,
  PageHeader,
  PrimaryButton,
  RiskBadge,
  Screen,
  SectionCard,
  SectionTitle,
  SubjectRow,
  TextButton,
  textStyles,
} from '@/components/learnpilot/ui';
import { getSubject, subjects } from '@/constants/subjects';
import { Spacing } from '@/constants/theme';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';

export default function TodayScreen() {
  const router = useRouter();
  const { dashboard, state } = useDemo();
  const theme = useTheme();
  const priorityRisk = [...dashboard.risks].sort((left, right) => right.score - left.score)[0];
  const prioritySubject = priorityRisk ? getSubject(priorityRisk.subjectId) : undefined;
  const priorityInsight = dashboard.insights.find((insight) => insight.id === `risk-${priorityRisk?.subjectId}`);
  const pendingPlans = state.plan.filter((item) => item.status === 'pending');

  return (
    <Screen>
      <PageHeader
        eyebrow="LEARNPILOT AI"
        title="早安，小航"
        description="把今天的每一段投入，走成看得見的成長。"
        action={<TextButton label="Demo 說明" onPress={() => router.push('/about-demo')} />}
      />

      <Disclosure>合成資料 Demo｜本機規則式分析｜不會上傳或保存真實學生資料</Disclosure>

      {priorityRisk && prioritySubject && priorityInsight ? (
        <SectionCard style={{ backgroundColor: theme.dangerSoft, borderColor: theme.dangerSoft }}>
          <View style={styles.priorityHeader}>
            <View style={styles.priorityCopy}>
              <Text style={[textStyles.label, { color: theme.danger }]}>本次最優先</Text>
              <Text style={[styles.priorityTitle, { color: theme.text }]}>{priorityInsight.title}</Text>
            </View>
            <RiskBadge level={priorityRisk.level} score={priorityRisk.score} />
          </View>
          <Text style={[textStyles.body, { color: theme.textSecondary }]} numberOfLines={2}>
            {priorityInsight.action}
          </Text>
          <PrimaryButton label="查看原因與下一步" onPress={() => router.push(`/insight/${priorityInsight.id}`)} />
        </SectionCard>
      ) : null}

      <View style={styles.metricsRow}>
        <Metric label="整體效率" value={`${dashboard.overallEfficiency ?? '—'}`} helper="綜合專注與正確率" />
        <Metric label="最近 7 天" value={`${dashboard.weeklyMinutes} 分`} helper="合成練習投入" tone="success" />
        <Metric label="計畫完成" value={`${dashboard.planCompletion}%`} helper="可隨時調整" tone="info" />
      </View>

      <SectionCard>
        <SectionTitle title="今天先完成一件事" detail={`${pendingPlans.length} 項待辦`} />
        {pendingPlans.length ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="查看今天的讀書計畫"
            onPress={() => router.push('/(tabs)/plan')}
            style={({ pressed }) => [styles.nextStep, { backgroundColor: theme.surfaceMuted }, pressed && styles.pressed]}>
            <View style={styles.timeBlock}>
              <Text style={[styles.timeLabel, { color: theme.primaryStrong }]}>19:00</Text>
              <Text style={[styles.timeSubLabel, { color: theme.textSecondary }]}>今晚</Text>
            </View>
            <View style={styles.nextCopy}>
              <Text style={[styles.nextTitle, { color: theme.text }]}>{pendingPlans[0].topic}</Text>
              <Text style={[styles.nextDetail, { color: theme.textSecondary }]}>
                {prioritySubject?.name ?? '數學'} · {pendingPlans[0].durationMinutes} 分鐘 · 依高效時段安排
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.primary }]}>›</Text>
          </Pressable>
        ) : (
          <Text style={[textStyles.body, { color: theme.textSecondary }]}>今天的計畫已完成，保留一些空白時間讓自己休息。</Text>
        )}
      </SectionCard>

      <SectionCard>
        <SectionTitle title="五科學習平衡" detail="點選看趨勢" />
        <View style={styles.subjectList}>
          {dashboard.subjectSummaries.map((summary) => {
            const subject = subjects.find((item) => item.id === summary.subjectId);
            if (!subject) return null;
            const risk = dashboard.risks.find((item) => item.subjectId === summary.subjectId);
            return (
              <SubjectRow
                key={summary.subjectId}
                subject={subject}
                value={summary.recentEfficiency}
                trend={summary.trendDelta}
                detail={`${summary.sessionCount} 筆紀錄 · ${risk ? `${risk.level === 'stable' ? '穩定' : risk.level === 'attention' ? '注意' : '需優先處理'}` : '資料不足'}`}
                onPress={() => router.push(`/risk/${summary.subjectId}`)}
              />
            );
          })}
        </View>
      </SectionCard>

      {state.lastAddedSessionId ? (
        <SectionCard style={{ backgroundColor: theme.successSoft, borderColor: theme.successSoft }}>
          <Text style={[textStyles.label, { color: theme.success }]}>已更新本次 Demo</Text>
          <Text style={[textStyles.body, { color: theme.text }]}>新紀錄已納入總覽與分析；你可以到分析頁檢視最新結果。</Text>
        </SectionCard>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  priorityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.two },
  priorityCopy: { flex: 1, gap: 3 },
  priorityTitle: { fontSize: 22, lineHeight: 29, fontWeight: '800', letterSpacing: -0.3 },
  metricsRow: { flexDirection: 'row', gap: 8 },
  nextStep: { minHeight: 80, borderRadius: 18, padding: Spacing.two, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  timeBlock: { width: 43, alignItems: 'center', gap: 1 },
  timeLabel: { fontSize: 14, lineHeight: 19, fontWeight: '800' },
  timeSubLabel: { fontSize: 11, lineHeight: 15, fontWeight: '700' },
  nextCopy: { flex: 1, gap: 2 },
  nextTitle: { fontSize: 15, lineHeight: 21, fontWeight: '800' },
  nextDetail: { fontSize: 12, lineHeight: 17, fontWeight: '600' },
  chevron: { fontSize: 30, lineHeight: 34, fontWeight: '500' },
  subjectList: { gap: 11 },
  pressed: { opacity: 0.72 },
});
