import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KanbanNewEditForm } from '../kanban-new-edit-form';

// ----------------------------------------------------------------------

export function KanbanCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Görev Oluştur"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Görevler', href: paths.dashboard.kanban.root },
          { name: 'Görev Oluştur' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <KanbanNewEditForm />
    </DashboardContent>
  );
}
