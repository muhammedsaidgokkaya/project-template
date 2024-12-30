import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { View500 } from 'src/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `Dahili sunucu hatası! - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <View500 />
    </>
  );
}
