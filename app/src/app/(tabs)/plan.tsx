import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Disclosure,
  EmptyState,
  PageHeader,
  Pill,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionCard,
  SectionTitle,
  TextButton,
  textStyles,
} from '@/components/learnpilot/ui';
import { getSubject } from '@/constants/subjects';
import { Spacing } from '@/constants/theme';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';

function statusLabel(status: 'pending' | 'done' | 'skipped') {
  if (status === 'done') return '已完成';
  if (status === 'skipped') return '已略過';
  return '待完成';
}

export default function PlanScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { dashboard, state, setInsightStatus, setPlanStatus, resetDemo } = useDemo();
  const priorityInsight = dashboard.insights.find((insight) => insight.kind === 'risk');

  return (
    <Screen>
      <PageHeader
        eyebrow="計畫"
        title="下一步，走得剛好"
        description="建議是選項；你可以接受、略過或自行調整。"
        action={<TextButton label="重設 Demo" onPress={resetDemo} />}
      />

      {priorityInsight ? (
        <SectionCard style={{ backgroundColor: theme.primarySoft, borderColor: theme.primarySoft }}>
          <View style={styles.recommendationTop}>
            <View style={styles.recommendationCopy}>
              <Text style={[textStyles.label, { color: theme.primaryStrong }]}>系統建議</Text>
              <Text style={[styles.recommendationTitle, { color: theme.text }]}>{priorityInsight.title}</Text>
            </View>
            <Pill
              label={priorityInsight.status === 'accepted' ? '已接受' : priorityInsight.status === 'skipped' ? '已略過' : '等待你的決定'}
              tone={priorityInsight.status === 'accepted' ? 'success' : priorityInsight.status === 'skipped' ? 'neutral' : 'primary'}
            />
          </View>
          <Text style={[textStyles.body, { color: theme.textSecondary }]}>{priorityInsight.action}</Text>
          <TextButton label="查看依據與限制" onPress={() => router.push(`/insight/${priorityInsight.id}`)} />
          {priorityInsight.status === 'pending' ? (
            <View style={styles.buttonRow}>
              <PrimaryButton label="加入今天計畫" style={styles.flexButton} onPress={() => setInsightStatus(priorityInsight.id, 'accepted')} />
              <SecondaryButton label="先略過" style={styles.flexButton} onPress={() => setInsightStatus(priorityInsight.id, 'skipped')} />
            </View>
          ) : null}
        </SectionCard>
      ) : (
        <EmptyState title="目前沒有需要優先處理的建議" description="補足更多合成紀錄後，系統才會產生可說明的下一步。" />
      )}

      <SectionCard>
        <SectionTitle title="今日與近期安排" detail={`${state.plan.filter((item) => item.status === 'pending').length} 項待完成`} />
        <View style={styles.planList}>
          {state.plan.map((item) => {
            const subject = getSubject(item.subjectId)!;
            const isDone = item.status === 'done';
            const isSkipped = item.status === 'skipped';
            return (
              <Pressable
                key={item.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDone, disabled: isSkipped }}
                accessibilityLabel={`${item.topic}，${statusLabel(item.status)}。點擊${isDone ? '設為待完成' : '設為已完成'}`}
                disabled={isSkipped}
                onPress={() => setPlanStatus(item.id, isDone ? 'pending' : 'done')}
                style={({ pressed }) => [
                  styles.planItem,
                  { backgroundColor: theme.surfaceMuted },
                  isSkipped && styles.skipped,
                  pressed && !isSkipped && styles.pressed,
                ]}>
                <View
                  style={[
                    styles.check,
                    { borderColor: isDone ? theme.success : theme.border, backgroundColor: isDone ? theme.success : theme.surface },
                  ]}>
                  {isDone ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <View style={styles.planCopy}>
                  <View style={styles.planTitleRow}>
                    <Text style={[styles.planTitle, { color: isSkipped ? theme.textSecondary : theme.text }]}>{item.topic}</Text>
                    <Text style={[styles.planStatus, { color: isDone ? theme.success : isSkipped ? theme.textSecondary : theme.warning }]}>
                      {statusLabel(item.status)}
                    </Text>
                  </View>
                  <Text style={[styles.planDetail, { color: theme.textSecondary }]}>
                    {subject.name} · {item.durationMinutes} 分鐘 · {item.scheduledAt.includes('08-14') ? '今晚' : '明天'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="安排邏輯" />
        <View style={styles.logicList}>
          <View style={styles.logicRow}>
            <Text style={[styles.logicNumber, { color: theme.primary }]}>01</Text>
            <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>先處理風險分數較高、且能說明原因的科目。</Text>
          </View>
          <View style={styles.logicRow}>
            <Text style={[styles.logicNumber, { color: theme.primary }]}>02</Text>
            <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>若資料足夠，優先排入相對高效的時段。</Text>
          </View>
          <View style={styles.logicRow}>
            <Text style={[styles.logicNumber, { color: theme.primary }]}>03</Text>
            <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>任務只是一個起點，學生可以自行調整或略過。</Text>
          </View>
        </View>
      </SectionCard>

      <Disclosure>接受或勾選任務只會改變本次 App 記憶體中的 Demo；重設後會回到固定展示情境。</Disclosure>
    </Screen>
  );
}

const styles = StyleSheet.create({
  recommendationTop: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two, alignItems: 'flex-start' },
  recommendationCopy: { flex: 1, gap: 3 },
  recommendationTitle: { fontSize: 21, lineHeight: 28, fontWeight: '800' },
  buttonRow: { flexDirection: 'row', gap: 8 },
  flexButton: { flex: 1 },
  planList: { gap: 10 },
  planItem: { minHeight: 74, borderRadius: 17, padding: Spacing.two, flexDirection: 'row', alignItems: 'center', gap: 11 },
  planCopy: { flex: 1, gap: 3 },
  planTitleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.one },
  planTitle: { flex: 1, fontSize: 14, lineHeight: 19, fontWeight: '800' },
  planStatus: { fontSize: 12, lineHeight: 17, fontWeight: '800' },
  planDetail: { fontSize: 12, lineHeight: 17, fontWeight: '600' },
  check: { width: 26, height: 26, borderWidth: 2, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  checkMark: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', lineHeight: 18 },
  skipped: { opacity: 0.6 },
  logicList: { gap: 12 },
  logicRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  logicNumber: { fontSize: 12, lineHeight: 19, fontWeight: '900' },
  pressed: { opacity: 0.72 },
});
