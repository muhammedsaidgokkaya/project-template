import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { ReportView } from 'src/sections/overview/report/analytics';

// ----------------------------------------------------------------------

const metadata = { title: `Rapor Görüntüleme - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReportView id={id} />
    </>
  );
}
