import { Helmet } from 'react-helmet-async';
import { AccountAppView } from 'src/sections/overview/app/account-setting';

// ----------------------------------------------------------------------

const metadata = { title: `Dijitals` };

export default function Connect() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountAppView />
    </>
  );
}
