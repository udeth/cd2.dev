import { CONFIG } from 'src/global-config';

import { BanjiView } from 'src/sections/banji/view';

// ----------------------------------------------------------------------

const metadata = { title: `Banjix | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <BanjiView />
    </>
  );
}
