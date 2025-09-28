import type { CardProps } from '@mui/material/Card';
import { useState, useEffect, useCallback, useRef } from 'react';

import { useTabs } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import { BanjiX } from './banjix';
import { BanjiY } from './banjiy';

// 导入 BanjiX 相关类型和API
import { getMembers as getBanjiXMembers, getSubject as getBanjiXSubject } from 'src/actions/banjix';
import type {
  GetJoinedMembersNameNewEntity,
  GetParentDataItem
} from 'src/types/api/banjix';

// 导入 BanjiY 相关类型和API
import { getMembers as getBanjiYMembers, getSubject as getBanjiYSubject } from 'src/actions/banjiy';
import type {
  GetClassStudentsData,
  DataItem
} from 'src/types/api/banjiy';
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

  // BanjiX 数据状态
  const [banjiXMembers, setBanjiXMembers] = useState<GetJoinedMembersNameNewEntity[]>([]);
  const [banjiXSubjects, setBanjiXSubjects] = useState<GetParentDataItem[]>([]);
  const [banjiXLoading, setBanjiXLoading] = useState(false);
  const [banjiXError, setBanjiXError] = useState<string | null>(null);

  // BanjiY 数据状态
  const [banjiYMembers, setBanjiYMembers] = useState<GetClassStudentsData[]>([]);
  const [banjiYSubjects, setBanjiYSubjects] = useState<DataItem[]>([]);
  const [banjiYLoading, setBanjiYLoading] = useState(false);
  const [banjiYError, setBanjiYError] = useState<string | null>(null);

  // 用于防止重复请求的 ref
  const banjiXLoadingRef = useRef(false);
  const banjiYLoadingRef = useRef(false);

  // 加载 BanjiX 数据
  const loadBanjiXData = useCallback(async () => {
    // 如果数据已存在或正在请求中，避免重复请求
    if ((banjiXMembers.length > 0 && banjiXSubjects.length > 0) || banjiXLoadingRef.current) return;

    try {
      banjiXLoadingRef.current = true;
      setBanjiXLoading(true);
      setBanjiXError(null);
      
      const [membersData, subjectsData] = await Promise.all([
        getBanjiXMembers({}),
        getBanjiXSubject({})
      ]);
      
      setBanjiXMembers(membersData);
      setBanjiXSubjects(subjectsData);
    } catch (err) {
      console.error('获取 BanjiX 数据失败:', err);
      setBanjiXError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setBanjiXLoading(false);
      banjiXLoadingRef.current = false;
    }
  }, [banjiXMembers.length, banjiXSubjects.length]);

  // 加载 BanjiY 数据
  const loadBanjiYData = useCallback(async () => {
    // 如果数据已存在或正在请求中，避免重复请求
    if ((banjiYMembers.length > 0 && banjiYSubjects.length > 0) || banjiYLoadingRef.current) return;

    try {
      banjiYLoadingRef.current = true;
      setBanjiYLoading(true);
      setBanjiYError(null);
      
      const [membersData, subjectsData] = await Promise.all([
        getBanjiYMembers({}),
        getBanjiYSubject({})
      ]);
      
      setBanjiYMembers(membersData);
      setBanjiYSubjects(subjectsData);
    } catch (err) {
      console.error('获取 BanjiY 数据失败:', err);
      setBanjiYError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setBanjiYLoading(false);
      banjiYLoadingRef.current = false;
    }
  }, [banjiYMembers.length, banjiYSubjects.length]);

  // 当 tab 切换时加载对应数据
  useEffect(() => {
    if (tabs.value === 'banjix') {
      loadBanjiXData();
    } else if (tabs.value === 'banjiy') {
      loadBanjiYData();
    }
  }, [tabs.value, loadBanjiXData, loadBanjiYData]);

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

      {tabs.value === 'banjix' && (
        <BanjiX 
          members={banjiXMembers}
          subjects={banjiXSubjects}
          loading={banjiXLoading}
          error={banjiXError}
        />
      )}
      {tabs.value === 'banjiy' && (
        <BanjiY 
          members={banjiYMembers}
          subjects={banjiYSubjects}
          loading={banjiYLoading}
          error={banjiYError}
        />
      )}
    </Card>
  );
}
