export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
  code: string;
};

export type SendVerificationCodeRequest = {
  email: string;
  scene: 'register' | 'login' | 'reset_password';
};

export type SignInWithGoogleCodeRequest = {
  code: string;
  state: string;
  scope: string;
  authuser: string;
  prompt: string;
};

export type UpdateUserInfoRequest = {
  nickname: string; // 昵称，最多50个字符
  avatar: string;   // 头像URL，最多500个字符
};

// ----------------------------------------------------------------------

export interface SignInResponse {
  token: string;
}

export interface SignUpResponse {
  token: string;
}

export interface GoogleOAuthResponse {
  auth_url: string;
}

export interface GoogleSignInResponse {
  access_token: string;
}

export interface UpdateUserInfoResponse {
  // 修改用户信息响应为空
}
