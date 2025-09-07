/**
 * 💾 Zustand Persist 中间件
 * 提供状态持久化到 localStorage/sessionStorage
 */

import { createJSONStorage, persist as zustandPersist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { PersistOptions } from 'zustand/middleware/persist';

// 存储类型
export type StorageType = 'localStorage' | 'sessionStorage' | 'custom';

// 持久化配置选项
export interface PersistConfig<T> extends Omit<PersistOptions<T>, 'storage'> {
  storageType?: StorageType;
  customStorage?: any;
}

/**
 * 获取存储实例
 */
const getStorage = (type: StorageType, customStorage?: any) => {
  switch (type) {
    case 'localStorage':
      return createJSONStorage(() => localStorage);
    case 'sessionStorage':
      return createJSONStorage(() => sessionStorage);
    case 'custom':
      return customStorage;
    default:
      return createJSONStorage(() => localStorage);
  }
};

/**
 * Persist 中间件包装器
 * 支持多种存储类型和自定义配置
 */
export const persist = <T>(
  stateCreator: StateCreator<T, [], [], T>,
  config: PersistConfig<T>
) => {
  const {
    storageType = 'localStorage',
    customStorage,
    name,
    partialize,
    onRehydrateStorage,
    version = 1,
    migrate,
    merge = (persistedState, currentState) => ({ 
      ...currentState, 
      ...(persistedState || {}) 
    }),
    ...restConfig
  } = config;

  const storage = getStorage(storageType, customStorage);

  return zustandPersist(stateCreator, {
    name,
    storage,
    partialize,
    onRehydrateStorage,
    version,
    migrate,
    merge,
    ...restConfig,
  });
};

// 便捷的预配置中间件
export const createPersist = <T>(
  name: string,
  options: Omit<PersistConfig<T>, 'name'> = {}
) => (stateCreator: StateCreator<T, [], [], T>) =>
  persist(stateCreator, { name, ...options });

// 预定义的持久化策略
export const persistStrategies = {
  /**
   * 用户偏好持久化 - 使用 localStorage，长期保存
   */
  userPreferences: <T>(name: string, partialize?: (state: T) => T) =>
    createPersist(name, {
      storageType: 'localStorage',
      partialize,
      version: 1,
    }),

  /**
   * 会话状态持久化 - 使用 sessionStorage，会话期间保存
   */
  sessionState: <T>(name: string, partialize?: (state: T) => T) =>
    createPersist(name, {
      storageType: 'sessionStorage',
      partialize,
      version: 1,
    }),

  /**
   * 临时缓存 - 使用 localStorage，但有版本控制
   */
  tempCache: <T>(name: string, version: number = 1) =>
    createPersist(name, {
      storageType: 'localStorage',
      version,
      // 版本变化时清空缓存
      migrate: (persistedState: any, migrateVersion: number) => {
        if (migrateVersion !== 1) {
          return {} as T;
        }
        return persistedState;
      },
    }),
};

// 存储管理工具
export const storageUtils = {
  /**
   * 清空指定 store 的持久化数据
   */
  clearStore: (storeName: string, storageType: StorageType = 'localStorage') => {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    storage.removeItem(storeName);
  },

  /**
   * 清空所有 Zustand 相关的存储
   */
  clearAllStores: (prefix: string = 'store') => {
    const clearStorage = (storage: Storage) => {
      const keys = Object.keys(storage).filter(key => key.startsWith(prefix));
      keys.forEach(key => storage.removeItem(key));
    };

    clearStorage(localStorage);
    clearStorage(sessionStorage);
  },

  /**
   * 获取存储大小（字节）
   */
  getStorageSize: (storageType: StorageType = 'localStorage') => {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    let total = 0;

    for (const key in storage) {
      if (Object.prototype.hasOwnProperty.call(storage, key)) {
        total += storage[key].length + key.length;
      }
    }

    return total;
  },

  /**
   * 检查存储是否可用
   */
  isStorageAvailable: (storageType: StorageType = 'localStorage') => {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('Storage is not available:', e);
      return false;
    }
  },

  /**
   * 导出存储数据
   */
  exportStore: (storeName: string, storageType: StorageType = 'localStorage') => {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const data = storage.getItem(storeName);
    return data ? JSON.parse(data) : null;
  },

  /**
   * 导入存储数据
   */
  importStore: (
    storeName: string,
    data: any,
    storageType: StorageType = 'localStorage'
  ) => {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    storage.setItem(storeName, JSON.stringify(data));
  },
};
