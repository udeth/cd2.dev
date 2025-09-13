import type { DialogProps } from '@mui/material/Dialog';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import { createWorkspace } from 'src/actions/workspace';
import type { CreateWorkspaceRequest } from 'src/types/api/workspace';

// ----------------------------------------------------------------------

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name cannot be empty').max(50, 'Workspace name cannot exceed 50 characters'),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
  is_default: z.boolean().optional(),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

export type WorkspaceCreateDialogProps = DialogProps & {
  onSuccess?: () => void;
};

// ----------------------------------------------------------------------

export function WorkspaceCreateDialog({ 
  open, 
  onClose, 
  onSuccess,
  ...other 
}: WorkspaceCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
      is_default: false,
    },
  });

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose?.({}, 'backdropClick');
    }
  };

  const onSubmit = async (data: CreateWorkspaceFormData) => {
    try {
      setIsSubmitting(true);

      const requestData: CreateWorkspaceRequest = {
        name: data.name,
        description: data.description || '',
        is_default: data.is_default,
      };

      await createWorkspace(requestData);
      
      // 成功后重置表单并关闭对话框
      reset();
      onSuccess?.();
      onClose?.({}, 'backdropClick');
      
    } catch (error) {
      console.error('创建工作区失败:', error);
      // 这里可以添加错误提示
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      {...other}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="mingcute:add-line" width={24} />
          <Typography variant="h6" component="span">
            Create new workspace
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Workspace name"
                placeholder="Enter workspace name"
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Enter description for the workspace (optional)"
                error={!!errors.description}
                helperText={errors.description?.message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />

          <Controller
            name="is_default"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={value || false}
                    onChange={(event) => onChange(event.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
                      Set as default workspace
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Set this workspace as your default workspace
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', mx: 0 }}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          color="inherit"
        >
          Cancel
        </Button>
        <LoadingButton
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Create workspace
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
