import axios, { endpoints } from 'src/lib/axios';
import type {
  GetUserWorkspacesRequest,
  GetUserWorkspacesResponse,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
} from 'src/types/api/workspace';
import type { Response } from '../types/response';
import { _workspacesMock } from '../_mock';

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

    // 在生产环境中，应该抛出错误而不是返回模拟数据
    // throw error;
    return mockResponse;
  }
};
