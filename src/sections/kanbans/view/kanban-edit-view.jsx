import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KanbanNewEditForm } from '../kanban-new-edit-form';

// ----------------------------------------------------------------------

export function KanbanEditView({ tour }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Görev Düzenle"
        backHref={paths.dashboard.kanban.root}
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Görevler', href: paths.dashboard.kanban.root },
          { name: tour?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <KanbanNewEditForm currentTour={tour} />
    </DashboardContent>
  );
}
