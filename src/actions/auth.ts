import axios, { endpoints } from 'src/lib/axios';
import type {
  SignInRequest,
  SignUpRequest,
  SignInResponse,
  SignUpResponse,
  GoogleOAuthResponse, GoogleSignInResponse,
  SendVerificationCodeRequest, SignInWithGoogleCodeRequest,
  UpdateUserInfoRequest, UpdateUserInfoResponse,
} from 'src/types/api/auth';
import type {Response} from "../types/response";

// ----------------------------------------------------------------------

/** **************************************
 * Sign in with password
 *************************************** */
export const signInWithPassword = async (params: SignInRequest): Promise<SignInResponse> => {
  try {
    const rsp = await axios.post<Response<SignInResponse>>(endpoints.auth.signIn, params);
    const data  = rsp.data.data;

    if (!data) {
      throw new Error('Access token not found in response');
    }

    return data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async (req: SignUpRequest): Promise<SignUpResponse> => {
  try {
    const rsp = await axios.post<Response<SignUpResponse>>(endpoints.auth.signUp, req);
    const data = rsp.data.data;

    if (!data) {
      throw new Error('Access token not found in response');
    }

    return data;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Send verification code
 *************************************** */
export const sendVerificationCode = async (req: SendVerificationCodeRequest): Promise<void> => {
  try {
    const rsp = await axios.post<Response<void>>(endpoints.auth.sendVerificationCode, req);

    if (!rsp.data) {
      throw new Error('Failed to send verification code');
    }
  } catch (error) {
    console.error('Error during sending verification code:', error);
    throw error;
  }
};

/** **************************************
 * Get Google OAuth URL
 *************************************** */
export const getGoogleOAuthUrl = async (): Promise<GoogleOAuthResponse> => {
  try {
    const rsp = await axios.post<Response<GoogleOAuthResponse>>(endpoints.auth.googleOAuth);
    const data = rsp.data.data;

    if (!data) {
      throw new Error('Failed to get Google OAuth URL from server');
    }

    return data;
  } catch (error) {
    console.error('Error getting Google OAuth URL:', error);
    throw error;
  }
};

/** **************************************
 * Sign in with Google code
 *************************************** */
export const signInWithGoogleCode = async (req: SignInWithGoogleCodeRequest): Promise<GoogleSignInResponse> => {
  try {
    const rsp = await axios.post<Response<GoogleSignInResponse>>(endpoints.auth.googleSignIn, req);
    const data = rsp.data.data;

    if (!data) {
      throw new Error('Access token not found in response');
    }

    return data;
  } catch (error) {
    console.error('Error during Google sign in:', error);
    throw error;
  }
};

/** **************************************
 * Update user profile
 *************************************** */
export const updateUserProfile = async (req: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> => {
  try {
    const rsp = await axios.post<Response<UpdateUserInfoResponse>>(endpoints.auth.updateProfile, req);
    const data = rsp.data.data;

    if (!data && rsp.data.data !== null) {
      throw new Error('Failed to update user profile');
    }

    return data || {};
  } catch (error) {
    console.error('Error during update user profile:', error);
    throw error;
  }
};
