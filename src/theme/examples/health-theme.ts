import type { ThemeConfig } from '../theme-config';

/**
 * 🌿 健康主题 - 自然、平静、治愈
 * 适用于医疗应用、健康管理、运动健身
 */
export const healthThemeConfig: ThemeConfig = {
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
    // 主色：治愈绿 - 自然、健康、平静
    primary: {
      lighter: '#E0F2F1',
      light: '#4DB6AC',
      main: '#009688',      // Teal
      dark: '#00695C',
      darker: '#004D40',
      contrastText: '#FFFFFF',
    },
    
    // 辅助色：活力蓝 - 清新、活力
    secondary: {
      lighter: '#E1F5FE',
      light: '#4FC3F7',
      main: '#00BCD4',      // Cyan
      dark: '#00ACC1',
      darker: '#006064',
      contrastText: '#FFFFFF',
    },
    
    // 信息色：天空蓝
    info: {
      lighter: '#E3F2FD',
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1976D2',
      darker: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    
    // 成功色：生命绿 - 生机勃勃
    success: {
      lighter: '#E8F5E8',
      light: '#A5D6A7',
      main: '#66BB6A',
      dark: '#43A047',
      darker: '#2E7D32',
      contrastText: '#FFFFFF',
    },
    
    // 警告色：温和橙 - 温馨提醒
    warning: {
      lighter: '#FFF3E0',
      light: '#FFCC02',
      main: '#FF9800',
      dark: '#F57C00',
      darker: '#E65100',
      contrastText: '#000000',
    },
    
    // 错误色：温和红 - 不会引起焦虑
    error: {
      lighter: '#FFEBEE',
      light: '#EF5350',
      main: '#F44336',
      dark: '#D32F2F',
      darker: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    
    // 灰色系：偏绿色调，更加自然
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
export const healthColorPresets = {
  primary: healthThemeConfig.palette.primary,
  secondary: healthThemeConfig.palette.secondary,
};

// 使用说明
export const healthThemeUsage = {
  name: 'Health Theme',
  description: '健康主题，传达自然和治愈感',
  bestFor: [
    '医疗应用',
    '健康管理',
    '运动健身',
    '心理健康',
    '养生平台',
  ],
  characteristics: [
    '自然治愈的绿色主调',
    '平静舒缓的配色',
    '减少视觉疲劳',
    '传达健康理念',
  ],
};