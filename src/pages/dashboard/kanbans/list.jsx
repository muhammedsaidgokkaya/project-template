import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { KanbanListView } from 'src/sections/kanbans/view';

// ----------------------------------------------------------------------

const metadata = { title: `Görevler - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <KanbanListView />
    </>
  );
}
