import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CalendarView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

const metadata = { title: `Takvim - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CalendarView />
    </>
  );
}
