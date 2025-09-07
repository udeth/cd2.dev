import type { ThemeConfig } from '../theme-config';

/**
 * 🚀 科技主题 - 未来感、精确、高效
 * 适用于技术产品、开发工具、AI应用
 */
export const techThemeConfig: ThemeConfig = {
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
    // 主色：科技蓝 - 理性、精确、可靠
    primary: {
      lighter: '#E8EAF6',
      light: '#9FA8DA',
      main: '#3F51B5',      // Indigo
      dark: '#303F9F',
      darker: '#1A237E',
      contrastText: '#FFFFFF',
    },
    
    // 辅助色：电光青 - 高科技感
    secondary: {
      lighter: '#E0F7FA',
      light: '#4DD0E1',
      main: '#00BCD4',      // Cyan
      dark: '#00ACC1',
      darker: '#006064',
      contrastText: '#FFFFFF',
    },
    
    // 信息色：数据蓝
    info: {
      lighter: '#E3F2FD',
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1976D2',
      darker: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    
    // 成功色：系统绿 - 运行正常
    success: {
      lighter: '#E8F5E8',
      light: '#81C784',
      main: '#4CAF50',
      dark: '#388E3C',
      darker: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    
    // 警告色：警示橙 - 系统警告
    warning: {
      lighter: '#FFF3E0',
      light: '#FFB74D',
      main: '#FF9800',
      dark: '#F57C00',
      darker: '#E65100',
      contrastText: '#FFFFFF',
    },
    
    // 错误色：系统红 - 错误状态
    error: {
      lighter: '#FFEBEE',
      light: '#EF5350',
      main: '#F44336',
      dark: '#D32F2F',
      darker: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    
    // 灰色系：偏蓝色调，科技感
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
export const techColorPresets = {
  primary: techThemeConfig.palette.primary,
  secondary: techThemeConfig.palette.secondary,
};

// 使用说明
export const techThemeUsage = {
  name: 'Tech Theme',
  description: '科技主题，体现未来感和精确性',
  bestFor: [
    '开发工具',
    '技术产品',
    'AI应用',
    '数据分析',
    '系统监控',
  ],
  characteristics: [
    '理性精确的蓝色主调',
    '富有科技感的配色',
    '专业高效的视觉效果',
    '适合技术类产品',
  ],
};