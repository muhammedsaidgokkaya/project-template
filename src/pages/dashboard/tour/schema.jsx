import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { KanbanSchemaView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

const metadata = { title: `Görev Şeması Oluştur - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <KanbanSchemaView />
    </>
  );
}
