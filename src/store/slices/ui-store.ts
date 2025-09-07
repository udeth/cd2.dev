/**
 * 🎨 UI 状态管理
 * 管理界面状态，如模态框、抽屉、主题等
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BaseState, StoreActions } from '../types';

// 模态框状态
export interface ModalState {
  id: string;
  type: string;
  title?: string;
  data?: any;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 抽屉状态
export interface DrawerState {
  id: string;
  type: string;
  title?: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  data?: any;
}

// 面包屑项
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

// Toast 通知
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// UI Store 状态
export interface UIState extends BaseState {
  // 布局状态
  sidebarCollapsed: boolean;
  headerHeight: number;
  footerHeight: number;

  // 主题状态
  themeMode: 'light' | 'dark' | 'auto';
  primaryColor: string;

  // 模态框管理
  modals: ModalState[];

  // 抽屉管理
  drawers: DrawerState[];

  // 面包屑
  breadcrumbs: BreadcrumbItem[];

  // Toast 通知
  toasts: Toast[];

  // 全局搜索
  searchOpen: boolean;
  searchQuery: string;
  searchResults: any[];
  searchLoading: boolean;

  // 快捷键帮助
  shortcutsHelpOpen: boolean;

  // 页面加载状态
  pageLoading: boolean;

  // 回到顶部按钮
  showBackToTop: boolean;

  // 屏幕尺寸
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isMobile: boolean;
}

// UI Store Actions
export interface UIActions extends StoreActions {
  // 布局控制
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setHeaderHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;

  // 主题控制
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  setPrimaryColor: (color: string) => void;

  // 模态框管理
  openModal: (modal: Omit<ModalState, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // 抽屉管理
  openDrawer: (drawer: Omit<DrawerState, 'id'>) => string;
  closeDrawer: (id: string) => void;
  closeAllDrawers: () => void;

  // 面包屑管理
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;

  // Toast 管理
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;

  // 搜索管理
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  setSearchLoading: (loading: boolean) => void;

  // 快捷键帮助
  openShortcutsHelp: () => void;
  closeShortcutsHelp: () => void;

  // 页面状态
  setPageLoading: (loading: boolean) => void;
  setShowBackToTop: (show: boolean) => void;

  // 屏幕尺寸
  setScreenSize: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => void;
  setIsMobile: (isMobile: boolean) => void;
}

// 组合类型
export type UIStore = UIState & UIActions;

// 默认状态
const defaultState: UIState = {
  // 基础状态
  loading: false,
  error: null,

  // 布局状态
  sidebarCollapsed: false,
  headerHeight: 64,
  footerHeight: 0,

  // 主题状态
  themeMode: 'auto',
  primaryColor: '#1976D2',

  // 模态框和抽屉
  modals: [],
  drawers: [],

  // 面包屑
  breadcrumbs: [],

  // Toast 通知
  toasts: [],

  // 搜索状态
  searchOpen: false,
  searchQuery: '',
  searchResults: [],
  searchLoading: false,

  // 其他 UI 状态
  shortcutsHelpOpen: false,
  pageLoading: false,
  showBackToTop: false,

  // 屏幕状态
  screenSize: 'lg',
  isMobile: false,
};

// 生成唯一 ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

// 创建 UI Store
export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // 基础 actions
      reset: () => set(defaultState),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // 布局控制
      toggleSidebar: () => set((state: UIStore) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      setHeaderHeight: (headerHeight) => set({ headerHeight }),

      setFooterHeight: (footerHeight) => set({ footerHeight }),

      // 主题控制
      setThemeMode: (themeMode) => set({ themeMode }),

      setPrimaryColor: (primaryColor) => set({ primaryColor }),

      // 模态框管理
      openModal: (modalData) => {
        const id = generateId();
        const modal = { id, ...modalData };

        set((state: UIStore) => ({
          modals: [...state.modals, modal],
        }));

        return id;
      },

      closeModal: (id) =>
        set((state: UIStore) => ({
          modals: state.modals.filter((modal) => modal.id !== id),
        })),

      closeAllModals: () => set({ modals: [] }),

      // 抽屉管理
      openDrawer: (drawerData) => {
        const id = generateId();
        const drawer = { id, ...drawerData };

        set((state: UIStore) => ({
          drawers: [...state.drawers, drawer],
        }));

        return id;
      },

      closeDrawer: (id) =>
        set((state: UIStore) => ({
          drawers: state.drawers.filter((drawer) => drawer.id !== id),
        })),

      closeAllDrawers: () => set({ drawers: [] }),

      // 面包屑管理
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

      addBreadcrumb: (item) =>
        set((state: UIStore) => ({
          breadcrumbs: [...state.breadcrumbs, item],
        })),

      // Toast 管理
      showToast: (toastData) => {
        const id = generateId();
        const toast: Toast = {
          id,
          duration: 5000, // 默认 5 秒
          ...toastData,
        };

        set((state: UIStore) => ({
          toasts: [...state.toasts, toast],
        }));

        // 自动隐藏
        if (toast.duration && toast.duration > 0) {
          setTimeout(() => {
            get().hideToast(id);
          }, toast.duration);
        }

        return id;
      },

      hideToast: (id) =>
        set((state: UIStore) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      clearToasts: () => set({ toasts: [] }),

      // 搜索管理
      openSearch: () => set({ searchOpen: true }),

      closeSearch: () =>
        set({
          searchOpen: false,
          searchQuery: '',
          searchResults: [],
        }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSearchResults: (searchResults) => set({ searchResults }),

      setSearchLoading: (searchLoading) => set({ searchLoading }),

      // 快捷键帮助
      openShortcutsHelp: () => set({ shortcutsHelpOpen: true }),

      closeShortcutsHelp: () => set({ shortcutsHelpOpen: false }),

      // 页面状态
      setPageLoading: (pageLoading) => set({ pageLoading }),

      setShowBackToTop: (showBackToTop) => set({ showBackToTop }),

      // 屏幕尺寸
      setScreenSize: (screenSize) => set({ screenSize }),

      setIsMobile: (isMobile) => set({ isMobile }),
    }),
    {
      name: 'ui-store',
      // 只持久化用户偏好相关的状态
      partialize: (state: UIStore) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        themeMode: state.themeMode,
        primaryColor: state.primaryColor,
      }),
    }
  )
);

// 选择器示例
export const selectModals = (state: UIStore) => state.modals;
export const selectDrawers = (state: UIStore) => state.drawers;
export const selectToasts = (state: UIStore) => state.toasts;
export const selectThemeMode = (state: UIStore) => state.themeMode;
export const selectIsMobile = (state: UIStore) => state.isMobile;
export const selectSidebarCollapsed = (state: UIStore) => state.sidebarCollapsed;
