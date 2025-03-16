import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';

import { KanbanEditView } from 'src/sections/kanbans/view';

// ----------------------------------------------------------------------

const metadata = { title: `Görev Düzenle - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const [currentTour, setCurrentTour] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`${CONFIG.apiUrl}/Task/get-update-task?taskId=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setCurrentTour(data);
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <KanbanEditView tour={currentTour} />
    </>
  );
}

