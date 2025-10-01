import { create } from 'zustand';

// ----------------------------------------------------------------------

interface AuthExpiredState {
  isDialogOpen: boolean;
  isHandling: boolean; // 防止重复处理
  openDialog: () => void;
  closeDialog: () => void;
  setHandling: (handling: boolean) => void;
}

export const useAuthExpiredStore = create<AuthExpiredState>((set, get) => ({
  isDialogOpen: false,
  isHandling: false,
  
  openDialog: () => {
    const { isHandling } = get();
    
    // 如果正在处理中，不重复打开对话框
    if (isHandling) {
      return;
    }
    
    // 检查当前路径是否为登录相关页面
    const currentPath = window.location.pathname;
    const authPaths = [
      '/auth/',
      '/oauth/',
      '/login',
      '/sign-in',
      '/sign-up',
      '/register',
      '/reset-password',
      '/forgot-password',
      '/verify'
    ];
    
    // 如果当前在登录相关页面，不显示对话框
    const isInAuthPage = authPaths.some(path => currentPath.includes(path));
    if (isInAuthPage) {
      return;
    }
    
    set({ isDialogOpen: true, isHandling: true });
  },
  
  closeDialog: () => {
    set({ isDialogOpen: false, isHandling: false });
  },
  
  setHandling: (handling: boolean) => {
    set({ isHandling: handling });
  },
}));
