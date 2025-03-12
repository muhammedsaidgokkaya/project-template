import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { _tours } from 'src/_mock/_tour';
import { CONFIG } from 'src/global-config';

import { TourDetailsView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id = '' } = useParams();

  const currentTour = _tours.find((tour) => tour.id === id);

  const metadata = { title: `${currentTour.name} - ${CONFIG.appName}` };
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TourDetailsView tour={currentTour} />
    </>
  );
}
