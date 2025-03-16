import { DashboardContent } from 'src/layouts/dashboard';

import { KanbanDetailsContent } from '../kanban-details-content';

// ----------------------------------------------------------------------

export function KanbanDetailsView({ tour }) {
  return (
    <DashboardContent>
      <KanbanDetailsContent tour={tour} />
    </DashboardContent>
  );
}
