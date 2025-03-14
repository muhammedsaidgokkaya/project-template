import { useEffect, useState } from 'react';

import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { SchemaEditForm } from '../schema-create';

// ----------------------------------------------------------------------

export function KanbanSchemaView() {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`${CONFIG.apiUrl}/Task/schemas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        const schemaNames = data.map((schema) => schema.name);
        setSchemas(schemaNames);
      } catch (error) {
        console.error('Görev şemaları alınırken hata oluştu:', error);
      }
    };

    fetchSchemas();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Görev Şeması Oluştur"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Görevler', href: paths.dashboard.kanban.root },
          { name: 'Görev Şeması Oluştur' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SchemaEditForm currentSchema={schemas} />
    </DashboardContent>
  );
}
