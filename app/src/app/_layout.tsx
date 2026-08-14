import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { DemoProvider } from '@/features/demo/demo-provider';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeName = colorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DemoProvider>
        <StatusBar barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={Colors[themeName].background} />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors[themeName].background },
            headerTintColor: Colors[themeName].text,
            headerTitleStyle: { fontWeight: '800' },
            contentStyle: { backgroundColor: Colors[themeName].background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="record/new" options={{ title: '新增學習紀錄', presentation: 'modal' }} />
          <Stack.Screen name="risk/[subjectId]" options={{ title: '風險詳情' }} />
          <Stack.Screen name="insight/[insightId]" options={{ title: '建議詳情' }} />
          <Stack.Screen name="about-demo" options={{ title: 'Demo 說明' }} />
        </Stack>
      </DemoProvider>
    </ThemeProvider>
  );
}
