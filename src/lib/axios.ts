import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

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
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    console.error('Axios error:', message);
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
  }
} as const;
