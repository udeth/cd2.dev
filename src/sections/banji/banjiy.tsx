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

import { getMembers, getSubject, getStudentScore } from 'src/actions/banjiy';
import type { 
  GetClassStudentsData, 
  DataItem,
  GetStudentScoreResponse 
} from 'src/types/api/banjiy';

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
        },
      }}
    >
      <Avatar
        sx={{
          width: 28,
          height: 28,
          mr: 1,
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

  // 科目状态
  const [subjects, setSubjects] = useState<DataItem[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  
  // 弹窗状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GetClassStudentsData | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [studentScore, setStudentScore] = useState<GetStudentScoreResponse | null>(null);
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
  const handleMemberClick = async (member: GetClassStudentsData) => {
    setSelectedMember(member);
    setDialogOpen(true);
    
    // 默认选择第一个科目
    if (subjects.length > 0) {
      const firstSubject = subjects[0];
      setSelectedSubjectId(firstSubject.formId);
      
      try {
        setScoreLoading(true);
        const scoreData = await getStudentScore({
          source_id: firstSubject.formId,
          name: member.studentName,
        });
        setStudentScore(scoreData);
      } catch (err) {
        console.error('获取学生成绩失败:', err);
        setStudentScore(null);
      } finally {
        setScoreLoading(false);
      }
    } else {
      setSelectedSubjectId('');
      setStudentScore(null);
    }
  };

  // 处理科目选择
  const handleSubjectChange = async (subjectId: string) => {
    if (!selectedMember || !subjectId) return;

    setSelectedSubjectId(subjectId);
    setStudentScore(null);

    const selectedSubject = subjects.find(s => s.formId === subjectId);
    if (!selectedSubject) return;

    try {
      setScoreLoading(true);
      const scoreData = await getStudentScore({
        source_id: selectedSubject.formId,
        name: selectedMember.studentName,
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

      {/* 科目选择和成绩展示弹窗 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedMember ? `${selectedMember.studentName} - Subject Score` : 'Subject Score'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            {/* 科目选择区域 */}
            <Box>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="subject-select-label" shrink>Select Subject</InputLabel>
                <Select
                  labelId="subject-select-label"
                  value={selectedSubjectId}
                  label="Select Subject"
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={subjectsLoading}
                  notched
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.formId} value={subject.formId}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {subject.title}
                        </Typography>
                        {subject.summary && (
                          <Typography variant="caption" color="text.secondary">
                            {subject.summary}
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
                  Score Details
                </Typography>

                {scoreLoading ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : studentScore ? (
                  <Stack spacing={2}>
                    {/* 评论信息展示 */}
                    {studentScore.comment && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Comment
                        </Typography>
                        <Typography variant="body1">
                          {studentScore.comment}
                        </Typography>
                      </Box>
                    )}

                    {/* 成绩详情展示 */}
                    {studentScore.columnData && studentScore.columnData.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Score Details
                        </Typography>
                        <Stack spacing={1}>
                          {studentScore.columnData.map((detail, index) => (
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
                                {detail.headName}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" fontWeight="bold">
                                  {detail.fieldValue}
                                </Typography>
                                {detail.showRank && detail.rank && (
                                  <Typography variant="caption" color="text.secondary">
                                    Rank: {detail.rank}
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* 家长签名状态 */}
                    {studentScore.isParentSignature && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Parent Signature
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          ✓ Signed
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No score data
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
