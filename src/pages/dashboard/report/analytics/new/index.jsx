import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AnalyticsReportNew } from 'src/sections/overview/report/analytics';

// ----------------------------------------------------------------------

const metadata = { title: `Yeni Rapor - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AnalyticsReportNew />
    </>
  );
}
