/**
 * 🔧 Store 通用类型定义
 */

// 基础状态接口
export interface BaseState {
  loading: boolean;
  error: string | null;
}

// 异步操作状态
export interface AsyncState extends BaseState {
  data: any;
  lastUpdated: number | null;
}

// 分页状态
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// 筛选状态
export interface FilterState {
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, any>;
}

// 列表状态组合
export interface ListState<T = any> extends BaseState, PaginationState, FilterState {
  items: T[];
  selectedIds: string[];
}

// 操作结果类型
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Store Action 基础类型
export interface StoreActions {
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 异步 Action 类型
export interface AsyncActions<T = any> extends StoreActions {
  fetch: () => Promise<ActionResult<T>>;
  refresh: () => Promise<ActionResult<T>>;
}

// 列表 Action 类型
export interface ListActions<T = any> extends AsyncActions<T[]> {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (field: string, order?: 'asc' | 'desc') => void;
  setFilters: (filters: Record<string, any>) => void;
  selectItem: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelected: () => Promise<ActionResult>;
}

// Store 中间件类型
export interface StoreMiddleware<T> {
  (config: T): T;
}

// Store 创建器配置
export interface StoreConfig<T> {
  name: string;
  persist?: boolean;
  devtools?: boolean;
  middleware?: StoreMiddleware<T>[];
}