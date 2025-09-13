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
