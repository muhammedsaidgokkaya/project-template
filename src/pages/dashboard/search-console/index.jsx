import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { OverviewSearchConsoleView } from 'src/sections/overview/search-console/view';

// ----------------------------------------------------------------------

const metadata = { title: `Search Console - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewSearchConsoleView />
    </>
  );
}
