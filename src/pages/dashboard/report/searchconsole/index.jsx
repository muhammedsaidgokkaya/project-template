import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SearchConsoleReportView } from 'src/sections/overview/report/searchconsole';

// ----------------------------------------------------------------------

const metadata = { title: `Rapor - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SearchConsoleReportView />
    </>
  );
}
