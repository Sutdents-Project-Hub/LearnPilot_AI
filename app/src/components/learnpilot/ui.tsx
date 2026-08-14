import { type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import type { RiskLevel, Subject } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type ButtonProps = Omit<PressableProps, 'children' | 'style'> & { label: string; style?: StyleProp<ViewStyle> };

const toneMap = {
  primary: { foreground: 'primaryStrong', background: 'primarySoft' },
  success: { foreground: 'success', background: 'successSoft' },
  warning: { foreground: 'warning', background: 'warningSoft' },
  danger: { foreground: 'danger', background: 'dangerSoft' },
  info: { foreground: 'info', background: 'infoSoft' },
  neutral: { foreground: 'textSecondary', background: 'surfaceMuted' },
} as const;

export function Screen({ children, contentStyle }: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.screenContent, { paddingBottom: BottomTabInset + Spacing.four }, contentStyle]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentWidth}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: theme.primary }]}>{eyebrow}</Text> : null}
        <Text accessibilityRole="header" style={[styles.pageTitle, { color: theme.text }]}>
          {title}
        </Text>
        {description ? <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function SectionCard({
  children,
  style,
  accessibilityLabel,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
}

export function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.sectionTitleRow}>
      <Text accessibilityRole="header" style={[styles.sectionTitle, { color: theme.text }]}>
        {title}
      </Text>
      {detail ? <Text style={[styles.sectionDetail, { color: theme.textSecondary }]}>{detail}</Text> : null}
    </View>
  );
}

export function Pill({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const theme = useTheme();
  const colors = toneMap[tone];
  return (
    <View style={[styles.pill, { backgroundColor: theme[colors.background] }]}>
      <Text style={[styles.pillText, { color: theme[colors.foreground] }]}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({ label, style: customStyle, ...props }: ButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.primary }, pressed && styles.pressed, customStyle]}>
      <Text style={[styles.buttonLabel, { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, style: customStyle, ...props }: ButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [styles.button, styles.secondaryButton, { backgroundColor: theme.surfaceMuted }, pressed && styles.pressed, customStyle]}>
      <Text style={[styles.buttonLabel, { color: theme.primaryStrong }]}>{label}</Text>
    </Pressable>
  );
}

export function TextButton({ label, style: customStyle, ...props }: ButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      {...props}
      style={({ pressed }) => [styles.textButton, pressed && styles.pressed, customStyle]}>
      <Text style={[styles.textButtonLabel, { color: theme.primary }]}>{label}</Text>
    </Pressable>
  );
}

export function Metric({
  label,
  value,
  helper,
  tone = 'primary',
}: {
  label: string;
  value: string;
  helper: string;
  tone?: Tone;
}) {
  const theme = useTheme();
  const colors = toneMap[tone];
  return (
    <View style={[styles.metric, { backgroundColor: theme[colors.background] }]} accessibilityLabel={`${label} ${value}，${helper}`}>
      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: theme[colors.foreground] }]}>{value}</Text>
      <Text style={[styles.metricHelper, { color: theme.textSecondary }]}>{helper}</Text>
    </View>
  );
}

export function ProgressBar({ value, color, label }: { value: number; color?: string; label: string }) {
  const theme = useTheme();
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <View accessibilityLabel={`${label} ${safeValue}%`} style={styles.progressWrapper}>
      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceMuted }]}>
        <View style={[styles.progressFill, { width: `${safeValue}%`, backgroundColor: color ?? theme.primary }]} />
      </View>
    </View>
  );
}

export function SubjectAvatar({ subject, size = 36 }: { subject: Subject; size?: number }) {
  return (
    <View
      accessibilityLabel={`${subject.name}標誌`}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: subject.lightColor },
      ]}>
      <Text style={[styles.avatarText, { color: subject.color, fontSize: Math.round(size * 0.42) }]}>{subject.shortName}</Text>
    </View>
  );
}

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const map: Record<RiskLevel, { label: string; tone: Tone }> = {
    stable: { label: '穩定', tone: 'success' },
    attention: { label: '注意', tone: 'warning' },
    risk: { label: '需優先處理', tone: 'danger' },
  };
  return <Pill label={score === undefined ? map[level].label : `${map[level].label} ${score}`} tone={map[level].tone} />;
}

export function SubjectRow({
  subject,
  value,
  detail,
  trend,
  onPress,
}: {
  subject: Subject;
  value: number | null;
  detail: string;
  trend?: number | null;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const content = (
    <>
      <SubjectAvatar subject={subject} />
      <View style={styles.subjectRowCopy}>
        <View style={styles.subjectNameRow}>
          <Text style={[styles.subjectName, { color: theme.text }]}>{subject.name}</Text>
          {trend !== undefined && trend !== null ? (
            <Text style={[styles.subjectTrend, { color: trend >= 0 ? theme.success : theme.danger }]}>
              {trend >= 0 ? '+' : ''}
              {trend} 效率
            </Text>
          ) : null}
        </View>
        <Text style={[styles.subjectDetail, { color: theme.textSecondary }]}>{detail}</Text>
        <ProgressBar label={`${subject.name}效率`} value={value ?? 0} color={subject.color} />
      </View>
      <Text style={[styles.subjectValue, { color: theme.text }]}>{value ?? '—'}</Text>
    </>
  );
  if (!onPress) return <View style={styles.subjectRow}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`查看${subject.name}分析`}
      onPress={onPress}
      style={({ pressed }) => [styles.subjectRow, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

export function SparkBars({
  values,
  color,
  labels,
  summary,
}: {
  values: number[];
  color: string;
  labels: string[];
  summary: string;
}) {
  const theme = useTheme();
  const highest = Math.max(...values, 1);
  return (
    <View accessibilityLabel={summary} style={styles.chartBlock}>
      <View style={[styles.chartArea, { borderBottomColor: theme.border }]}>
        {values.map((value, index) => (
          <View key={`${labels[index]}-${value}`} style={styles.chartColumn}>
            <Text style={[styles.chartValue, { color: theme.textSecondary }]}>{value}</Text>
            <View style={styles.chartColumnTrack}>
              <View style={[styles.chartBar, { height: `${Math.max(8, (value / highest) * 100)}%`, backgroundColor: color }]} />
            </View>
            <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>{labels[index]}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.chartSummary, { color: theme.textSecondary }]}>{summary}</Text>
    </View>
  );
}

export function SegmentedControl<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: theme.surfaceMuted }]}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              isSelected && { backgroundColor: theme.surface },
              isSelected && styles.segmentSelected,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.segmentLabel, { color: isSelected ? theme.text : theme.textSecondary }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.emptyState, { backgroundColor: theme.surfaceMuted }]}>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>{description}</Text>
    </View>
  );
}

