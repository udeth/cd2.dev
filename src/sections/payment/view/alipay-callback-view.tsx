import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AlipayCallbackView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // 立即处理回调参数，不需要延迟
    const outTradeNo = searchParams.get('out_trade_no');
    const tradeNo = searchParams.get('trade_no');
    const totalAmount = searchParams.get('total_amount');
    const tradeStatus = searchParams.get('trade_status');
    const appId = searchParams.get('app_id');
    
    // 检查是否有错误参数
    const error = searchParams.get('error');
    const errorMsg = searchParams.get('error_msg');

    if (error) {
      setStatus('error');
      setMessage(errorMsg || 'payment failed, please try again');
      setIsProcessing(false);
      return;
    }

    // 检查支付状态
    if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
      setStatus('success');
      setMessage('payment successful!');
    } else if (outTradeNo && tradeNo) {
      // 有交易号但状态不明确，视为成功
      setStatus('success');
      setMessage('payment successful!');
    } else {
      setStatus('error');
      setMessage('payment failed, please try again');
    }
    
    // 处理完成，隐藏外层loading
    setIsProcessing(false);
  }, [searchParams]);

  const handleReturnHome = () => {
    navigate('/dashboard');
  };

  const handleRetryPayment = () => {
    navigate('/payment');
  };

  const renderContent = () => {
    if (isProcessing) {
      // 处理期间返回null，让外层的 SplashScreen 显示loading
      return null;
    }

    if (status === 'success') {
      return (
        <Fade in timeout={800}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              py: 6,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: (theme) => `0 8px 32px ${theme.vars.palette.success.main}40`,
              }}
            >
              <Iconify icon="solar:check-circle-bold" width={64} sx={{ color: 'common.white' }} />
            </Box>

            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              Payment successful
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Congratulations, payment has been completed!
            </Typography>
          </Box>
        </Fade>
      );
    }

    // error status
    return (
      <Fade in timeout={800}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            py: 6,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: (theme) => `0 8px 32px ${theme.vars.palette.error.main}40`,
            }}
          >
            <Iconify icon="solar:close-circle-bold" width={64} sx={{ color: 'common.white' }} />
          </Box>

          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Payment failed
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            {message || 'An error occurred during payment, please try again or contact customer service.'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleReturnHome}
              startIcon={<Iconify icon="solar:home-2-outline" />}
              sx={{ minWidth: 140 }}
            >
              Return to home
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleRetryPayment}
              startIcon={<Iconify icon="solar:restart-bold" />}
              sx={{ minWidth: 140 }}
            >
              Retry payment
            </Button>
          </Box>
        </Box>
      </Fade>
    );
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        width: '100%',
      }}
    >
      {renderContent()}
    </Box>
  );
}
