import { Helmet } from 'react-helmet-async';
import { ConnectAppView } from 'src/sections/overview/app/connect';

// ----------------------------------------------------------------------

const metadata = { title: `Dijitals` };

export default function Connect() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ConnectAppView />
    </>
  );
}
