import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';
import { KanbanDetailsView } from 'src/sections/kanbans/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id = '' } = useParams();
  const [currentTour, setCurrentTour] = useState(null);
  
  useEffect(() => {
    const fetchTours = async () => {
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch(`${CONFIG.apiUrl}/Task/task?taskId=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentTour(data);
        } else {
          console.error("Failed to fetch tours:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, [id]);

  if (!currentTour) {
    return <div></div>;
  }

  const metadata = { title: `${currentTour.name} - ${CONFIG.appName}` };
  
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <KanbanDetailsView tour={currentTour} />
    </>
  );
}
