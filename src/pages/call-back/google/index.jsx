import { Helmet } from 'react-helmet-async';
import { GoogleCallAppView } from 'src/sections/overview/app/call-back/google';

// ----------------------------------------------------------------------

const metadata = { title: `Dijitals` };

export default function Connect() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GoogleCallAppView />
    </>
  );
}
