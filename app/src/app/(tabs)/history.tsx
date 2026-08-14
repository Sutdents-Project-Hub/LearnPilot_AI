import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  Disclosure,
  PageHeader,
  PrimaryButton,
  Screen,
  SectionCard,
  SectionTitle,
  SegmentedControl,
  SparkBars,
  SubjectAvatar,
  TextButton,
  textStyles,
} from '@/components/learnpilot/ui';
import { getSubject } from '@/constants/subjects';
import { Spacing } from '@/constants/theme';
import { getDurationMinutes, sortNewestFirst } from '@/domain/analysis';
import { growthScenario } from '@/fixtures/demo';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';

function dateLabel(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function timeLabel(iso: string) {
  const matched = iso.match(/T(\d{2}:\d{2})/);
  return matched?.[1] ?? '';
}

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { state } = useDemo();
  const [view, setView] = useState<'baseline' | 'growth'>('baseline');
  const recentSessions = useMemo(() => sortNewestFirst(state.sessions).slice(0, 7), [state.sessions]);

  return (
    <Screen>
      <PageHeader
        eyebrow="歷程"
        title="看見每一次累積"
        description="把資料、行動與後續變化連成一條可回看的路。"
        action={<TextButton label="新增紀錄" onPress={() => router.push('/record/new')} />}
      />

      <SectionCard>
        <SectionTitle title="成長回顧" detail="合成展示情境" />
        <SegmentedControl
          options={[
            { value: 'baseline', label: '調整前' },
            { value: 'growth', label: '調整後示意' },
          ]}
          selected={view}
          onChange={setView}
        />
        {view === 'baseline' ? (
          <View style={styles.baselineState}>
            <Text style={[styles.baselineNumber, { color: theme.warning }]}>61</Text>
            <View style={styles.baselineCopy}>
              <Text style={[styles.baselineTitle, { color: theme.text }]}>數學近期效率偏低</Text>
              <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>這是診斷起點：數學近期效率與評量趨勢下降，因此系統建議先安排一次錯題複習。</Text>
            </View>
          </View>
        ) : (
          <>
            <SparkBars
              values={growthScenario.points}
              labels={['前 3', '前 2', '前 1', '調整 1', '調整 2', '調整 3']}
              color={theme.success}
              summary="調整後示意：兩次在高效時段的數學錯題練習，使合成正確率由 60% 提升至 85%。"
            />
            <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>{growthScenario.summary}</Text>
          </>
        )}
      </SectionCard>

      <SectionCard>
        <SectionTitle title="最近學習時間線" detail={`${state.sessions.length} 筆本機紀錄`} />
        <View style={styles.timeline}>
          {recentSessions.map((session, index) => {
            const subject = getSubject(session.subjectId)!;
            const efficiency = Math.round(0.45 * ((session.questionsCorrect / session.questionsAttempted) * 100) + 0.35 * session.focusScore + 0.2 * session.completionScore);
            return (
              <View key={session.id} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View style={[styles.timelineDot, { backgroundColor: subject.color }]} />
                  {index < recentSessions.length - 1 ? <View style={[styles.timelineLine, { backgroundColor: theme.border }]} /> : null}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineTop}>
                    <View style={styles.timelineSubject}>
                      <SubjectAvatar subject={subject} size={30} />
                      <View>
                        <Text style={[styles.timelineTitle, { color: theme.text }]}>{session.topic}</Text>
                        <Text style={[styles.timelineMeta, { color: theme.textSecondary }]}>
                          {subject.name} · {dateLabel(session.startedAt)} {timeLabel(session.startedAt)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.timelineScore, { color: theme.text }]}>{efficiency}</Text>
                  </View>
                  <Text style={[styles.timelineDetail, { color: theme.textSecondary }]}>
                    {getDurationMinutes(session)} 分鐘 · 正確率 {Math.round((session.questionsCorrect / session.questionsAttempted) * 100)}% · {session.source === 'demo-input' ? '本次新增' : '合成紀錄'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard style={{ backgroundColor: theme.primarySoft, borderColor: theme.primarySoft }}>
        <Text style={[textStyles.label, { color: theme.primaryStrong }]}>從歷程回到行動</Text>
        <Text style={[styles.returnTitle, { color: theme.text }]}>新的紀錄，會讓下一次診斷更貼近這個 Demo 情境。</Text>
        <PrimaryButton label="新增一筆學習紀錄" onPress={() => router.push('/record/new')} />
      </SectionCard>

      <Disclosure>「調整後示意」是預載合成資料，用來展示資料 → 洞察 → 行動 → 成長的產品閉環；不是成效保證。</Disclosure>
    </Screen>
  );
}

const styles = StyleSheet.create({
  baselineState: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center', paddingVertical: Spacing.one },
  baselineNumber: { fontSize: 44, lineHeight: 50, fontWeight: '800', letterSpacing: -1 },
  baselineCopy: { flex: 1, gap: 3 },
  baselineTitle: { fontSize: 16, lineHeight: 22, fontWeight: '800' },
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', minHeight: 80 },
  timelineRail: { width: 22, alignItems: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 99, marginTop: 11 },
  timelineLine: { width: 2, flex: 1, marginTop: 5, marginBottom: -2 },
  timelineContent: { flex: 1, paddingBottom: Spacing.two, gap: 4 },
  timelineTop: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.one },
  timelineSubject: { flexDirection: 'row', flex: 1, gap: 9, alignItems: 'center' },
  timelineTitle: { fontSize: 14, lineHeight: 19, fontWeight: '800' },
  timelineMeta: { fontSize: 11, lineHeight: 16, fontWeight: '600' },
  timelineScore: { fontSize: 16, lineHeight: 22, fontWeight: '800' },
  timelineDetail: { fontSize: 12, lineHeight: 17, fontWeight: '600', paddingLeft: 39 },
  returnTitle: { fontSize: 17, lineHeight: 24, fontWeight: '800' },
});
