import type { ThemeConfig } from '../theme-config';

/**
 * 🏢 商务主题 - 专业、稳重、可信赖
 * 适用于企业级应用、B2B平台、金融系统
 */
export const businessThemeConfig: ThemeConfig = {
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
    // 主色：专业蓝 - 传达专业性和可信度
    primary: {
      lighter: '#E3F2FD',
      light: '#64B5F6',
      main: '#1976D2',      // IBM Blue
      dark: '#1565C0',
      darker: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    
    // 辅助色：商务橙 - 活力但不失稳重
    secondary: {
      lighter: '#FFF3E0',
      light: '#FFB74D',
      main: '#FF9800',      // Amber
      dark: '#F57C00',
      darker: '#E65100',
      contrastText: '#FFFFFF',
    },
    
    // 信息色：天空蓝
    info: {
      lighter: '#E1F5FE',
      light: '#4FC3F7',
      main: '#03A9F4',
      dark: '#0288D1',
      darker: '#01579B',
      contrastText: '#FFFFFF',
    },
    
    // 成功色：专业绿
    success: {
      lighter: '#E8F5E8',
      light: '#81C784',
      main: '#4CAF50',
      dark: '#388E3C',
      darker: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    
    // 警告色：商务黄
    warning: {
      lighter: '#FFFDE7',
      light: '#FFF176',
      main: '#FFC107',
      dark: '#FFA000',
      darker: '#FF6F00',
      contrastText: '#000000',
    },
    
    // 错误色：专业红
    error: {
      lighter: '#FFEBEE',
      light: '#EF5350',
      main: '#F44336',
      dark: '#D32F2F',
      darker: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    
    // 灰色系：偏冷色调，更加商务
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
export const businessColorPresets = {
  primary: businessThemeConfig.palette.primary,
  secondary: businessThemeConfig.palette.secondary,
};

// 使用说明
export const businessThemeUsage = {
  name: 'Business Theme',
  description: '专业商务主题，适用于企业级应用',
  bestFor: [
    '企业管理系统',
    'B2B平台',
    '金融应用',
    'CRM系统',
    '数据分析平台',
  ],
  characteristics: [
    '稳重可信的蓝色主调',
    '专业的配色方案',
    '适合长时间使用',
    '符合企业品牌规范',
  ],
};