import Box from '@mui/material/Box';
import { DashboardContent } from 'src/layouts/dashboard';

import { BanjiOverview } from '../banji-overview';

// ----------------------------------------------------------------------

export function BanjiView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        <BanjiOverview />
      </Box>
    </DashboardContent>
  );
}
