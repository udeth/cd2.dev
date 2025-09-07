import type { ThemeConfig } from '../theme-config';

/**
 * 🌙 深色主题 - 优雅、低调、护眼
 * 适用于夜间使用、长时间工作、专业应用
 */
export const darkThemeConfig: ThemeConfig = {
  direction: 'ltr',
  classesPrefix: 'minimal',
  defaultMode: 'dark',
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
    // 主色：月光蓝 - 优雅不刺眼
    primary: {
      lighter: '#E8EAF6',
      light: '#9FA8DA',
      main: '#5C6BC0',      // 稍亮的 Indigo
      dark: '#3949AB',
      darker: '#1A237E',
      contrastText: '#FFFFFF',
    },
    
    // 辅助色：暖光橙 - 温馨的对比色
    secondary: {
      lighter: '#FFF3E0',
      light: '#FFCC02',
      main: '#FFA726',      // 稍亮的 Orange
      dark: '#FF9800',
      darker: '#E65100',
      contrastText: '#000000',
    },
    
    // 信息色：星光蓝
    info: {
      lighter: '#E1F5FE',
      light: '#4FC3F7',
      main: '#29B6F6',
      dark: '#03A9F4',
      darker: '#01579B',
      contrastText: '#FFFFFF',
    },
    
    // 成功色：森林绿 - 深色友好
    success: {
      lighter: '#E8F5E8',
      light: '#81C784',
      main: '#66BB6A',
      dark: '#4CAF50',
      darker: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    
    // 警告色：琥珀黄 - 在深色背景下清晰可见
    warning: {
      lighter: '#FFF8E1',
      light: '#FFD54F',
      main: '#FFCA28',
      dark: '#FFC107',
      darker: '#FF6F00',
      contrastText: '#000000',
    },
    
    // 错误色：珊瑚红 - 温和但明显
    error: {
      lighter: '#FFEBEE',
      light: '#EF5350',
      main: '#EF5350',
      dark: '#F44336',
      darker: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    
    // 灰色系：适合深色模式的层次
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
export const darkColorPresets = {
  primary: darkThemeConfig.palette.primary,
  secondary: darkThemeConfig.palette.secondary,
};

// 使用说明
export const darkThemeUsage = {
  name: 'Dark Theme',
  description: '深色主题，适合夜间使用和长时间工作',
  bestFor: [
    '代码编辑器',
    '夜间阅读',
    '专业工具',
    '游戏界面',
    '媒体播放器',
  ],
  characteristics: [
    '优雅的深色主调',
    '减少眼部疲劳',
    '适合暗光环境',
    '专业酷炫的视觉效果',
  ],
};