import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  PageHeader,
  PrimaryButton,
  Screen,
  SectionCard,
  SegmentedControl,
  textStyles,
} from '@/components/learnpilot/ui';
import { subjects } from '@/constants/subjects';
import { Spacing } from '@/constants/theme';
import { useDemo } from '@/features/demo/demo-provider';
import { useTheme } from '@/hooks/use-theme';
import type { SubjectId } from '@/domain/types';

export default function NewRecordScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addRecord } = useDemo();
  const [subjectId, setSubjectId] = useState<SubjectId>('math');
  const [topic, setTopic] = useState('二次函數錯題複習');
  const [duration, setDuration] = useState<'30' | '45' | '60'>('45');
  const [startHour, setStartHour] = useState<'17' | '19' | '21'>('19');
  const [focus, setFocus] = useState<'60' | '75' | '90'>('75');
  const [accuracy, setAccuracy] = useState<'60' | '75' | '90'>('75');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = addRecord({
      subjectId,
      topic,
      durationMinutes: Number(duration),
      focusScore: Number(focus),
      accuracyScore: Number(accuracy),
      completionScore: 100,
      startHour: Number(startHour),
    });
    if (result.error) {
      setError(result.error);
      return;
    }
    router.replace('/(tabs)/analytics');
  }

  return (
    <Screen contentStyle={styles.content}>
      <PageHeader eyebrow="DEMO 輸入" title="新增一筆學習紀錄" description="資料只保留在本次展示記憶體中；重設後即回到預載合成資料。" />

      <SectionCard>
        <Text style={[styles.fieldLabel, { color: theme.text }]}>科目</Text>
        <SegmentedControl
          options={subjects.map((subject) => ({ value: subject.id, label: subject.shortName }))}
          selected={subjectId}
          onChange={setSubjectId}
        />

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>學習單元</Text>
          <TextInput
            accessibilityLabel="學習單元"
            accessibilityHint="請輸入本次複習或練習的單元名稱"
            value={topic}
            onChangeText={(value) => {
              setTopic(value);
              setError(null);
            }}
            placeholder="例如：二次函數錯題複習"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { backgroundColor: theme.surfaceMuted, color: theme.text, borderColor: error ? theme.danger : theme.border }]}
          />
          {error ? <Text accessibilityRole="alert" style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>預計開始時間</Text>
          <SegmentedControl
            options={[
              { value: '17', label: '17:00' },
              { value: '19', label: '19:00' },
              { value: '21', label: '21:00' },
            ]}
            selected={startHour}
            onChange={setStartHour}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: theme.text }]}>學習時間</Text>
          <SegmentedControl
            options={[
              { value: '30', label: '30 分' },
              { value: '45', label: '45 分' },
              { value: '60', label: '60 分' },
            ]}
            selected={duration}
            onChange={setDuration}
          />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={[styles.fieldLabel, { color: theme.text }]}>自我評估專注度</Text>
        <SegmentedControl
          options={[
            { value: '60', label: '普通 60' },
            { value: '75', label: '投入 75' },
            { value: '90', label: '專注 90' },
          ]}
          selected={focus}
          onChange={setFocus}
        />
        <Text style={[styles.fieldLabel, { color: theme.text }]}>練習正確率</Text>
        <SegmentedControl
          options={[
            { value: '60', label: '60%' },
            { value: '75', label: '75%' },
            { value: '90', label: '90%' },
          ]}
          selected={accuracy}
          onChange={setAccuracy}
        />
        <View style={[styles.preview, { backgroundColor: theme.primarySoft }]}>
          <Text style={[textStyles.label, { color: theme.primaryStrong }]}>預覽</Text>
          <Text style={[textStyles.bodySmall, { color: theme.textSecondary }]}>
            系統將把這筆紀錄的完成度設為 100%，並依正確率、專注度與完成度重新計算本次 Demo 分析。
          </Text>
        </View>
      </SectionCard>

      <PrimaryButton label="加入並更新分析" onPress={submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.three },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 14, lineHeight: 20, fontWeight: '800' },
  input: { minHeight: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 16, lineHeight: 22, fontWeight: '600' },
  errorText: { fontSize: 12, lineHeight: 17, fontWeight: '700' },
  preview: { borderRadius: 14, padding: Spacing.two, gap: 4 },
});
