/**
 * 🎨 主题示例集合
 * 提供多种预设主题，满足不同应用场景的需求
 */

import type { PaletteColorKey } from '../core';

export { techThemeUsage, techThemeConfig, techColorPresets } from './tech-theme';
export { darkThemeUsage, darkThemeConfig, darkColorPresets } from './dark-theme';
export { healthThemeUsage, healthThemeConfig, healthColorPresets } from './health-theme';

// 主题配置导入
export { businessThemeUsage, businessThemeConfig, businessColorPresets } from './business-theme';
export { creativeThemeUsage, creativeThemeConfig, creativeColorPresets } from './creative-theme';

import type { ThemeConfig } from '../theme-config';

// 主题元数据接口
export interface ThemeMetadata {
  name: string;
  description: string;
  bestFor: string[];
  characteristics: string[];
  preview?: string;
  category: 'business' | 'creative' | 'health' | 'tech' | 'dark' | 'custom';
}

// 主题配置与元数据的组合
export interface ThemePackage {
  config: ThemeConfig;
  metadata: ThemeMetadata;
  colorPresets: {
    primary: any;
    secondary: any;
  };
}

// 导入所有主题
import {
  businessThemeConfig,
  businessColorPresets,
  businessThemeUsage
} from './business-theme';
import {
  creativeThemeConfig,
  creativeColorPresets,
  creativeThemeUsage
} from './creative-theme';
import {
  healthThemeConfig,
  healthColorPresets,
  healthThemeUsage
} from './health-theme';
import {
  techThemeConfig,
  techColorPresets,
  techThemeUsage
} from './tech-theme';
import {
  darkThemeConfig,
  darkColorPresets,
  darkThemeUsage
} from './dark-theme';

// 主题包集合
export const themePackages: Record<string, ThemePackage> = {
  business: {
    config: businessThemeConfig,
    metadata: { ...businessThemeUsage, category: 'business' },
    colorPresets: businessColorPresets,
  },
  creative: {
    config: creativeThemeConfig,
    metadata: { ...creativeThemeUsage, category: 'creative' },
    colorPresets: creativeColorPresets,
  },
  health: {
    config: healthThemeConfig,
    metadata: { ...healthThemeUsage, category: 'health' },
    colorPresets: healthColorPresets,
  },
  tech: {
    config: techThemeConfig,
    metadata: { ...techThemeUsage, category: 'tech' },
    colorPresets: techColorPresets,
  },
  dark: {
    config: darkThemeConfig,
    metadata: { ...darkThemeUsage, category: 'dark' },
    colorPresets: darkColorPresets,
  },
};

// 按类别获取主题
export function getThemesByCategory(category: ThemeMetadata['category']): ThemePackage[] {
  return Object.values(themePackages).filter(pkg => pkg.metadata.category === category);
}

// 获取所有主题名称
export function getAllThemeNames(): string[] {
  return Object.keys(themePackages);
}

// 获取主题配置
export function getThemeConfig(themeName: string): ThemeConfig | null {
  const themePackage = themePackages[themeName];
  return themePackage ? themePackage.config : null;
}

// 获取主题元数据
export function getThemeMetadata(themeName: string): ThemeMetadata | null {
  const themePackage = themePackages[themeName];
  return themePackage ? themePackage.metadata : null;
}

// 获取主题颜色预设
export function getThemeColorPresets(themeName: string) {
  const themePackage = themePackages[themeName];
  return themePackage ? themePackage.colorPresets : null;
}

// 推荐主题函数
export function getRecommendedThemes(useCase: string): ThemePackage[] {
  const useCaseMap: Record<string, string[]> = {
    'enterprise': ['business', 'tech'],
    'creative': ['creative', 'dark'],
    'healthcare': ['health', 'business'],
    'education': ['creative', 'health'],
    'gaming': ['dark', 'tech'],
    'finance': ['business', 'tech'],
    'ecommerce': ['business', 'creative'],
  };

  const recommendedNames = useCaseMap[useCase] || ['business'];
  return recommendedNames
    .map(name => themePackages[name])
    .filter(Boolean);
}

// 主题切换Hook辅助函数
export function createThemePresetUpdater() {
  return {
    // 更新主题预设
    updatePresets: (themeName: string) => {
      const themePackage = themePackages[themeName];
      if (!themePackage) {
        console.warn(`主题 "${themeName}" 不存在`);
        return null;
      }

      return {
        primaryColor: themeName,
        colorPresets: themePackage.colorPresets,
      };
    },

    // 获取主题预览数据
    getPreviewData: (themeName: string) => {
      const themePackage = themePackages[themeName];
      if (!themePackage) return null;

      return {
        name: themePackage.metadata.name,
        primaryColor: themePackage.colorPresets.primary.main,
        secondaryColor: themePackage.colorPresets.secondary.main,
        description: themePackage.metadata.description,
        bestFor: themePackage.metadata.bestFor,
      };
    },
  };
}

// 主题搜索函数
export function searchThemes(query: string): ThemePackage[] {
  const lowercaseQuery = query.toLowerCase();

  return Object.values(themePackages).filter(pkg => {
    const { name, description, bestFor, characteristics } = pkg.metadata;

    return (
      name.toLowerCase().includes(lowercaseQuery) ||
      description.toLowerCase().includes(lowercaseQuery) ||
      bestFor.some(item => item.toLowerCase().includes(lowercaseQuery)) ||
      characteristics.some(item => item.toLowerCase().includes(lowercaseQuery))
    );
  });
}

// 导出默认主题
export const defaultTheme = themePackages.business;

// 主题统计信息
export const themeStats = {
  total: Object.keys(themePackages).length,
  categories: [...new Set(Object.values(themePackages).map(pkg => pkg.metadata.category))],
  mostPopular: 'business', // 可以根据使用统计更新
};

// 主题验证函数
export function validateThemeConfig(config: Partial<ThemeConfig>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.palette) {
    errors.push('缺少调色板配置');
  } else {
    const requiredColors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
    requiredColors.forEach((color: any) => {
      if (!config?.palette?.[color as PaletteColorKey]) {
        errors.push(`缺少 ${color} 颜色配置`);
      }
    });
  }

  if (!config.fontFamily) {
    errors.push('缺少字体配置');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
