import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Disclosure,
  EmptyState,
  PageHeader,
  Pill,
  RiskBadge,
  Screen,
  SectionCard,
  SectionTitle,
  SegmentedControl,
  SparkBars,
  TextButton,
  textStyles,
} from '@/components/learnpilot/ui';
import { getSubject, subjects } from '@/constants/subjects';
import { Spacing } from '@/constants/theme';
import { demoAssessments } from '@/fixtures/demo';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';
import type { SubjectId } from '@/domain/types';

function shortDate(value: string) {
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { dashboard } = useDemo();
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('math');
  const subject = getSubject(selectedSubjectId)!;
  const summary = dashboard.subjectSummaries.find((item) => item.subjectId === selectedSubjectId);
  const risk = dashboard.risks.find((item) => item.subjectId === selectedSubjectId);
  const assessments = useMemo(
    () => demoAssessments.filter((item) => item.subjectId === selectedSubjectId).sort((left, right) => left.takenAt.localeCompare(right.takenAt)),
    [selectedSubjectId],
  );
  const chartValues = assessments.map((assessment) => Math.round((assessment.score / assessment.maxScore) * 100));

  return (
    <Screen>
      <PageHeader
        eyebrow="分析"
        title="把紀錄看成方向"
        description="每個結論都標示資料量與規則依據。"
        action={<TextButton label="新增紀錄" onPress={() => router.push('/record/new')} />}
      />

      {dashboard.goldenPeriod ? (
        <SectionCard style={{ backgroundColor: theme.successSoft, borderColor: theme.successSoft }}>
          <View style={styles.goldenHeader}>
            <View style={styles.goldenCopy}>
              <Text style={[textStyles.label, { color: theme.success }]}>相對高效時段</Text>
              <Text style={[styles.goldenTime, { color: theme.text }]}>{dashboard.goldenPeriod.label}</Text>
            </View>
            <Pill label={`效率 ${dashboard.goldenPeriod.averageEfficiency}`} tone="success" />
          </View>
          <Text style={[textStyles.body, { color: theme.textSecondary }]}>{dashboard.goldenPeriod.evidence}</Text>
          <TextButton label="把重點任務排進計畫" onPress={() => router.push('/(tabs)/plan')} />
        </SectionCard>
      ) : (
        <EmptyState title="還找不到黃金時段" description="同一時段至少需要 3 筆有效紀錄，系統才會提出相對高效時段。" />
      )}

      <SectionCard>
        <SectionTitle title="科目趨勢" detail="合成評量資料" />
        <SegmentedControl
          options={subjects.map((item) => ({ value: item.id, label: item.shortName }))}
          selected={selectedSubjectId}
          onChange={setSelectedSubjectId}
        />
        {summary && chartValues.length ? (
          <>
            <View style={styles.subjectAnalyticsHeader}>
              <View>
                <Text style={[styles.subjectAnalyticsTitle, { color: theme.text }]}>{subject.name}</Text>
                <Text style={[styles.subjectAnalyticsDetail, { color: theme.textSecondary }]}>
                  近期正確率 {summary.recentAccuracy ?? '—'}% · 最近效率 {summary.recentEfficiency ?? '—'}
                </Text>
              </View>
              {risk ? <RiskBadge level={risk.level} score={risk.score} /> : null}
            </View>
            <SparkBars
              values={chartValues}
              labels={assessments.map((assessment) => shortDate(assessment.takenAt))}
              color={subject.color}
              summary={`${subject.name}共有 ${assessments.length} 筆合成評量；最新為 ${chartValues.at(-1)} 分。`}
            />
            {risk ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`查看${subject.name}風險原因`}
                onPress={() => router.push(`/risk/${selectedSubjectId}`)}
                style={({ pressed }) => [styles.riskLink, { backgroundColor: theme.surfaceMuted }, pressed && styles.pressed]}>
                <Text style={[styles.riskLinkTitle, { color: theme.text }]}>查看風險因素與門檻</Text>
                <Text style={[styles.riskLinkDetail, { color: theme.textSecondary }]}>不是預言；查看趨勢、投入與計畫狀態</Text>
                <Text style={[styles.chevron, { color: theme.primary }]}>›</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <EmptyState title="此科資料不足" description="補足評量與學習紀錄後，才能產生更可靠的趨勢摘要。" />
        )}
      </SectionCard>

      <SectionCard>
        <SectionTitle title="五科效率概況" detail="近期一半紀錄" />
        <View style={styles.comparisonList}>
          {dashboard.subjectSummaries.map((item) => {
            const itemSubject = getSubject(item.subjectId)!;
            return (
              <View key={item.subjectId} style={styles.comparisonRow}>
                <View style={styles.comparisonLabelRow}>
                  <Text style={[styles.comparisonLabel, { color: theme.text }]}>{itemSubject.name}</Text>
                  <Text style={[styles.comparisonValue, { color: theme.text }]}>{item.recentEfficiency ?? '—'}</Text>
                </View>
                <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
                  <View style={[styles.fill, { width: `${item.recentEfficiency ?? 0}%`, backgroundColor: itemSubject.color }]} />
                </View>
              </View>
            );
          })}
        </View>
      </SectionCard>

      <Disclosure>效率 = 正確率 45% + 專注度 35% + 完成度 20%。樣本不足時不產生強結論。</Disclosure>
    </Screen>
  );
}

const styles = StyleSheet.create({
  goldenHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two, alignItems: 'flex-start' },
  goldenCopy: { gap: 3 },
  goldenTime: { fontSize: 27, lineHeight: 34, fontWeight: '800', letterSpacing: -0.4 },
  subjectAnalyticsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.two },
  subjectAnalyticsTitle: { fontSize: 21, lineHeight: 28, fontWeight: '800' },
  subjectAnalyticsDetail: { fontSize: 13, lineHeight: 19, fontWeight: '600', marginTop: 2 },
  riskLink: { minHeight: 68, borderRadius: 16, paddingHorizontal: Spacing.two, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  riskLinkTitle: { flex: 1, fontSize: 14, lineHeight: 19, fontWeight: '800' },
  riskLinkDetail: { position: 'absolute', left: Spacing.two, bottom: 10, fontSize: 11, lineHeight: 15, fontWeight: '600' },
  chevron: { fontSize: 28, lineHeight: 32 },
  comparisonList: { gap: 12 },
  comparisonRow: { gap: 5 },
  comparisonLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  comparisonLabel: { fontSize: 13, lineHeight: 18, fontWeight: '700' },
  comparisonValue: { fontSize: 13, lineHeight: 18, fontWeight: '800' },
  track: { height: 9, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  pressed: { opacity: 0.72 },
});
