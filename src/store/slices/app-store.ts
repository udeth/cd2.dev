/**
 * 📱 应用全局状态管理
 * 管理应用级别的状态，如加载状态、通知、配置等
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BaseState, StoreActions } from '../types';

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

// 应用配置
export interface AppConfig {
  apiBaseUrl: string;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  debugMode: boolean;
}

// App Store 状态
export interface AppState extends BaseState {
  // 应用信息
  version: string;
  environment: 'development' | 'staging' | 'production';

  // 全局加载状态
  globalLoading: boolean;

  // 通知系统
  notifications: Notification[];

  // 应用配置
  config: AppConfig;

  // 网络状态
  isOnline: boolean;

  // 侧边栏状态
  sidebarOpen: boolean;

  // 页面标题
  pageTitle: string;
}

// App Store Actions
export interface AppActions extends StoreActions {
  // 全局加载状态
  setGlobalLoading: (loading: boolean) => void;

  // 通知管理
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // 配置管理
  updateConfig: (config: Partial<AppConfig>) => void;

  // 网络状态
  setOnlineStatus: (online: boolean) => void;

  // UI 状态
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setPageTitle: (title: string) => void;
}

// 组合类型
export type AppStore = AppState & AppActions;

// 默认状态
const defaultState: AppState = {
  // 基础状态
  loading: false,
  error: null,

  // 应用信息
  version: '1.0.0',
  environment: 'development',

  // 全局状态
  globalLoading: false,

  // 通知系统
  notifications: [],

  // 应用配置
  config: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
    enableAnalytics: true,
    enableNotifications: true,
    debugMode: import.meta.env.DEV,
  },

  // 网络状态
  isOnline: navigator.onLine,

  // UI 状态
  sidebarOpen: true,
  pageTitle: '',
};

// 创建 App Store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // 基础 actions
      reset: () => set(defaultState),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // 全局加载状态
      setGlobalLoading: (globalLoading) => set({ globalLoading }),

      // 通知管理
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        const newNotification: Notification = {
          id,
          duration: 5000, // 默认 5 秒
          ...notification,
        };

        set((state: AppStore) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // 自动移除通知
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id) =>
        set((state: AppStore) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // 配置管理
      updateConfig: (configUpdate) =>
        set((state: AppStore) => ({
          config: { ...state.config, ...configUpdate },
        })),

      // 网络状态
      setOnlineStatus: (isOnline) => set({ isOnline }),

      // UI 状态
      toggleSidebar: () =>
        set((state: AppStore) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setPageTitle: (pageTitle) => set({ pageTitle }),
    }),
    {
      name: 'app-store',
      // 只持久化部分状态
      partialize: (state: AppStore) => ({
        config: state.config,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  ),
);

// 选择器示例
export const selectNotificationCount = (state: AppStore) => state.notifications.length;
export const selectIsLoading = (state: AppStore) => state.loading || state.globalLoading;
export const selectConfig = (state: AppStore) => state.config;
