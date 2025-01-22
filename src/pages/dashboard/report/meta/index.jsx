import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { MetaReportView } from 'src/sections/overview/report/meta';

// ----------------------------------------------------------------------

const metadata = { title: `Rapor - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MetaReportView />
    </>
  );
}
