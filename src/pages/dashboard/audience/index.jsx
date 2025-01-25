import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { OverviewAudienceView } from 'src/sections/overview/audience/view';

// ----------------------------------------------------------------------

const metadata = { title: `Hedef Kitle - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewAudienceView />
    </>
  );
}
