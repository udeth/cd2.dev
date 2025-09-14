import type { IconButtonProps } from '@mui/material/IconButton';

import React, { useState, useRef } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { _mock } from 'src/_mock';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { uploadFile } from 'src/actions/upload';
import { updateUserProfile } from 'src/actions/auth';

import { UpgradeBlock } from './nav-upgrade';
import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const pathname = usePathname();
  const { user, checkUserSession } = useAuthContext();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 当用户数据更新时，清空本地头像URL状态
  React.useEffect(() => {
    if (user?.photoURL && localAvatarUrl && user.photoURL !== localAvatarUrl) {
      setLocalAvatarUrl(null);
    }
  }, [user?.photoURL, localAvatarUrl]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast.error('Only support JPG, JPEG and PNG format images');
      return;
    }

    // 检查文件大小 (3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size cannot exceed 3MB');
      return;
    }

    setIsUploading(true);
    try {
      // 上传文件
      const uploadResult = await uploadFile(file, {
        category: 'avatar',
        description: 'User avatar'
      });

      // 更新用户头像
      await updateUserProfile({
        nickname: user?.displayName || '',
        avatar: uploadResult.url
      });

      // 立即更新本地头像显示
      setLocalAvatarUrl(uploadResult.url);

      // 刷新用户信息以获取最新的头像URL
      if (checkUserSession) {
        await checkUserSession();
      }

      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Upload avatar failed:', error);
      toast.error(error instanceof Error ? error.message : 'Upload avatar failed');
    } finally {
      setIsUploading(false);
      // 清空文件输入值，以便下次可以选择同一个文件
      event.target.value = '';
    }
  };

  const renderAvatar = () => (
    <Box
      sx={{ position: 'relative', mb: 2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimateBorder
        sx={{ p: '6px', width: 126, height: 126, borderRadius: '50%' }}
        slotProps={{
          primaryBorder: { size: 120, sx: { color: 'primary.main' } },
        }}
      >
        <Avatar
          src={localAvatarUrl || user?.photoURL}
          alt={user?.displayName}
          sx={{ width: 1, height: 1 }}
        >
          {user?.displayName?.charAt(0).toUpperCase()}
        </Avatar>
      </AnimateBorder>

      {/* 悬停遮罩层 */}
      {(isHovering || isUploading) && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: '6px',
            left: '6px',
            right: '6px',
            bottom: '6px',
            borderRadius: '50%',
            backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: isUploading ? 'default' : 'pointer',
            zIndex: 9,
            gap: 1,
            color: 'common.white',
            transition: theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.shorter,
            }),
          })}
          onClick={() => {
            if (!isUploading) {
              fileInputRef.current?.click();
            }
          }}
        >
          {isUploading ? (
            <>
              <CircularProgress size={32} sx={{ color: 'common.white' }} />
            </>
          ) : (
            <>
              <Iconify icon="solar:camera-add-bold" width={32} />
              <Typography variant="caption">Update photo</Typography>
            </>
          )}
        </Box>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </Box>
  );

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          '& li': { p: 0 },
        }),
      ]}
    >
      {data.map((option) => {
        const rootLabel = pathname.includes('/dashboard') ? 'Home' : 'Dashboard';
        const rootHref = pathname.includes('/dashboard') ? '/' : paths.dashboard.root;

        return (
          <MenuItem key={option.label}>
            <Link
              component={RouterLink}
              href={option.label === 'Home' ? rootHref : option.href}
              color="inherit"
              underline="none"
              onClick={onClose}
              sx={{
                p: 1,
                width: 1,
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
                color: 'text.secondary',
                '& svg': { width: 24, height: 24 },
                '&:hover': { color: 'text.primary' },
              }}
            >
              {option.icon}

              <Box component="span" sx={{ ml: 2 }}>
                {option.label === 'Home' ? rootLabel : option.label}
              </Box>

              {option.info && (
                <Label color="error" sx={{ ml: 1 }}>
                  {option.info}
                </Label>
              )}
            </Link>
          </MenuItem>
        );
      })}
    </MenuList>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.displayName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 3,
              gap: 1,
              flexWrap: 'wrap',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: 3 }, (_, index) => (
              <Tooltip
                key={_mock.fullName(index + 1)}
                title={`Switch to: ${_mock.fullName(index + 1)}`}
              >
                <Avatar
                  alt={_mock.fullName(index + 1)}
                  src={_mock.image.avatar(index + 1)}
                  onClick={() => {}}
                />
              </Tooltip>
            ))}

            <Tooltip title="Add account">
              <IconButton
                sx={[
                  (theme) => ({
                    bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                    border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
                  }),
                ]}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            </Tooltip>
          </Box>

          {renderList()}

          <Box sx={{ px: 2.5, py: 3 }}>
            <UpgradeBlock />
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
