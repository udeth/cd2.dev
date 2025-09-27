// BanjiY API 类型定义

// GetMembers 相关类型
export interface GetClassStudentsData {
  studentName: string;
  studentIdentityId: string;
  pinYinHeader: string;
  studentNo: string;
  isRosterUser: boolean;
}

export type GetMembersRequest = {};

export type GetMembersResponse = GetClassStudentsData[];
