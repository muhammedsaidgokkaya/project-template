import { Helmet } from 'react-helmet-async';

import { RegisterAppView } from 'src/sections/overview/app/register';

// ----------------------------------------------------------------------

const metadata = { title: `Dijitals` };

export default function Register() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RegisterAppView />
    </>
  );
}
