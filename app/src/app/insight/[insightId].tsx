import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  EmptyState,
  PageHeader,
  Pill,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionCard,
  textStyles,
} from '@/components/learnpilot/ui';
import { getSubject } from '@/constants/subjects';
import { Spacing } from '@/constants/theme';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';

export default function InsightDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ insightId: string }>();
  const theme = useTheme();
  const { getInsight, setInsightStatus } = useDemo();
  const insight = params.insightId ? getInsight(params.insightId) : undefined;
  const subject = insight?.relatedSubjectId ? getSubject(insight.relatedSubjectId) : undefined;

  if (!insight) {
    return (
      <Screen>
        <EmptyState title="找不到這則建議" description="這則建議可能已在 Demo 重設後消失。" />
      </Screen>
    );
  }

  const tone = insight.severity === 'high' ? 'danger' : insight.severity === 'attention' ? 'warning' : 'info';
  const statusLabel = insight.status === 'accepted' ? '已加入計畫' : insight.status === 'skipped' ? '已略過' : '等待你的決定';

  return (
    <Screen>
      <PageHeader eyebrow="可解釋建議" title={insight.title} description={subject ? `關聯科目：${subject.name}` : '依你的合成學習紀錄產生'} />
      <SectionCard style={{ backgroundColor: tone === 'danger' ? theme.dangerSoft : tone === 'warning' ? theme.warningSoft : theme.infoSoft, borderColor: 'transparent' }}>
        <View style={styles.topRow}>
          <Text style={[textStyles.label, { color: theme.textSecondary }]}>建議狀態</Text>
          <Pill label={statusLabel} tone={tone} />
        </View>
        <Text style={[styles.action, { color: theme.text }]}>{insight.action}</Text>
      </SectionCard>

      <SectionCard>
        <Text style={[textStyles.label, { color: theme.primaryStrong }]}>為什麼出現這個建議？</Text>
        <Text style={[styles.reason, { color: theme.text }]}>{insight.reason}</Text>
        <Text style={[textStyles.body, { color: theme.textSecondary }]}>{insight.evidence}</Text>
      </SectionCard>

      {insight.status === 'pending' ? (
        <View style={styles.actions}>
          <PrimaryButton
            label={insight.kind === 'risk' ? '接受並前往計畫' : '知道了'}
            onPress={() => {
              setInsightStatus(insight.id, 'accepted');
              router.replace('/(tabs)/plan');
            }}
          />
          <SecondaryButton
            label="這次先略過"
            onPress={() => {
              setInsightStatus(insight.id, 'skipped');
              router.back();
            }}
          />
        </View>
      ) : (
        <PrimaryButton label="回到讀書計畫" onPress={() => router.replace('/(tabs)/plan')} />
      )}

      <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>{insight.disclaimer}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  action: { fontSize: 20, lineHeight: 29, fontWeight: '800' },
  reason: { fontSize: 17, lineHeight: 24, fontWeight: '800' },
  actions: { gap: 8 },
  disclaimer: { fontSize: 12, lineHeight: 18, fontWeight: '600', paddingHorizontal: Spacing.one },
});
