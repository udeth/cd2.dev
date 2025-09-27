import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { getMembers, getSubject, getStudentScoreBySubjectId } from 'src/actions/banjix';
import type {
  GetJoinedMembersNameNewEntity,
  GetParentDataItem,
  GetStudentScoreBySubjectIdResponse
} from 'src/types/api/banjix';

// ----------------------------------------------------------------------

interface MemberCardProps {
  member: GetJoinedMembersNameNewEntity;
  onClick: (member: GetJoinedMembersNameNewEntity) => void;
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

  // 科目状态
  const [subjects, setSubjects] = useState<GetParentDataItem[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  
  // 弹窗状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GetJoinedMembersNameNewEntity | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [studentScore, setStudentScore] = useState<GetStudentScoreBySubjectIdResponse | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSubjectsLoading(true);
        setError(null);
        
        // 并行加载成员列表和科目列表
        const [membersData, subjectsData] = await Promise.all([
          getMembers({}),
          getSubject({})
        ]);
        
        setMembers(membersData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError(err instanceof Error ? err.message : '获取数据失败');
      } finally {
        setLoading(false);
        setSubjectsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理成员点击事件
  const handleMemberClick = (member: GetJoinedMembersNameNewEntity) => {
    setSelectedMember(member);
    setDialogOpen(true);
    setSelectedSubjectId('');
    setStudentScore(null);
  };

  // 处理科目选择
  const handleSubjectChange = async (subjectId: string) => {
    if (!selectedMember || !subjectId) return;

    setSelectedSubjectId(subjectId);
    setStudentScore(null);

    const selectedSubject = subjects.find(s => s._id === subjectId);
    if (!selectedSubject) return;

    try {
      setScoreLoading(true);
      const scoreData = await getStudentScoreBySubjectId({
        source_id: selectedSubject.score,
        name: selectedMember.name,
      });
      setStudentScore(scoreData);
    } catch (err) {
      console.error('获取学生成绩失败:', err);
    } finally {
      setScoreLoading(false);
    }
  };

  // 关闭弹窗
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMember(null);
    setSelectedSubjectId('');
    setStudentScore(null);
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
          Total {members.length} members
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {members.map((member, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={`${member.snum}-${index}`}>
            <MemberCard member={member} onClick={handleMemberClick} />
          </Grid>
        ))}
      </Grid>

      {/* 科目选择和成绩展示弹窗 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedMember ? `${selectedMember.name} - 科目成绩` : '科目成绩'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            {/* 科目选择区域 */}
            <Box>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="subject-select-label" shrink>选择科目</InputLabel>
                <Select
                  labelId="subject-select-label"
                  value={selectedSubjectId}
                  label="选择科目"
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={subjectsLoading}
                  notched
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {subject.title}
                        </Typography>
                        {subject.text_content && (
                          <Typography variant="caption" color="text.secondary">
                            {subject.text_content}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* 成绩展示区域 */}
            {selectedSubjectId && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  成绩详情
                </Typography>

                {scoreLoading ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : studentScore ? (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        学生姓名
                      </Typography>
                      <Typography variant="body1">
                        {studentScore.name}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        状态
                      </Typography>
                      <Typography variant="body1">
                        {studentScore.status}
                      </Typography>
                    </Box>

                    {studentScore.studentScore.comment && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          评语
                        </Typography>
                        <Typography variant="body1">
                          {studentScore.studentScore.comment}
                        </Typography>
                      </Box>
                    )}

                    {studentScore.studentScore.score_detail && studentScore.studentScore.score_detail.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          分数详情
                        </Typography>
                        <Stack spacing={1}>
                          {studentScore.studentScore.score_detail.map((detail, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 1,
                                bgcolor: 'background.neutral',
                                borderRadius: 1
                              }}
                            >
                              <Typography variant="body2">
                                {detail.subject}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {detail.score}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    暂无成绩数据
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
