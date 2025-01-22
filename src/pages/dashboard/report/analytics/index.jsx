import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AnalyticsReportView } from 'src/sections/overview/report/analytics';

// ----------------------------------------------------------------------

const metadata = { title: `Rapor - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AnalyticsReportView />
    </>
  );
}
