import axios, { endpoints } from 'src/lib/axios';
import type {
  GetMembersRequest,
  GetMembersResponse,
  GetSubjectRequest,
  GetSubjectResponse,
  GetStudentScoreBySubjectIdRequest,
  GetStudentScoreResponse,
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

/** **************************************
 * 获取科目列表
 *************************************** */
export const getSubject = async (params: GetSubjectRequest): Promise<GetSubjectResponse> => {
  try {
    const rsp = await axios.post<Response<GetSubjectResponse>>(endpoints.banjiy.subject, params);
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

/** **************************************
 * 获取学生成绩详情
 *************************************** */
export const getStudentScore = async (params: GetStudentScoreBySubjectIdRequest): Promise<GetStudentScoreResponse> => {
  try {
    const rsp = await axios.post<Response<GetStudentScoreResponse>>(endpoints.banjiy.studentScore, params);
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