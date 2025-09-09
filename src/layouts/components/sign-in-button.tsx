import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';
import { CONFIG } from 'src/global-config';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: ButtonProps) {
  const { authenticated } = useAuthContext();

  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      variant="outlined"
      sx={sx}
      {...other}
    >
      {authenticated ? 'Dashboard' : 'Sign in'}
    </Button>
  );
}
