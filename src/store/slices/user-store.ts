/**
 * 👤 用户状态管理
 * 管理用户信息、认证状态、权限等
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BaseState, StoreActions, ActionResult } from '../types';

// 用户信息类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  permissions: string[];
  preferences: UserPreferences;
  lastLoginAt: string;
  createdAt: string;
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    itemsPerPage: number;
  };
}

// 认证状态
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
}

// User Store 状态
export interface UserState extends BaseState, AuthState {
  // 用户信息
  user: User | null;

  // 权限检查缓存
  permissionCache: Record<string, boolean>;

  // 登录状态
  loginLoading: boolean;
  logoutLoading: boolean;

  // 用户列表（管理员功能）
  users: User[];
  usersLoading: boolean;
}

// User Store Actions
export interface UserActions extends StoreActions {
  // 认证相关
  login: (email: string, password: string) => Promise<ActionResult<User>>;
  logout: () => Promise<ActionResult>;
  refreshAuth: () => Promise<ActionResult>;

  // 用户信息
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => Promise<ActionResult<User>>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<ActionResult>;

  // 权限检查
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  checkPermissions: (permissions: string[]) => boolean;

  // 用户管理（管理员功能）
  fetchUsers: () => Promise<ActionResult<User[]>>;
  createUser: (userData: Partial<User>) => Promise<ActionResult<User>>;
  updateUserById: (id: string, updates: Partial<User>) => Promise<ActionResult<User>>;
  deleteUser: (id: string) => Promise<ActionResult>;
}

// 组合类型
export type UserStore = UserState & UserActions;

// 默认用户偏好
const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  dashboard: {
    layout: 'grid',
    itemsPerPage: 20,
  },
};

// 默认状态
const defaultState: UserState = {
  // 基础状态
  loading: false,
  error: null,

  // 认证状态
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,

  // 用户信息
  user: null,

  // 权限缓存
  permissionCache: {},

  // 加载状态
  loginLoading: false,
  logoutLoading: false,

  // 用户列表
  users: [],
  usersLoading: false,
};

// 创建 User Store
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // 基础 actions
      reset: () => set(defaultState),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // 认证相关
      login: async (email, password) => {
        set({ loginLoading: true, error: null });

        try {
          // TODO: 实际的登录 API 调用
          console.log('Login attempt:', { email, password });

          // 模拟 API 响应
          const mockUser: User = {
            id: '1',
            email,
            name: 'Mock User',
            role: 'user',
            permissions: ['read', 'write'],
            preferences: defaultPreferences,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            tokenExpiresAt: Date.now() + 3600000, // 1 hour
            loginLoading: false,
          });

          return { success: true, data: mockUser };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, loginLoading: false });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        set({ logoutLoading: true });

        try {
          // TODO: 实际的登出 API 调用
          console.log('Logout');

          set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            tokenExpiresAt: null,
            permissionCache: {},
            logoutLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Logout failed';
          set({ error: message, logoutLoading: false });
          return { success: false, error: message };
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          return { success: false, error: 'No refresh token' };
        }

        try {
          // TODO: 实际的刷新 token API 调用
          console.log('Refresh auth');

          set({
            accessToken: 'new-mock-access-token',
            tokenExpiresAt: Date.now() + 3600000,
          });

          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Token refresh failed';
          set({ error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      // 用户信息
      setUser: (user) => set({ user }),

      updateUser: async (updates) => {
        const { user } = get();
        if (!user) {
          return { success: false, error: 'No user logged in' };
        }

        set({ loading: true });

        try {
          // TODO: 实际的更新用户 API 调用
          console.log('Update user:', updates);

          const updatedUser = { ...user, ...updates };
          set({ user: updatedUser, loading: false });

          return { success: true, data: updatedUser };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Update failed';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      updatePreferences: async (preferences) => {
        const { user } = get();
        if (!user) {
          return { success: false, error: 'No user logged in' };
        }

        try {
          const updatedPreferences = { ...user.preferences, ...preferences };
          const updatedUser = { ...user, preferences: updatedPreferences };

          set({ user: updatedUser });

          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Preferences update failed';
          return { success: false, error: message };
        }
      },

      // 权限检查
      hasPermission: (permission) => {
        const { user, permissionCache } = get();

        if (!user) return false;

        // 检查缓存
        if (permissionCache[permission] !== undefined) {
          return permissionCache[permission];
        }

        // 计算权限
        const hasAccess = user.permissions.includes(permission) || user.role === 'admin';

        // 缓存结果
        set((state: UserStore) => ({
          permissionCache: { ...state.permissionCache, [permission]: hasAccess },
        }));

        return hasAccess;
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      checkPermissions: (permissions) => permissions.every((permission) => get().hasPermission(permission)),

      // 用户管理
      fetchUsers: async () => {
        set({ usersLoading: true, error: null });

        try {
          // TODO: 实际的获取用户列表 API 调用
          console.log('Fetch users');

          // 模拟数据
          const users: User[] = [
            {
              id: '1',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin',
              permissions: ['read', 'write', 'delete'],
              preferences: defaultPreferences,
              lastLoginAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            },
          ];

          set({ users, usersLoading: false });

          return { success: true, data: users };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch users';
          set({ error: message, usersLoading: false });
          return { success: false, error: message };
        }
      },

      createUser: async (userData) => {
        try {
          // TODO: 实际的创建用户 API 调用
          console.log('Create user:', userData);

          const newUser: User = {
            id: Date.now().toString(),
            email: userData.email || '',
            name: userData.name || '',
            role: userData.role || 'user',
            permissions: userData.permissions || ['read'],
            preferences: userData.preferences || defaultPreferences,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };

          set((state: UserStore) => ({
            users: [...state.users, newUser],
          }));

          return { success: true, data: newUser };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create user';
          return { success: false, error: message };
        }
      },

      updateUserById: async (id, updates) => {
        try {
          // TODO: 实际的更新用户 API 调用
          console.log('Update user by ID:', id, updates);

          set((state: UserStore) => ({
            users: state.users.map((user) =>
              user.id === id ? { ...user, ...updates } : user
            ),
          }));

          const updatedUser = get().users.find((user) => user.id === id);

          return { success: true, data: updatedUser };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update user';
          return { success: false, error: message };
        }
      },

      deleteUser: async (id) => {
        try {
          // TODO: 实际的删除用户 API 调用
          console.log('Delete user:', id);

          set((state: UserStore) => ({
            users: state.users.filter((user) => user.id !== id),
          }));

          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete user';
          return { success: false, error: message };
        }
      },
    }),
    {
      name: 'user-store',
      // 只持久化认证相关状态
      partialize: (state: UserStore) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
        user: state.user,
      }),
    }
  ),
);

// 选择器示例
export const selectUser = (state: UserStore) => state.user;
export const selectIsAuthenticated = (state: UserStore) => state.isAuthenticated;
export const selectUserRole = (state: UserStore) => state.user?.role;
export const selectUserPermissions = (state: UserStore) => state.user?.permissions || [];
