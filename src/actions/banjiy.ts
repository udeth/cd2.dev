import axios, { endpoints } from 'src/lib/axios';
import type {
  GetMembersRequest,
  GetMembersResponse,
} from 'src/types/api/banjiy';
import type { Response } from '../types/response';

// ----------------------------------------------------------------------

/** **************************************
 * 获取成员列表
 *************************************** */
export const getMembers = async (params: GetMembersRequest): Promise<GetMembersResponse> => {
  try {
    const rsp = await axios.post<Response<GetMembersResponse>>(endpoints.banjiy.members, params);
    const data = rsp.data.data;

    if (!data) {
      throw new Error('Failed to get members: No data returned');
    }

    return data;
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
};