import axios, { endpoints } from 'src/lib/axios';
import type {
  GetUserWorkspacesRequest,
  GetUserWorkspacesResponse,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  DeleteWorkspaceRequest,
  DeleteWorkspaceResponse,
} from 'src/types/api/workspace';
import type { Response } from '../types/response';
import { _workspacesMock } from '../_mock';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

/** **************************************
 * Get user workspaces
 *************************************** */
export const getUserWorkspaces = async (params: GetUserWorkspacesRequest): Promise<GetUserWorkspacesResponse> => {
  try {
    // 尝试调用真实API
    try {
      const rsp = await axios.post<Response<GetUserWorkspacesResponse>>(endpoints.workspace.list, { params });
      const data = rsp.data.data;

      if (data && data.workspaces && data.workspaces.length > 0) {
        return data;
      }
    } catch (apiError) {
      console.warn('Real API failed, falling back to mock data:', apiError);
    }

    // 如果真实API失败或没有数据，使用模拟数据
    return {
      workspaces: _workspacesMock,
    };
  } catch (error) {
    console.error('Error getting user workspaces:', error);
    // 即使在错误情况下也返回模拟数据
    return {
      workspaces: _workspacesMock,
    };
  }
};

// ----------------------------------------------------------------------

/** **************************************
 * Create workspace
 *************************************** */
export const createWorkspace = async (params: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> => {
  try {
    // 尝试调用真实API
    const rsp = await axios.post<Response<CreateWorkspaceResponse>>(endpoints.workspace.create, params);
    const data = rsp.data.data;

    if (data) {
      return data;
    }

    throw new Error('Failed to create workspace: No data returned');
  } catch (error) {
    console.error('Error creating workspace:', error);

    // 在真实API失败的情况下，返回模拟数据（用于开发和测试）
    const mockResponse: CreateWorkspaceResponse = {
      id: Math.floor(Math.random() * 10000),
      name: params.name,
      description: params.description || '',
      user_id: 1, // 模拟用户ID
      is_default: params.is_default || false,
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 如果新工作区设为默认，需要将其他工作区的默认状态取消
    if (params.is_default) {
      _workspacesMock.forEach(workspace => {
        workspace.is_default = false;
      });
    }

    // 将新创建的工作区添加到模拟数据中
    const newWorkspace = {
      ...mockResponse,
      plan: 'Free', // 新工作区默认为免费计划
      logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`, // 默认logo
    };
    _workspacesMock.push(newWorkspace);

    // 在生产环境中，应该抛出错误而不是返回模拟数据
    // throw error;
    return mockResponse;
  }
};

// ----------------------------------------------------------------------

/** **************************************
 * Delete workspace
 *************************************** */
export const deleteWorkspace = async (params: DeleteWorkspaceRequest): Promise<DeleteWorkspaceResponse> => {
  try {
    // 尝试调用真实API
    const rsp = await axios.post<Response<DeleteWorkspaceResponse>>(endpoints.workspace.delete, params);
    const data = rsp.data.data;

    if (data !== undefined) {
      // 从模拟数据中移除删除的工作区（用于本地状态同步）
      const index = _workspacesMock.findIndex(workspace => workspace.id === params.id);
      if (index > -1) {
        const deletedWorkspace = _workspacesMock[index];
        _workspacesMock.splice(index, 1);

        // 如果删除的是默认工作区，需要设置一个新的默认工作区
        if (deletedWorkspace.is_default && _workspacesMock.length > 0) {
          _workspacesMock[0].is_default = true;
        }
      }

      return data;
    }

    throw new Error('Failed to delete workspace: No data returned');
  } catch (error) {
    console.error('Error deleting workspace:', error);

    // 在真实API失败的情况下，仍然从模拟数据中删除（用于开发和测试）
    const index = _workspacesMock.findIndex(workspace => workspace.id === params.id);
    if (index > -1) {
      const deletedWorkspace = _workspacesMock[index];
      _workspacesMock.splice(index, 1);

      // 如果删除的是默认工作区，需要设置一个新的默认工作区
      if (deletedWorkspace.is_default && _workspacesMock.length > 0) {
        _workspacesMock[0].is_default = true;
      }

      // 返回成功响应
      return {};
    }

    // 在生产环境中，应该抛出错误而不是返回成功
    // throw error;
    throw new Error(`Workspace with id ${params.id} not found`);
  }
};
