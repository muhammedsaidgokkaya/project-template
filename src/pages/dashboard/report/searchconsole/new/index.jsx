import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SearchConsoleReportNew } from 'src/sections/overview/report/searchconsole';

// ----------------------------------------------------------------------

const metadata = { title: `Yeni Rapor - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SearchConsoleReportNew />
    </>
  );
}
