import { Helmet } from 'react-helmet-async';
import { MetaCallAppView } from 'src/sections/overview/app/call-back/meta';

// ----------------------------------------------------------------------

const metadata = { title: `Dijitals` };

export default function Connect() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MetaCallAppView />
    </>
  );
}
