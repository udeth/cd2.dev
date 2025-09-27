// BanjiX API 类型定义

// GetMembers 相关类型
export interface GetJoinedMembersNameNewEntity {
  name: string;
  snum: number;
}

export type GetMembersRequest = {};

export type GetMembersResponse = GetJoinedMembersNameNewEntity[];

// ----------------------------------------------------------------------

// GetSubject 相关类型
export interface TinyParent {
  score: string;
  creator_wx_name: string;
  title: string;
  text_content: string;
}

export interface GetParentDataItem {
  safeInfo: Record<string, any>;
  tiku: any;
  class_type: number;
  type: number;
  photo_content: any[];
  video_contents: any[];
  creator_teach_role: number;
  need_feedback: boolean;
  need_check: boolean;
  feedback_type: number;
  end_day_valid: boolean;
  daka_calendar: any[];
  unfeedbacks: any[];
  unaccepts: any[];
  share: boolean;
  is_del: boolean;
  is_remind: boolean;
  daka_time_type: number;
  daka_rest: any[];
  point: number;
  is_accept: boolean;
  is_feedback: boolean;
  is_checked: boolean;
  is_owner: boolean;
  cls_all_parent_number: number;
  cls_now_parent_number: number;
  ex_members: string[];
  tip_count: number;
  _id: string;
  cls: string;
  creator_wx_openid: string;
  score: string;
  __v: number;
  answer_check: any[];
  class_name: string;
  contrast: any;
  course_explains: any[];
  create_at: string;
  creator_wx_avatar: string | null;
  creator_wx_name: string;
  daka_date_count: any[];
  daka_end_day: string;
  daka_start_day: string;
  file_content: any[];
  last_feedback_at: string;
  record_contents: any[];
  sort_time: string;
  stats_list: any[];
  text_content: string;
  title: string;
  update_at: string;
  datika: boolean;
  fellow_read: boolean;
  fellow_write: boolean;
  is_read: boolean;
}

export type GetSubjectRequest = {};

export type GetSubjectResponse = GetParentDataItem[];

// ----------------------------------------------------------------------

// GetStudentScoreBySubjectId 相关类型
export interface GetStudentScoreBySubjectIdRequest {
  source_id: string;
  name: string;
}

export interface StudentScoreByIdScoreDetail {
  subject: string;
  score: string;
}

export interface StudentScoreByIdStudentScore {
  visibly: number;
  _id: string;
  comment: string;
  score_detail: StudentScoreByIdScoreDetail[];
  total_info: Record<string, any>;
  is_sign: boolean;
  history: any[];
  locationData: any;
  s_visible: boolean;
  config_headers: any[];
}

export interface StudentScoreByIdNotify {
  tiku: any;
  type: number;
  need_feedback: boolean;
  feedback_count: number;
  daka_day: any[];
  ex_members: string[];
  status: number;
  _id: string;
  cls: string;
  creator_wx_openid: string;
  class_name: string;
  contrast: any;
  create_at: string;
  creator_wx_name: string;
  daka_end_day: string;
  daka_latest: string;
  daka_start_day: string;
  feedbacks: any[];
  sort_time: string;
  text_content: string;
  title: string;
  files: any[];
  update_at: string;
  __v: number;
  id: string;
}

export interface GetStudentScoreBySubjectIdResponse {
  status: string;
  studentScore: StudentScoreByIdStudentScore;
  name: string;
  notify: StudentScoreByIdNotify;
  matched: any[];
}
