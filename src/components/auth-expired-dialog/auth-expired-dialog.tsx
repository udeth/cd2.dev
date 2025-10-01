import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type AuthExpiredDialogProps = {
  open: boolean;
  onClose: () => void;
};

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
  auth0: paths.auth.auth0.signIn,
  amplify: paths.auth.amplify.signIn,
  firebase: paths.auth.firebase.signIn,
  supabase: paths.auth.supabase.signIn,
};

export function AuthExpiredDialog({ open, onClose }: AuthExpiredDialogProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleReLogin = useCallback(() => {
    setIsRedirecting(true);
    
    const { method } = CONFIG.auth;
    const signInPath = signInPaths[method];
    const currentPath = window.location.pathname;
    const queryString = new URLSearchParams({ returnTo: currentPath }).toString();
    const redirectPath = `${signInPath}?${queryString}`;
    
    // 延迟一下再跳转，避免用户感觉太突兀
    setTimeout(() => {
      window.location.href = redirectPath;
    }, 500);
  }, []);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog 
      fullWidth 
      maxWidth="xs" 
      open={open} 
      onClose={handleCancel}
      disableEscapeKeyDown // 防止用户按ESC关闭
    >
      <DialogTitle sx={{ pb: 2 }}>Login Expired</DialogTitle>

      <DialogContent sx={{ typography: 'body2' }}>
        Your login status has expired, you need to re-login to continue using. Do you want to re-login now?
      </DialogContent>

      <DialogActions>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleReLogin}
          disabled={isRedirecting}
        >
          {isRedirecting ? 'Redirecting...' : 'Re-login'}
        </Button>

        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={handleCancel}
          disabled={isRedirecting}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
