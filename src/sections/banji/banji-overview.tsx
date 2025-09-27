import type { CardProps } from '@mui/material/Card';

import { useTabs } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'banjix',
    label: 'BanjiX',
    total: 9990,
  },
  {
    value: 'banjiy',
    label: 'BanjiY',
    total: 1989,
  },
];

export function BanjiOverview({ sx, ...other }: CardProps) {
  const theme = useTheme();

  const tabs = useTabs('banjix');

  const renderTitle = () => (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          mb: 1,
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          typography: 'subtitle2',
        }}
      >
        Banji list
        <Tooltip title="Vestibulum ullamcorper mauris">
          <Iconify width={16} icon="eva:info-outline" sx={{ color: 'text.disabled' }} />
        </Tooltip>
      </Box>
    </Box>
  );

  const renderTabs = () => (
    <Tabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      indicatorColor="custom"
      sx={{
        '--item-padding-x': 0,
        '--indicator-radius': '12px',
        '--indicator-shadow': theme.vars.customShadows.z4,
        my: 3,
        borderRadius: 2,
      }}
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={
            <Box
              sx={{
                p: 3,
                width: 1,
                display: 'flex',
                position: 'relative',
                gap: { xs: 1, md: 2.5 },
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: '50%',
                  alignItems: 'center',
                  color: 'primary.lighter',
                  justifyContent: 'center',
                  bgcolor: 'primary.darker',
                  display: { xs: 'none', md: 'inline-flex' },
                  ...(tab.value === 'banjix' && {
                    color: 'warning.lighter',
                    bgcolor: 'warning.darker',
                  }),
                }}
              >
                <Iconify width={24} icon='eva:diagonal-arrow-right-up-fill'/>
              </Box>

              <div>
                <Box sx={{ typography: 'h4' }}>{tab.label}</Box>
              </div>
            </Box>
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Card sx={[{ p: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {renderTitle()}
      </Box>

      {renderTabs()}

      <>banji</>
    </Card>
  );
}
