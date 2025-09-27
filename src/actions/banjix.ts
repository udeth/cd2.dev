import axios, { endpoints } from 'src/lib/axios';
import type {
  GetMembersRequest,
  GetMembersResponse,
  GetSubjectRequest,
  GetSubjectResponse,
  GetStudentScoreBySubjectIdRequest,
  GetStudentScoreBySubjectIdResponse,
} from 'src/types/api/banjix';
import type { Response } from '../types/response';

// ----------------------------------------------------------------------

/** **************************************
 * 获取成员列表
 *************************************** */
export const getMembers = async (params: GetMembersRequest): Promise<GetMembersResponse> => {
  try {
    const rsp = await axios.post<Response<GetMembersResponse>>(endpoints.banjix.members, params);
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

// ----------------------------------------------------------------------

/** **************************************
 * 获取科目信息
 *************************************** */
export const getSubject = async (params: GetSubjectRequest): Promise<GetSubjectResponse> => {
  try {
    const rsp = await axios.post<Response<GetSubjectResponse>>(endpoints.banjix.subject, params);
    const data = rsp.data.data;

    if (!data) {
      throw new Error('Failed to get subject: No data returned');
    }

    return data;
  } catch (error) {
    console.error('Error getting subject:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

/** **************************************
 * 根据科目ID获取学生成绩
 *************************************** */
export const getStudentScoreBySubjectId = async (
  params: GetStudentScoreBySubjectIdRequest
): Promise<GetStudentScoreBySubjectIdResponse> => {
  try {
    const rsp = await axios.post<Response<GetStudentScoreBySubjectIdResponse>>(
      endpoints.banjix.studentScore,
      params
    );
    const data = rsp.data.data;

    if (!data) {
      throw new Error('Failed to get student score: No data returned');
    }

    return data;
  } catch (error) {
    console.error('Error getting student score:', error);
    throw error;
  }
};
