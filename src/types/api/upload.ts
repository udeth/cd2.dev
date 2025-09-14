// ----------------------------------------------------------------------

/** **************************************
 * Upload file types
 *************************************** */

// 文件上传请求 - 使用原生FormData，不需要额外的结构体
// 文件通过multipart/form-data直接传递
export type UploadFileRequest = {
  // 实际使用中直接传递File对象和可选参数
};

export type UploadFileResponse = {
  url: string; // 文件访问URL
};
