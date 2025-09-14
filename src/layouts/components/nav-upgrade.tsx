import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { getPayRedirectUrl, pollPaymentStatus } from 'src/actions/payment';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: BoxProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleUpgradeClick = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getPayRedirectUrl({
        payway: 'alipay',
        productid: 'pro-plan', // 这里可能需要根据实际产品ID调整
      });

      // 在新窗口中打开支付链接
      const paymentWindow = window.open(result.redirect_url, '_blank', 'noopener,noreferrer');

      toast.info('Payment page opened, waiting for payment confirmation...');

      // 从支付URL中提取交易号，假设交易号在URL中
      // 这里需要根据实际的URL结构来解析交易号
      // 例如：如果URL包含 trade_no 参数，可以这样提取
      const urlParams = new URL(result.redirect_url);
      const tradeNo = urlParams.searchParams.get('trade_no') ||
                     urlParams.searchParams.get('out_trade_no') ||
                     `pay_${Date.now()}`; // 备用方案：使用时间戳生成

      // 开始轮询支付状态
      const paymentSuccess = await pollPaymentStatus(tradeNo);

      if (paymentSuccess) {
        toast.success('Payment successful! Account upgraded to Pro version');
        // 这里可以添加刷新用户信息的逻辑
        // 例如：重新获取用户数据，更新UI状态等
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
        }
      } else {
        toast.warning('No payment success detected, please confirm payment status');
      }

    } catch (error) {
      console.error('Payment request failed:', error);
      toast.error('Get pay redirect url failed, please try again');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box
      sx={[{ px: 2, py: 5, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 48, height: 48 }}>
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>

          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label>
        </Box>

        <Box sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ mb: 1, color: 'var(--layout-nav-text-primary-color)' }}
          >
            {user?.displayName}
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            {user?.email}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleUpgradeClick}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Upgrade to Pro
        </Button>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function UpgradeBlock({ sx, ...other }: BoxProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgradeClick = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getPayRedirectUrl({
        payway: 'alipay',
        productid: 'pro-plan', // 这里可能需要根据实际产品ID调整
      });

      // 在新窗口中打开支付链接
      const paymentWindow = window.open(result.redirect_url, '_blank', 'noopener,noreferrer');

      toast.info('Payment page opened, waiting for payment confirmation...');

      // 从支付URL中提取交易号，假设交易号在URL中
      // 这里需要根据实际的URL结构来解析交易号
      // 例如：如果URL包含 trade_no 参数，可以这样提取
      const urlParams = new URL(result.redirect_url);
      const tradeNo = urlParams.searchParams.get('trade_no') ||
                     urlParams.searchParams.get('out_trade_no') ||
                     `pay_${Date.now()}`; // 备用方案：使用时间戳生成

      // 开始轮询支付状态
      const paymentSuccess = await pollPaymentStatus(tradeNo);

      if (paymentSuccess) {
        toast.success('Payment successful! Account upgraded to Pro version');
        // 这里可以添加刷新用户信息的逻辑
        // 例如：重新获取用户数据，更新UI状态等
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
        }
      } else {
        toast.warning('No payment success detected, please confirm payment status');
      }

    } catch (error) {
      console.error('Payment request failed:', error);
      toast.error('Get pay redirect url failed, please try again');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(135deg, ${varAlpha(theme.vars.palette.error.lightChannel, 0.92)}, ${varAlpha(theme.vars.palette.secondary.darkChannel, 0.92)})`,
              `url(${CONFIG.assetsDir}/assets/background/background-7.webp)`,
            ],
          }),
          px: 3,
          py: 4,
          borderRadius: 2,
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={(theme) => ({
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: 'absolute',
          border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        })}
      />

      <Box
        component={m.img}
        animate={{ y: [12, -12, 12] }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Small Rocket"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-small.webp`}
        sx={{
          right: 0,
          width: 112,
          height: 112,
          position: 'absolute',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box component="span" sx={{ typography: 'h5', color: 'common.white' }}>
          35% OFF
        </Box>

        <Box
          component="span"
          sx={{
            mb: 2,
            mt: 0.5,
            color: 'common.white',
            typography: 'subtitle2',
          }}
        >
          Power up Productivity!
        </Box>

        <Button
          variant="contained"
          size="small"
          color="warning"
          onClick={handleUpgradeClick}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
        >
          Upgrade to Pro
        </Button>
      </Box>
    </Box>
  );
}
