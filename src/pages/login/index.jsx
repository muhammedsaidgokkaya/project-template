import { Helmet } from 'react-helmet-async';

import { LoginAppView } from 'src/sections/overview/app/login';

// ----------------------------------------------------------------------

const metadata = { title: `Dijitals` };

export default function Login() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LoginAppView />
    </>
  );
}
