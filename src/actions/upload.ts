import axios, { endpoints } from 'src/lib/axios';
import type { UploadFileResponse } from 'src/types/api/upload';
import type { Response } from '../types/response';

// ----------------------------------------------------------------------

/** **************************************
 * Upload file
 *************************************** */
export const uploadFile = async (
  file: File,
  options?: {
    category?: string;
    description?: string;
  }
): Promise<UploadFileResponse> => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);
    
    // 添加可选参数
    if (options?.category) {
      formData.append('category', options.category);
    }
    if (options?.description) {
      formData.append('description', options.description);
    }

    // 获取token（如果需要认证）
    const token = localStorage.getItem('accessToken');
    
    // 发送请求
    const response = await axios.post<Response<UploadFileResponse>>(
      endpoints.upload.file,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    const data = response.data.data;
    
    if (data && data.url) {
      return data;
    }

    throw new Error('上传失败：服务器未返回文件URL');
  } catch (error) {
    console.error('上传文件失败:', error);
    
    // 处理不同类型的错误
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('上传失败：未授权，请重新登录');
      }
      if (error.message.includes('413')) {
        throw new Error('上传失败：文件过大');
      }
      if (error.message.includes('415')) {
        throw new Error('上传失败：不支持的文件类型');
      }
    }
    
    throw new Error('上传文件失败，请稍后重试');
  }
};
