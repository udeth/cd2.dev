import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';
import { ThrLayout } from 'src/layouts/thr';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));
const Page404 = lazy(() => import('src/pages/error/404'));
const DevelopPage = lazy(() => import('src/pages/develop'));
const GoogleOAuthCallbackPage = lazy(() => import('src/pages/oauth/google/callback'));
const AlipayCallbackPage = lazy(() => import('src/pages/payment/alipay/callback'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    /**
     * @skip homepage
     * import { Navigate } from "react-router";
     * import { CONFIG } from 'src/global-config';
     *
     * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
     * and remove the element below:
     */
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: '/develop',
    /**
     * @skip homepage
     * import { Navigate } from "react-router";
     * import { CONFIG } from 'src/global-config';
     *
     * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
     * and remove the element below:
     */
    element: (
      <DevelopPage />
    ),
  },
  // OAuth callbacks
  {
    path: '/oauth/google/callback',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <GoogleOAuthCallbackPage />
      </Suspense>
    ),
  },
  // Payment callbacks
  {
    path: '/thr/pay/alipay/callback',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <ThrLayout>
          <AlipayCallbackPage />
        </ThrLayout>
      </Suspense>
    ),
  },
  // Auth
  ...authRoutes,
  ...authDemoRoutes,

  // Dashboard
  ...dashboardRoutes,

  // Main
  ...mainRoutes,

  // Components
  ...componentsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
