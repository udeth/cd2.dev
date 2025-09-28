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

// GetSubject 相关类型
export type GetSubjectRequest = {};

export interface DataItem {
  creatName: string;
  isJoin: boolean;
  formStatusType: string;
  top: boolean;
  targetId: string;
  targetType: number;
  learned: boolean;
  form1530TaskType: string;
  lackDay: number;
  formId: string;
  creatorIdentityId: string;
  type: string;
  classId: string;
  className: string;
  title: string;
  summary: string;
  publishTimeEx: string;
  createTime: string;
  endTime: string;
  modificatiomTime: string;
  isParentSignature: boolean;
  isParentConfirm: boolean;
  participantConditionType: string;
  isEnd: boolean;
  isOneByOne: boolean;
  days: number;
  totalDays: number;
  clockInStartTime: string;
  isRest: boolean;
  modify: boolean;
  partialReceiveCount: number;
  systemActivityId: string;
  status: number;
  isMosaic: boolean;
  isWatermark: boolean;
  isSafeClose: boolean;
  completeType: string;
  isSupplementarySubmit: boolean;
  isDownload: boolean;
  allowFamilyCommitteeView: boolean;
  participated: number;
  creatorIdentityType: string;
}

export type GetSubjectResponse = DataItem[];

// GetStudentScore 相关类型
export interface GetStudentScoreBySubjectIdRequest {
  source_id: string;
  name: string;
}

export interface GetstudentScoreDetailsTotalScoreData {
  showRank: boolean;
  showTotalScore: boolean;
}

export interface GetstudentScoreDetailsColumnData {
  columnSeq: number;
  headName: string;
  fieldValue: string;
  conversionValue: string;
  rank: string;
  showRank: boolean;
  average: string;
  showAverage: boolean;
  highest: string;
  showHighest: boolean;
  isConversion: boolean;
  singleStatistics: boolean;
}

export interface GetstudentScoreDetailsData {
  rowDataId: string;
  studentName: string;
  studentIdentityId: string;
  comment: string;
  statisticsSwitch: number;
  isParentSignature: boolean;
  signUrl: string;
  thumbnail: string;
  isJoin: boolean;
  totalScoreData: GetstudentScoreDetailsTotalScoreData;
  columnData: GetstudentScoreDetailsColumnData[];
}

export type GetStudentScoreResponse = GetstudentScoreDetailsData;

// 其他相关类型
export interface JoinClassData {
  identityIds: string[];
  isNeedExamine: boolean;
}

export type JoinClassResponse = JoinClassData;

export interface ExitClassRequest {
  reason: string[];
}

export interface ExitClassResponse {}

export interface QueryStudentFormInfosRequest {
  identityId: string;
  formStatus: string;
  type: string;
  createTime: string;
  customTime: string;
  currentPage: number;
  itemsPerPage: number;
}

export type QueryStudentFormInfosResponse = DataItem[];
