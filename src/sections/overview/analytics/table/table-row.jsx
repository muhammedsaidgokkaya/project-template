import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function AnalyticsTableRow({
  row,
  selected,
}) {
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell 
          sx={{
            position: 'sticky',
            left: 0,
            backgroundColor: '#1c252e',
            zIndex: 10,
          }}
        >
          {row.dimension}
        </TableCell>
        <TableCell>{row.averageSessionDuration.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.eventsPerSession.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.sessionKeyEventRate.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.screenPageViewsPerSession.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.engagementRate.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.engagedSessions.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.screenPageViewsPerUser.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.eventCountPerUser.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.userKeyEventRate.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.totalUsers)}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.activeUsers)}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.newUsers)}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.screenPageViews)}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.sessions)}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.eventCount)}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.keyEvents)}</TableCell>
        <TableCell>{row.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.transactions)}</TableCell>
      </TableRow>
    </>
  );
}
