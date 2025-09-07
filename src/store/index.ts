/**
 * 🏪 Zustand Store 根模块
 * 统一导出所有 store 和相关工具
 */
export { persist } from './middleware/persist';

export { useUIStore } from './slices/ui-store';

export { useAppStore } from './slices/app-store';

export { useUserStore } from './slices/user-store';

export { createSelectors } from './utils/create-selectors';

export type { UIStore } from './slices/ui-store';

export type { AppStore } from './slices/app-store';

export type { UserStore } from './slices/user-store';
