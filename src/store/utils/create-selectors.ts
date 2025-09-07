/**
 * 🎯 选择器创建工具
 * 为 Zustand store 自动创建优化的选择器 hooks
 */

import type { StoreApi, UseBoundStore } from 'zustand';

// 选择器 Hook 类型
type SelectorHook<T> = {
  [K in keyof T as `use${Capitalize<string & K>}`]: () => T[K];
};

/**
 * 为 store 创建选择器 hooks
 * 每个属性都会生成一个对应的 hook，如 useUser, useLoading 等
 *
 * @param store - Zustand store
 * @returns 选择器 hooks 对象
 */
export function createSelectors<T extends Record<string, any>>(
  store: UseBoundStore<StoreApi<T>>
) {
  const storeIn = store as any;
  const selectors: any = {};

  // 为每个 store 属性创建选择器 hook
  Object.keys(storeIn.getState()).forEach((key) => {
    const hookName = `use${key.charAt(0).toUpperCase() + key.slice(1)}`;

    selectors[hookName] = () => storeIn((state: T) => state[key]);
  });

  return selectors as SelectorHook<T>;
}

/**
 * 创建计算选择器
 * 基于多个 store 值计算衍生状态
 *
 * @param store - Zustand store
 * @param computeFn - 计算函数
 * @returns computed hook
 */
export function createComputedSelector<T, R>(
  store: UseBoundStore<StoreApi<T>>,
  computeFn: (state: T) => R
) {
  return () => store(computeFn);
}

/**
 * 创建条件选择器
 * 只在条件满足时重新计算
 *
 * @param store - Zustand store
 * @param selector - 选择器函数
 * @param condition - 条件函数
 * @returns conditional hook
 */
export function createConditionalSelector<T, R>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => R,
  condition: (state: T) => boolean
) {
  return () => {
    const state = store.getState();

    if (!condition(state)) {
      return undefined;
    }

    return store(selector);
  };
}

/**
 * 创建数组选择器工具
 * 专门用于处理数组类型的 store 状态
 */
export const arraySelectors = {
  /**
   * 创建数组长度选择器
   */
  createLengthSelector: <T>(
    store: UseBoundStore<StoreApi<T>>,
    arrayKey: keyof T
  ) => () => store((state) => (state[arrayKey] as any[])?.length || 0),

  /**
   * 创建数组查找选择器
   */
  createFindSelector: <T, Item>(
    store: UseBoundStore<StoreApi<T>>,
    arrayKey: keyof T,
    predicate: (item: Item) => boolean
  ) => () => store((state) => (state[arrayKey] as Item[])?.find(predicate)),

  /**
   * 创建数组过滤选择器
   */
  createFilterSelector: <T, Item>(
    store: UseBoundStore<StoreApi<T>>,
    arrayKey: keyof T,
    predicate: (item: Item) => boolean
  ) => () => store((state) => (state[arrayKey] as Item[])?.filter(predicate) || []),

  /**
   * 创建数组映射选择器
   */
  createMapSelector: <T, Item, R>(
    store: UseBoundStore<StoreApi<T>>,
    arrayKey: keyof T,
    mapper: (item: Item) => R
  ) => () => store((state) => (state[arrayKey] as Item[])?.map(mapper) || []),
};

/**
 * 创建对象选择器工具
 * 专门用于处理对象类型的 store 状态
 */
export const objectSelectors = {
  /**
   * 创建对象键选择器
   */
  createKeysSelector: <T>(
    store: UseBoundStore<StoreApi<T>>,
    objectKey: keyof T
  ) => () => store((state) => Object.keys(state[objectKey] as object)),

  /**
   * 创建对象值选择器
   */
  createValuesSelector: <T>(
    store: UseBoundStore<StoreApi<T>>,
    objectKey: keyof T
  ) => () => store((state) => Object.values(state[objectKey] as object)),

  /**
   * 创建对象属性选择器
   */
  createPropertySelector: <T, K extends string>(
    store: UseBoundStore<StoreApi<T>>,
    objectKey: keyof T,
    propertyKey: K
  ) => () => store((state) => (state[objectKey] as any)?.[propertyKey]),
};
