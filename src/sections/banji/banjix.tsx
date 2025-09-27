import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { getMembers } from 'src/actions/banjix';
import type { GetJoinedMembersNameNewEntity } from 'src/types/api/banjix';

// ----------------------------------------------------------------------

interface MemberCardProps {
  member: GetJoinedMembersNameNewEntity;
}

function MemberCard({ member }: MemberCardProps) {
  return (
    <Card
      sx={{
        p: 1,
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: (theme) => theme.vars.customShadows.z8,
        },
      }}
    >
      <Avatar
        sx={{
          width: 28,
          height: 28,
          mr: 1,
          bgcolor: 'primary.main',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}
      >
        {member.name.charAt(0).toUpperCase()}
      </Avatar>

      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {member.name}
      </Typography>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function BanjiX() {
  const [members, setMembers] = useState<GetJoinedMembersNameNewEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMembers({});
        setMembers(data);
      } catch (err) {
        console.error('获取成员列表失败:', err);
        setError(err instanceof Error ? err.message : '获取成员列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            正在加载成员列表...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300,
        }}
      >
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (members.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          暂无成员数据
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          成员列表
        </Typography>
        <Typography variant="body2" color="text.secondary">
          共 {members.length} 位成员
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {members.map((member, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={`${member.snum}-${index}`}>
            <MemberCard member={member} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
