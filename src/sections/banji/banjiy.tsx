import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { getMembers } from 'src/actions/banjiy';
import type { GetClassStudentsData } from 'src/types/api/banjiy';

// ----------------------------------------------------------------------

interface MemberCardProps {
  member: GetClassStudentsData;
  onClick: (member: GetClassStudentsData) => void;
}

function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <Card
      onClick={() => onClick(member)}
      sx={{
        p: 1,
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: (theme) => theme.vars.customShadows.z8,
          transform: 'translateY(-2px)',
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
        {member.studentName.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {member.studentName}
        </Typography>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function BanjiY() {
  const [members, setMembers] = useState<GetClassStudentsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const membersData = await getMembers({});
        setMembers(membersData);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError(err instanceof Error ? err.message : '获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理成员点击事件
  const handleMemberClick = (member: GetClassStudentsData) => {
    console.log('点击成员:', member);
    // TODO: 后续实现成员详情弹窗
  };

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
            Loading members list...
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
          List of Members
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total {members.length} students
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {members.map((member, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={`${member.studentNo}-${index}`}>
            <MemberCard member={member} onClick={handleMemberClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