export function Disclosure({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <View accessibilityLabel="Demo 資料揭露" style={[styles.disclosure, { backgroundColor: theme.infoSoft }]}>
      <Text style={[styles.disclosureText, { color: theme.info }]}>{children}</Text>
    </View>
  );
}

export const textStyles = StyleSheet.create({
  body: { fontSize: 15, lineHeight: 23, fontWeight: '500' },
  bodySmall: { fontSize: 13, lineHeight: 19, fontWeight: '500' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '700' },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '600' },
}) as Record<string, TextStyle>;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screenContent: { flexGrow: 1, alignItems: 'center', paddingHorizontal: Spacing.three, paddingTop: Spacing.three },
  contentWidth: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.two },
  headerCopy: { flex: 1, gap: Spacing.one },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  pageTitle: { fontSize: 31, lineHeight: 38, fontWeight: '800', letterSpacing: -0.6 },
  description: { fontSize: 15, lineHeight: 23, fontWeight: '500' },
  card: { borderWidth: 1, borderRadius: 24, padding: Spacing.three, gap: Spacing.two },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  sectionTitle: { fontSize: 18, lineHeight: 24, fontWeight: '800' },
  sectionDetail: { fontSize: 13, lineHeight: 18, fontWeight: '600', textAlign: 'right' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, minHeight: 28, justifyContent: 'center', borderRadius: 99 },
  pillText: { fontSize: 12, lineHeight: 17, fontWeight: '800' },
  button: { minHeight: 48, borderRadius: 16, paddingHorizontal: Spacing.three, justifyContent: 'center', alignItems: 'center' },
  secondaryButton: { borderWidth: 0 },
  buttonLabel: { fontSize: 15, lineHeight: 20, fontWeight: '800', textAlign: 'center' },
  textButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: Spacing.one },
  textButtonLabel: { fontSize: 14, lineHeight: 20, fontWeight: '800' },
  pressed: { opacity: 0.72 },
  metric: { flex: 1, minWidth: 0, padding: Spacing.two, borderRadius: 18, gap: 2 },
  metricLabel: { fontSize: 12, lineHeight: 17, fontWeight: '700' },
  metricValue: { fontSize: 26, lineHeight: 31, fontWeight: '800', letterSpacing: -0.4 },
  metricHelper: { fontSize: 12, lineHeight: 17, fontWeight: '600' },
  progressWrapper: { width: '100%', paddingTop: 7 },
  progressTrack: { height: 7, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  avatar: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontWeight: '800' },
  subjectRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  subjectRowCopy: { flex: 1, minWidth: 0, gap: 1 },
  subjectNameRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.one },
  subjectName: { fontSize: 15, lineHeight: 21, fontWeight: '800' },
  subjectTrend: { fontSize: 12, lineHeight: 18, fontWeight: '800' },
  subjectDetail: { fontSize: 12, lineHeight: 17, fontWeight: '600' },
  subjectValue: { minWidth: 31, fontSize: 17, lineHeight: 23, fontWeight: '800', textAlign: 'right' },
  chartBlock: { gap: Spacing.two },
  chartArea: { height: 132, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingTop: 5 },
  chartColumn: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
  chartValue: { fontSize: 10, lineHeight: 13, fontWeight: '700' },
  chartColumnTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', maxWidth: 22 },
  chartBar: { width: '100%', minHeight: 6, borderRadius: 99 },
  chartLabel: { fontSize: 10, lineHeight: 13, fontWeight: '700' },
  chartSummary: { fontSize: 12, lineHeight: 18, fontWeight: '600' },
  segmented: { flexDirection: 'row', padding: 4, borderRadius: 16, gap: 3 },
  segment: { flex: 1, minHeight: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.one },
  segmentSelected: { shadowColor: '#13233A', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  segmentLabel: { fontSize: 13, lineHeight: 18, fontWeight: '800', textAlign: 'center' },
  emptyState: { padding: Spacing.three, borderRadius: 18, gap: Spacing.one },
  emptyTitle: { fontSize: 15, lineHeight: 21, fontWeight: '800' },
  emptyDescription: { fontSize: 13, lineHeight: 19, fontWeight: '500' },
  disclosure: { borderRadius: 16, paddingHorizontal: Spacing.two, paddingVertical: 10 },
  disclosureText: { fontSize: 12, lineHeight: 18, fontWeight: '700' },
});
