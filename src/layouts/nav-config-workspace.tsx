import { useState, useEffect, useCallback } from 'react';
import type { WorkspacesPopoverProps } from './components/workspaces-popover';

import { CONFIG } from 'src/global-config';
import { getUserWorkspaces } from 'src/actions/workspace';
import type { WorkspaceInfo } from 'src/types/api/workspace';

// ----------------------------------------------------------------------

// 默认工作区数据，用作加载前的备选数据
const _workspaces: WorkspacesPopoverProps['data'] = [
  {
    id: '1',
    name: 'Space 1',
    plan: 'Free',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`,
  },
  {
    id: '2',
    name: 'Space 2',
    plan: 'Pro',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
  },
  {
    id: '3',
    name: 'Space 3',
    plan: 'Pro',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-3.webp`,
  },
];

// 将API响应转换为组件所需格式的工具函数
const transformWorkspaceData = (workspaces: WorkspaceInfo[]): NonNullable<WorkspacesPopoverProps['data']> => workspaces.map((workspace) => ({
    id: workspace.id.toString(),
    name: workspace.name,
    plan: workspace.plan,
    logo: workspace.logo || `${CONFIG.assetsDir}/assets/icons/workspaces/logo-default.webp`,
  }));

// Hook for managing workspace data
export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<NonNullable<WorkspacesPopoverProps['data']>>(_workspaces);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUserWorkspaces({});
      const transformedData = transformWorkspaceData(response.workspaces || []);

      if (transformedData.length > 0) {
        setWorkspaces(transformedData);
      } else {
        setWorkspaces(_workspaces);
      }
    } catch (err) {
      console.error('Failed to load workspaces:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workspaces');
      // 发生错误时保持使用默认数据
      setWorkspaces(_workspaces);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  return {
    workspaces,
    loading,
    error,
    refetch: loadWorkspaces,
  };
};
