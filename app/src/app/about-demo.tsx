import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  PageHeader,
  PrimaryButton,
  Screen,
  SectionCard,
  SectionTitle,
  textStyles,
} from '@/components/learnpilot/ui';
import { FIXTURE_VERSION, RULE_VERSION } from '@/constants/rules';
import { Spacing } from '@/constants/theme';
import { demoProfile } from '@/fixtures/demo';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';

export default function AboutDemoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { resetDemo } = useDemo();
  return (
    <Screen>
      <PageHeader eyebrow="DEMO 揭露" title="這個展示怎麼運作？" description="誠實說明資料來源、規則邊界與可以做、不能做的事情。" />
      <SectionCard>
        <SectionTitle title="資料" />
        <Text style={[textStyles.body, { color: theme.text }]}>{demoProfile.dataDisclosure}</Text>
        <View style={styles.keyValues}>
          <KeyValue label="展示學生" value={`${demoProfile.displayName}（完全虛構）`} />
          <KeyValue label="Fixture 版本" value={FIXTURE_VERSION} />
          <KeyValue label="儲存方式" value="只在本次記憶體 session" />
        </View>
      </SectionCard>
      <SectionCard>
        <SectionTitle title="AI 的意思" />
        <Text style={[textStyles.body, { color: theme.text }]}>本 Demo 使用可解釋的規則式模擬，不使用外部 LLM、機器學習模型或雲端服務。</Text>
        <View style={styles.keyValues}>
          <KeyValue label="效率" value="正確率、專注度、完成度加權" />
          <KeyValue label="風險" value="趨勢、投入、效率、計畫狀態" />
          <KeyValue label="規則版本" value={RULE_VERSION} />
        </View>
      </SectionCard>
      <SectionCard style={{ backgroundColor: theme.warningSoft, borderColor: theme.warningSoft }}>
        <Text style={[textStyles.label, { color: theme.warning }]}>不應宣稱</Text>
        <Text style={[textStyles.body, { color: theme.text }]}>這不是成績預言、正式教育評估、真實學生資料分析，也不代表已有 24 小時 AI 助教或雲端同步。</Text>
      </SectionCard>
      <PrimaryButton
        label="重設並回到今日總覽"
        onPress={() => {
          resetDemo();
          router.replace('/(tabs)');
        }}
      />
    </Screen>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.keyValue}>
      <Text style={[styles.keyLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.keyValueText, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  keyValues: { gap: 8, marginTop: Spacing.one },
  keyValue: { gap: 2 },
  keyLabel: { fontSize: 12, lineHeight: 17, fontWeight: '700' },
  keyValueText: { fontSize: 14, lineHeight: 20, fontWeight: '800' },
});
