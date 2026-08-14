import { Tabs } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LearnPilotTabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: Colors.light.navMuted,
        tabBarStyle: {
          backgroundColor: theme.nav,
          borderTopColor: theme.nav,
          height: 72,
          paddingTop: 8,
        },
        tabBarIcon: () => null,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '800', marginBottom: 7 },
        tabBarItemStyle: { borderRadius: 12, marginHorizontal: 2 },
      }}>
      <Tabs.Screen name="index" options={{ title: '今日', tabBarAccessibilityLabel: '今日學習總覽' }} />
      <Tabs.Screen name="analytics" options={{ title: '分析', tabBarAccessibilityLabel: '學習分析' }} />
      <Tabs.Screen name="plan" options={{ title: '計畫', tabBarAccessibilityLabel: '讀書計畫' }} />
      <Tabs.Screen name="history" options={{ title: '歷程', tabBarAccessibilityLabel: '學習歷程' }} />
    </Tabs>
  );
}
