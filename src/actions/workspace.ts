import axios, { endpoints } from 'src/lib/axios';
import type {
  UserWorkspacesRequest,
  UserWorkspacesResponse,
} from 'src/types/api/workspace';
import type { Response } from '../types/response';
import { _workspacesMock } from '../_mock';

// ----------------------------------------------------------------------

/** **************************************
 * Get user workspaces
 *************************************** */
export const getUserWorkspaces = async (params: UserWorkspacesRequest): Promise<UserWorkspacesResponse> => {
  try {
    // 尝试调用真实API
    try {
      const rsp = await axios.post<Response<UserWorkspacesResponse>>(endpoints.workspace.list, { params });
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
