import type { Theme, Direction, CommonColors, ThemeProviderProps } from '@mui/material/styles';
import type { ThemeCssVariables } from './types';
import type { PaletteColorKey, PaletteColorNoChannels } from './core/palette';

// ----------------------------------------------------------------------

export type ThemeConfig = {
  direction: Direction;
  classesPrefix: string;
  cssVariables: ThemeCssVariables;
  defaultMode: ThemeProviderProps<Theme>['defaultMode'];
  modeStorageKey: ThemeProviderProps<Theme>['modeStorageKey'];
  fontFamily: Record<'primary' | 'secondary', string>;
  palette: Record<PaletteColorKey, PaletteColorNoChannels> & {
    common: Pick<CommonColors, 'black' | 'white'>;
    grey: {
      [K in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 as `${K}`]: string;
    };
  };
};

export const themeConfig: ThemeConfig = {
  /** **************************************
   * Base
   *************************************** */
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  direction: 'ltr',
  classesPrefix: 'minimal',
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Public Sans Variable',
    secondary: 'Barlow',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    primary: {
      lighter: '#C8FAD6',
      light: '#5BE49B',
      main: '#00A76F',
      dark: '#007867',
      darker: '#004B50',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#EFD6FF',
      light: '#C684FF',
      main: '#8E33FF',
      dark: '#5119B7',
      darker: '#27097A',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#CAFDF5',
      light: '#61F3F3',
      main: '#00B8D9',
      dark: '#006C9C',
      darker: '#003768',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#D3FCD2',
      light: '#77ED8B',
      main: '#22C55E',
      dark: '#118D57',
      darker: '#065E49',
      contrastText: '#ffffff',
    },
    warning: {
      lighter: '#FFF5CC',
      light: '#FFD666',
      main: '#FFAB00',
      dark: '#B76E00',
      darker: '#7A4100',
      contrastText: '#1C252E',
    },
    error: {
      lighter: '#FFE9D5',
      light: '#FFAC82',
      main: '#FF5630',
      dark: '#B71D18',
      darker: '#7A0916',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FCFDFD',
      100: '#F9FAFB',
      200: '#F4F6F8',
      300: '#DFE3E8',
      400: '#C4CDD5',
      500: '#919EAB',
      600: '#637381',
      700: '#454F5B',
      800: '#1C252E',
      900: '#141A21',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },

  // 创意紫
  // palette: {
  //   // 主色：创意紫 - 激发创造力和想象力
  //   primary: {
  //     lighter: '#F3E5F5',
  //     light: '#CE93D8',
  //     main: '#9C27B0',      // Deep Purple
  //     dark: '#7B1FA2',
  //     darker: '#4A148C',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 辅助色：活力橙 - 热情和能量
  //   secondary: {
  //     lighter: '#FBE9E7',
  //     light: '#FFAB91',
  //     main: '#FF5722',      // Deep Orange
  //     dark: '#D84315',
  //     darker: '#BF360C',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 信息色：科技蓝
  //   info: {
  //     lighter: '#E8EAF6',
  //     light: '#9FA8DA',
  //     main: '#3F51B5',
  //     dark: '#303F9F',
  //     darker: '#1A237E',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 成功色：自然绿 - 生机和成长
  //   success: {
  //     lighter: '#E0F2F1',
  //     light: '#4DB6AC',
  //     main: '#009688',
  //     dark: '#00695C',
  //     darker: '#004D40',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 警告色：阳光黄 - 活力和注意
  //   warning: {
  //     lighter: '#FFF8E1',
  //     light: '#FFD54F',
  //     main: '#FFC107',
  //     dark: '#FF8F00',
  //     darker: '#FF6F00',
  //     contrastText: '#000000',
  //   },
  //
  //   // 错误色：激情红 - 强烈但不刺眼
  //   error: {
  //     lighter: '#FCE4EC',
  //     light: '#F48FB1',
  //     main: '#E91E63',
  //     dark: '#C2185B',
  //     darker: '#880E4F',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 灰色系：偏暖色调，更加友好
  //   grey: {
  //     50: '#FAFAFA',
  //     100: '#F5F5F5',
  //     200: '#EEEEEE',
  //     300: '#E0E0E0',
  //     400: '#BDBDBD',
  //     500: '#9E9E9E',
  //     600: '#757575',
  //     700: '#616161',
  //     800: '#424242',
  //     900: '#212121',
  //   },
  //
  //   common: {
  //     black: '#000000',
  //     white: '#FFFFFF',
  //   },
  // },

  // palette: {
  //   // 主色：治愈绿 - 自然、健康、平静
  //   primary: {
  //     lighter: '#E0F2F1',
  //     light: '#4DB6AC',
  //     main: '#009688',      // Teal
  //     dark: '#00695C',
  //     darker: '#004D40',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 辅助色：活力蓝 - 清新、活力
  //   secondary: {
  //     lighter: '#E1F5FE',
  //     light: '#4FC3F7',
  //     main: '#00BCD4',      // Cyan
  //     dark: '#00ACC1',
  //     darker: '#006064',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 信息色：天空蓝
  //   info: {
  //     lighter: '#E3F2FD',
  //     light: '#64B5F6',
  //     main: '#2196F3',
  //     dark: '#1976D2',
  //     darker: '#0D47A1',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 成功色：生命绿 - 生机勃勃
  //   success: {
  //     lighter: '#E8F5E8',
  //     light: '#A5D6A7',
  //     main: '#66BB6A',
  //     dark: '#43A047',
  //     darker: '#2E7D32',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 警告色：温和橙 - 温馨提醒
  //   warning: {
  //     lighter: '#FFF3E0',
  //     light: '#FFCC02',
  //     main: '#FF9800',
  //     dark: '#F57C00',
  //     darker: '#E65100',
  //     contrastText: '#000000',
  //   },
  //
  //   // 错误色：温和红 - 不会引起焦虑
  //   error: {
  //     lighter: '#FFEBEE',
  //     light: '#EF5350',
  //     main: '#F44336',
  //     dark: '#D32F2F',
  //     darker: '#B71C1C',
  //     contrastText: '#FFFFFF',
  //   },
  //
  //   // 灰色系：偏绿色调，更加自然
  //   grey: {
  //     50: '#FAFAFA',
  //     100: '#F5F5F5',
  //     200: '#EEEEEE',
  //     300: '#E0E0E0',
  //     400: '#BDBDBD',
  //     500: '#9E9E9E',
  //     600: '#757575',
  //     700: '#616161',
  //     800: '#424242',
  //     900: '#212121',
  //   },
  //
  //   common: {
  //     black: '#000000',
  //     white: '#FFFFFF',
  //   },
  // },
};
