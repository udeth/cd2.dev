import type { Theme, SxProps } from '@mui/material/styles';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback, useEffect } from 'react';
import { usePopover, useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button, { buttonClasses } from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { WorkspaceCreateDialog } from 'src/components/workspace-create-dialog';

import { deleteWorkspace } from 'src/actions/workspace';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
    plan: string;
    is_default?: boolean;
  }[];
  loading?: boolean;
  onWorkspaceCreated?: () => void;
  onWorkspaceDeleted?: () => void;
};

export function WorkspacesPopover({ data = [], loading = false, onWorkspaceCreated, onWorkspaceDeleted, sx, ...other }: WorkspacesPopoverProps) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();
  const confirmDialog = useBoolean();

  const [workspace, setWorkspace] = useState(data[0]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<(typeof data)[0] | null>(null);

  // 监听 data 变化，当数据更新时同步更新当前选中的工作区
  useEffect(() => {
    if (data && data.length > 0) {
      // 如果当前没有选中的工作区，或者当前选中的工作区不在新数据中，则重新选择
      if (!workspace || !data.find(item => item.id === workspace.id)) {
        // 优先选择标记为默认的工作区，如果没有则选择第一个
        const defaultWorkspace = data.find(item => item.is_default === true) || data[0];
        setWorkspace(defaultWorkspace);
      }
    }
  }, [data, workspace]);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[0]) => {
      setWorkspace(newValue);
      onClose();
    },
    [onClose]
  );

  const handleCreateWorkspace = useCallback(() => {
    setCreateDialogOpen(true);
    onClose();
  }, [onClose]);

  const handleWorkspaceCreated = useCallback(() => {
    setCreateDialogOpen(false);
    onWorkspaceCreated?.();
  }, [onWorkspaceCreated]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleDeleteWorkspace = useCallback((workspaceToDelete: (typeof data)[0]) => {
    setWorkspaceToDelete(workspaceToDelete);
    confirmDialog.onTrue();
    onClose();
  }, [confirmDialog, onClose]);

  const handleConfirmDelete = useCallback(async () => {
    if (!workspaceToDelete) return;

    try {
      await deleteWorkspace({ id: Number(workspaceToDelete.id) });

      // 如果删除的是当前选中的工作区，需要切换到其他工作区
      if (workspace?.id === workspaceToDelete.id) {
        const remainingWorkspaces = data.filter(w => w.id !== workspaceToDelete.id);
        if (remainingWorkspaces.length > 0) {
          // 优先选择标记为默认的工作区，如果没有则选择第一个
          const newWorkspace = remainingWorkspaces.find(w => w.is_default) || remainingWorkspaces[0];
          setWorkspace(newWorkspace);
        } else {
          setWorkspace(data[0]); // 如果没有剩余工作区，保持第一个作为默认值
        }
      }

      confirmDialog.onFalse();
      setWorkspaceToDelete(null);
      onWorkspaceDeleted?.();
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      // 这里可以添加错误提示
    }
  }, [workspaceToDelete, workspace, data, confirmDialog, onWorkspaceDeleted]);

  const buttonBg: SxProps<Theme> = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderButton = () => {
    // 如果正在加载且没有数据，显示loading状态
    if (loading && data.length === 0) {
      return (
        <ButtonBase
          disabled
          sx={[
            {
              py: 0.5,
              gap: { xs: 0.5, [mediaQuery]: 1 },
              cursor: 'default',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...other}
        >
          {/* Loading 头像占位符 */}
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{ bgcolor: 'action.hover' }}
          />

          {/* Loading 文字占位符 */}
          <Skeleton
            variant="text"
            width={80}
            height={20}
            sx={{
              display: { xs: 'none', [mediaQuery]: 'block' },
              bgcolor: 'action.hover'
            }}
          />

          {/* Loading 标签占位符 */}
          <Skeleton
            variant="rectangular"
            width={40}
            height={22}
            sx={{
              borderRadius: 0.75,
              display: { xs: 'none', [mediaQuery]: 'block' },
              bgcolor: 'action.hover'
            }}
          />

          {/* 下拉箭头 */}
          <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
        </ButtonBase>
      );
    }

    // 正常显示工作区数据
    return (
      <ButtonBase
        disableRipple
        onClick={onOpen}
        sx={[
          {
            py: 0.5,
            gap: { xs: 0.5, [mediaQuery]: 1 },
            '&::before': buttonBg,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Box
          component="img"
          alt={workspace?.name}
          src={workspace?.logo}
          sx={{ width: 24, height: 24, borderRadius: '50%' }}
        />

        <Box
          component="span"
          sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
        >
          {workspace?.name}
        </Box>

        <Label
          color={workspace?.plan === 'Free' ? 'default' : 'info'}
          sx={{
            height: 22,
            cursor: 'inherit',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {workspace?.plan}
        </Label>

        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </ButtonBase>
    );
  };

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55, width: 240 } },
      }}
    >
      <Scrollbar sx={{ maxHeight: 240 }}>
        <MenuList>
          {loading && data.length === 0 ? (
            // Loading状态显示占位符
            <>
              {[1, 2, 3].map((index) => (
                <MenuItem key={`loading-${index}`} sx={{ height: 48 }}>
                  <Skeleton
                    variant="circular"
                    width={24}
                    height={24}
                    sx={{ bgcolor: 'action.hover' }}
                  />
                  <Box sx={{ flexGrow: 1, ml: 1 }}>
                    <Skeleton
                      variant="text"
                      width={120}
                      height={16}
                      sx={{ bgcolor: 'action.hover' }}
                    />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    width={40}
                    height={20}
                    sx={{ borderRadius: 0.75, bgcolor: 'action.hover' }}
                  />
                </MenuItem>
              ))}
            </>
          ) : (
            // 正常显示工作区列表
            data.map((option) => (
              <MenuItem
                key={option.id}
                selected={option.id === workspace?.id}
                onClick={() => handleChangeWorkspace(option)}
                sx={{ height: 48, pr: 1 }}
              >
                <Avatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} />

                <Typography
                  noWrap
                  component="span"
                  variant="body2"
                  sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}
                >
                  {option.name}
                </Typography>

                <Label color={option.plan === 'Free' ? 'default' : 'info'} sx={{ mr: 1 }}>
                  {option.plan}
                </Label>

                {/* 只有当工作区数量大于1时才显示删除按钮 */}
                {data.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteWorkspace(option);
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      '&:hover': {
                        color: 'error.main',
                      },
                    }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                )}
              </MenuItem>
            ))
          )}
        </MenuList>
      </Scrollbar>

      <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

      <Button
        fullWidth
        disabled={loading && data.length === 0}
        startIcon={<Iconify width={18} icon="mingcute:add-line" />}
        onClick={handleCreateWorkspace}
        sx={{
          gap: 2,
          justifyContent: 'flex-start',
          fontWeight: 'fontWeightMedium',
          [`& .${buttonClasses.startIcon}`]: {
            m: 0,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        Create workspace
      </Button>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={() => {
        confirmDialog.onFalse();
        setWorkspaceToDelete(null);
      }}
      title="Delete workspace"
      content={
        workspaceToDelete ? (
          <>
            Are you sure want to delete workspace <strong>&#34;{workspaceToDelete.name}&#34;</strong> ? This action cannot be undone.
          </>
        ) : (
          'Are you sure want to delete this workspace?'
        )
      }
      action={
        <Button variant="contained" color="error" onClick={handleConfirmDelete}>
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
      <WorkspaceCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleWorkspaceCreated}
      />
      {renderConfirmDialog()}
    </>
  );
}
