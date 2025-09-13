import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';
import type {
  SignInRequest,
  SignUpRequest,
  SendVerificationCodeRequest,
  SignInWithGoogleCodeRequest
} from "../../../types/auth";
import * as authApi from 'src/actions/auth';

// ----------------------------------------------------------------------

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async (params: SignInRequest): Promise<void> => {
  try {
    const { token } = await authApi.signInWithPassword(params);
    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async (req: SignUpRequest): Promise<void> => {
  try {
    const { token } = await authApi.signUp(req);
    sessionStorage.setItem(JWT_STORAGE_KEY, token);
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
    await authApi.sendVerificationCode(req);
  } catch (error) {
    console.error('Error during sending verification code:', error);
    throw error;
  }
};

/** **************************************
 * Google Sign In with Popup
 *************************************** */
export const signInWithGoogle = async (): Promise<void> => {
  try {
    // 从服务端获取 Google OAuth URL
    const { auth_url } = await authApi.getGoogleOAuthUrl();

    return new Promise((resolve, reject) => {
      // 打开弹出窗口
      const popup = window.open(
        auth_url,
        'google-login',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('The pop-up window has been blocked. Please allow the pop-up window and try again.'));
        return;
      }

      // 监听消息事件
      const handleMessage = async (event: MessageEvent) => {
        // 验证消息来源
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          cleanup();
          // 不需要手动关闭弹出窗口，回调页面会自己关闭

          try {
            // 使用授权码换取token
            const params: SignInWithGoogleCodeRequest = { code: event.data.code, state: event.data.state, scope: event.data.scope, authuser: event.data.authuser, prompt: event.data.prompt };
            await signInWithGoogleCode(params);
            resolve();
          } catch (error) {
            reject(error);
          }
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          cleanup();
          // 不需要手动关闭弹出窗口，回调页面会自己关闭
          reject(new Error(event.data.error || 'Google login failed'));
        } else if (event.data.type === 'GOOGLE_AUTH_HEARTBEAT') {
          // 收到心跳消息，表示回调页面已加载，窗口仍然活跃
          // 这里可以重置超时计时器或记录窗口状态
        }
      };

      window.addEventListener('message', handleMessage);

      // 检查弹出窗口是否被关闭
      const checkClosed = setInterval(() => {
        try {
          if (popup.closed) {
            cleanup();
            clearInterval(checkClosed);
            reject(new Error('The user cancelled the login.'));
          }
        } catch (error) {
          // 在某些情况下，访问popup.closed可能会抛出错误
          // 例如当弹出窗口跨域时，这里静默处理
        }
      }, 1000);

      // 添加超时机制，防止窗口检查失败时无限等待
      const timeout = setTimeout(() => {
        cleanup();
        clearInterval(checkClosed);
        // 不尝试关闭弹出窗口，避免跨域错误
        // 如果用户仍在授权流程中，窗口会自然关闭
        reject(new Error('Login timeout. Please try again.'));
      }, 5 * 60 * 1000); // 5分钟超时

      // 清理函数
      const cleanup = () => {
        clearTimeout(timeout);
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
      };
    });
  } catch (error) {
    console.error('Error getting Google OAuth URL:', error);
    throw error;
  }
};

/** **************************************
 * Google Sign In with Code
 *************************************** */
export const signInWithGoogleCode = async (req: SignInWithGoogleCodeRequest): Promise<void> => {
  try {
    const { access_token } = await authApi.signInWithGoogleCode(req);
    setSession(access_token);
  } catch (error) {
    console.error('Error during Google sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
