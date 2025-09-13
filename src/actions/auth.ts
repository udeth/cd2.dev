import axios, { endpoints } from 'src/lib/axios';
import type {
  SignInRequest,
  SignUpRequest,
  SendVerificationCodeRequest,
  SignInWithGoogleCodeRequest
} from 'src/types/auth';

// ----------------------------------------------------------------------

/** **************************************
 * Sign in with password
 *************************************** */
export const signInWithPassword = async (params: SignInRequest): Promise<{ token: string }> => {
  try {
    const res = await axios.post(endpoints.auth.signIn, params);
    const { token } = res.data.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    return { token };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async (req: SignUpRequest): Promise<{ token: string }> => {
  try {
    const res = await axios.post(endpoints.auth.signUp, req);
    const { token } = res.data.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    return { token };
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
    const res = await axios.post(endpoints.auth.sendVerificationCode, req);

    if (!res.data) {
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
export const getGoogleOAuthUrl = async (): Promise<{ auth_url: string }> => {
  try {
    const res = await axios.post(endpoints.auth.googleOAuth);
    const { auth_url } = res.data.data;

    if (!auth_url) {
      throw new Error('Failed to get Google OAuth URL from server');
    }

    return { auth_url };
  } catch (error) {
    console.error('Error getting Google OAuth URL:', error);
    throw error;
  }
};

/** **************************************
 * Sign in with Google code
 *************************************** */
export const signInWithGoogleCode = async (req: SignInWithGoogleCodeRequest): Promise<{ access_token: string }> => {
  try {
    const res = await axios.post(endpoints.auth.googleSignIn, req);
    const { access_token } = res.data.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    return { access_token };
  } catch (error) {
    console.error('Error during Google sign in:', error);
    throw error;
  }
};
