import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function GoogleOAuthCallbackPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 发送心跳信息给父窗口，表示窗口已加载
    const sendHeartbeat = () => {
      window.opener?.postMessage(
        {
          type: 'GOOGLE_AUTH_HEARTBEAT',
        },
        window.location.origin
      );
    };

    // 立即发送一次心跳
    sendHeartbeat();

    const handleCallback = () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');
      const scope = searchParams.get('scope');
      const authuser = searchParams.get('authuser');
      const prompt = searchParams.get('prompt');

      if (error) {
        // 发送错误消息给父窗口
        window.opener?.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error: error || 'Google登录失败',
          },
          window.location.origin
        );
        window.close();
        return;
      }

      if (code && state) {
        // 发送成功消息给父窗口
        window.opener?.postMessage(
          {
            type: 'GOOGLE_AUTH_SUCCESS',
            code,
            state,
            scope,
            authuser,
            prompt,
          },
          window.location.origin
        );
        window.close();
        return;
      }

      // 没有找到有效的参数
      window.opener?.postMessage(
        {
          type: 'GOOGLE_AUTH_ERROR',
          error: '回调参数无效',
        },
        window.location.origin
      );
      window.close();
    };

    // 延迟执行以确保页面完全加载
    const timer = setTimeout(handleCallback, 100);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return <SplashScreen />;
}
