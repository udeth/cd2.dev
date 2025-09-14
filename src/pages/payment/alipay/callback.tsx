import { CONFIG } from 'src/global-config';

import { AlipayCallbackView } from 'src/sections/payment/view';

// ----------------------------------------------------------------------

const metadata = { title: `Payment - ${CONFIG.appName}` };

export default function AlipayCallbackPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <AlipayCallbackView />
    </>
  );
}
