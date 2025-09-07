import type { ThemeConfig } from '../theme-config';

/**
 * 🎨 创意主题 - 富有创造力、活力四射
 * 适用于设计工具、创意平台、艺术应用
 */
export const creativeThemeConfig: ThemeConfig = {
  direction: 'ltr',
  classesPrefix: 'minimal',
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
  fontFamily: {
    primary: 'Public Sans Variable',
    secondary: 'Barlow',
  },
  palette: {
    // 主色：创意紫 - 激发创造力和想象力
    primary: {
      lighter: '#F3E5F5',
      light: '#CE93D8',
      main: '#a933bd',      // Deep Purple
      dark: '#7B1FA2',
      darker: '#4A148C',
      contrastText: '#FFFFFF',
    },

    // 辅助色：活力橙 - 热情和能量
    secondary: {
      lighter: '#FBE9E7',
      light: '#FFAB91',
      main: '#FF5722',      // Deep Orange
      dark: '#D84315',
      darker: '#BF360C',
      contrastText: '#FFFFFF',
    },

    // 信息色：科技蓝
    info: {
      lighter: '#E8EAF6',
      light: '#9FA8DA',
      main: '#3F51B5',
      dark: '#303F9F',
      darker: '#1A237E',
      contrastText: '#FFFFFF',
    },

    // 成功色：自然绿 - 生机和成长
    success: {
      lighter: '#E0F2F1',
      light: '#4DB6AC',
      main: '#009688',
      dark: '#00695C',
      darker: '#004D40',
      contrastText: '#FFFFFF',
    },

    // 警告色：阳光黄 - 活力和注意
    warning: {
      lighter: '#FFF8E1',
      light: '#FFD54F',
      main: '#FFC107',
      dark: '#FF8F00',
      darker: '#FF6F00',
      contrastText: '#000000',
    },

    // 错误色：激情红 - 强烈但不刺眼
    error: {
      lighter: '#FCE4EC',
      light: '#F48FB1',
      main: '#E91E63',
      dark: '#C2185B',
      darker: '#880E4F',
      contrastText: '#FFFFFF',
    },

    // 灰色系：偏暖色调，更加友好
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },

    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};

// 预设配置
export const creativeColorPresets = {
  primary: creativeThemeConfig.palette.primary,
  secondary: creativeThemeConfig.palette.secondary,
};

// 使用说明
export const creativeThemeUsage = {
  name: 'Creative Theme',
  description: '富有创造力的主题，激发用户灵感',
  bestFor: [
    '设计工具',
    '创意平台',
    '艺术应用',
    '媒体编辑器',
    '教育平台',
  ],
  characteristics: [
    '充满活力的紫色主调',
    '富有创造力的配色',
    '激发灵感的视觉效果',
    '适合创意工作环境',
  ],
};
