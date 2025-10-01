import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { useAuthExpiredStore } from 'src/components/auth-expired-dialog';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Optional: Add token (if using auth)
 *
 axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*
*/

axiosInstance.interceptors.response.use(
  (response) => {
    // 检查响应数据中的错误码
    const { data } = response;
    if (data && typeof data === 'object' && 'code' in data) {
      const { code, msg, message } = data as { code: number; msg?: string; message?: string };

      // 如果错误码为41，表示登录状态失效
      if (code === 41) {
        const { openDialog } = useAuthExpiredStore.getState();
        openDialog();
        return Promise.reject(new Error('Login expired'));
      }

      // 如果错误码不为0，显示错误提示
      if (code !== 0) {
        const errorMessage = msg || message || 'Request failed';
        toast.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }
    }

    return response;
  },
  (error) => {
    const errorData = error?.response?.data;

    // 检查错误响应中的 code 41
    if (errorData && typeof errorData === 'object' && 'code' in errorData) {
      const { code } = errorData as { code: number };
      if (code === 41) {
        const { openDialog } = useAuthExpiredStore.getState();
        openDialog();
        return Promise.reject(new Error('Login expired'));
      }
    }

    const message = errorData?.msg || errorData?.message || error?.message || 'Something went wrong!';
    console.error('Axios error:', message);

    // 显示错误提示
    toast.error(message);

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.post<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/mocker/chat-',
  kanban: '/mocker/kanban.json',
  calendar: '/mocker/calendar.json',
  auth: {
    sendVerificationCode: '/verify/send-code',
    signIn: '/auth/login',
    signUp: '/auth/register',
    me: '/user/profile',
    updateProfile: '/user/update-profile',
    googleOAuth: '/oauth/google',
    googleSignIn: '/oauth/google/callback',
  },
  mail: {
    list: '/mocker/mail-list.json',
    details: '/mocker/mail-details.json',
    labels: '/mocker/mail-labels.json',
  },
  post: {
    list: '/mocker/post-list.json',
    details: '/mocker/post-details.json',
    latest: '/mocker/post-latest.json',
    search: '/mocker/post-search.json',
  },
  product: {
    list: '/mocker/product-list.json',
    details: '/mocker/product-details.json',
    search: '/mocker/product-search.json',
  },
  workspace: {
    list: '/workspace/list',
    create: '/workspace/create',
    delete: '/workspace/delete',
  },
  payment: {
    alipay: '/thr/pay/alipay',
    callback: '/thr/pay/alipay/callback',
  },
  upload: {
    file: '/upload/file',
  },
  banjix: {
    members: '/banjix/members',
    subject: '/banjix/subject',
    studentScore: '/banjix/student-score',
  },
  banjiy: {
    members: '/banjiy/members',
    subject: '/banjiy/subject',
    studentScore: '/banjiy/student-score',
  }
} as const;
