import { useAuthExpiredStore } from './auth-expired-store';
import { AuthExpiredDialog } from './auth-expired-dialog';

// ----------------------------------------------------------------------

export function AuthExpiredProvider() {
  const { isDialogOpen, closeDialog } = useAuthExpiredStore();

  return (
    <AuthExpiredDialog
      open={isDialogOpen}
      onClose={closeDialog}
    />
  );
}
