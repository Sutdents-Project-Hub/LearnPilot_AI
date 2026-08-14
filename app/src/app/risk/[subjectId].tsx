import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  EmptyState,
  PageHeader,
  PrimaryButton,
  RiskBadge,
  Screen,
  SectionCard,
  SectionTitle,
  SubjectAvatar,
  textStyles,
} from '@/components/learnpilot/ui';
import { getSubject } from '@/constants/subjects';
import { Spacing } from '@/constants/theme';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';
import type { SubjectId } from '@/domain/types';

const factorLabels = {
  performance: '近期表現趨勢',
  time: '近期投入與目標',
  efficiency: '近期效率變化',
  plan: '計畫完成狀態',
};

export default function RiskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ subjectId: SubjectId }>();
  const theme = useTheme();
  const { dashboard } = useDemo();
  const subject = params.subjectId ? getSubject(params.subjectId) : undefined;
  const risk = dashboard.risks.find((item) => item.subjectId === params.subjectId);
  const insight = dashboard.insights.find((item) => item.id === `risk-${params.subjectId}`);

  if (!subject || !risk) {
    return (
      <Screen>
        <EmptyState title="找不到這個科目的分析" description="請回到分析頁重新選擇科目。" />
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader eyebrow="規則式趨勢提示" title={`${subject.name}風險詳情`} description="不是成績預言；請用它決定下一個可執行的小行動。" />
      <SectionCard style={{ backgroundColor: risk.level === 'risk' ? theme.dangerSoft : risk.level === 'attention' ? theme.warningSoft : theme.successSoft, borderColor: 'transparent' }}>
        <View style={styles.riskHero}>
          <SubjectAvatar subject={subject} size={48} />
          <View style={styles.riskHeroCopy}>
            <Text style={[textStyles.label, { color: theme.textSecondary }]}>本次規則分數</Text>
            <Text style={[styles.riskScore, { color: theme.text }]}>{risk.score}</Text>
          </View>
          <RiskBadge level={risk.level} />
        </View>
        <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>使用 {risk.sampleSize} 筆學習紀錄，規則版本 {risk.ruleVersion}。</Text>
      </SectionCard>

      <SectionCard>
        <SectionTitle title="造成分數的因素" detail="點數不是單一成績" />
        <View style={styles.factorList}>
          {risk.factors.map((factor) => (
            <View key={factor.id} style={styles.factor}>
              <View style={styles.factorTop}>
                <Text style={[styles.factorTitle, { color: theme.text }]}>{factorLabels[factor.id]}</Text>
                <Text style={[styles.factorScore, { color: factor.contribution > 12 ? theme.danger : theme.textSecondary }]}>+{factor.contribution}</Text>
              </View>
              <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>{factor.evidence}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {insight ? (
        <SectionCard>
          <Text style={[textStyles.label, { color: theme.primaryStrong }]}>可行的下一步</Text>
          <Text style={[styles.nextAction, { color: theme.text }]}>{insight.action}</Text>
          <PrimaryButton label="查看建議並加入計畫" onPress={() => router.push(`/insight/${insight.id}`)} />
        </SectionCard>
      ) : null}

      <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>{risk.disclaimer}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  riskHero: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  riskHeroCopy: { flex: 1, gap: 1 },
  riskScore: { fontSize: 38, lineHeight: 44, fontWeight: '800', letterSpacing: -1 },
  factorList: { gap: 16 },
  factor: { gap: 5 },
  factorTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  factorTitle: { fontSize: 14, lineHeight: 20, fontWeight: '800' },
  factorScore: { fontSize: 13, lineHeight: 18, fontWeight: '800' },
  nextAction: { fontSize: 17, lineHeight: 25, fontWeight: '800' },
  disclaimer: { fontSize: 12, lineHeight: 18, fontWeight: '600', paddingHorizontal: Spacing.one },
});
