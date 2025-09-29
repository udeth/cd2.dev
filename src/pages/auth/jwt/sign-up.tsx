import { CONFIG } from 'src/global-config';

import { JwtSignUpView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Sign up | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <JwtSignUpView />
    </>
  );
}
