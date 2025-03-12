import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SchemaEditForm } from '../schema-create';

// ----------------------------------------------------------------------

export function KanbanSchemaView() {
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

      <SchemaEditForm />
    </DashboardContent>
  );
}
