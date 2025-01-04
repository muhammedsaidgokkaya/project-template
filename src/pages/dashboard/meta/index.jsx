import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { MetaView } from 'src/sections/overview/meta/view';

// ----------------------------------------------------------------------

const metadata = { title: `Meta - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MetaView />
    </>
  );
}
