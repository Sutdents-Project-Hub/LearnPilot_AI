/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#13233A',
    background: '#F5F8FC',
    backgroundElement: '#E9F0F8',
    backgroundSelected: '#D8E8FA',
    textSecondary: '#5E7087',
    surface: '#FFFFFF',
    surfaceMuted: '#EFF4F9',
    border: '#DCE6F0',
    primary: '#1769D2',
    primarySoft: '#E6F0FF',
    primaryStrong: '#0E4E9A',
    success: '#0B8067',
    successSoft: '#DCF5EE',
    warning: '#A95A08',
    warningSoft: '#FFF0D6',
    danger: '#B33E4B',
    dangerSoft: '#FCE6E8',
    info: '#5369B7',
    infoSoft: '#E9EBFF',
    nav: '#0D2945',
    navMuted: '#AFC3D9',
  },
  dark: {
    text: '#EDF5FF',
    background: '#091521',
    backgroundElement: '#17283A',
    backgroundSelected: '#203C58',
    textSecondary: '#B1C1D2',
    surface: '#102235',
    surfaceMuted: '#172C41',
    border: '#2A435D',
    primary: '#7AB6FF',
    primarySoft: '#173B66',
    primaryStrong: '#B8D8FF',
    success: '#59D0B4',
    successSoft: '#173D37',
    warning: '#FFC36A',
    warningSoft: '#493719',
    danger: '#FF9AA5',
    dangerSoft: '#4E2730',
    info: '#B9C1FF',
    infoSoft: '#292F62',
    nav: '#07111B',
    navMuted: '#9DB0C5',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 82, android: 88, web: 76 }) ?? 76;
export const MaxContentWidth = 800;
