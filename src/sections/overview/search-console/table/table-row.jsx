import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function SearchConsoleTableRow({
  row,
  selected,
}) {
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{row.keys}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.clicks)}</TableCell>
        <TableCell>{new Intl.NumberFormat('tr-TR').format(row.impressions)}</TableCell>
        <TableCell>{row.ctr.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
        <TableCell>{row.position.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
      </TableRow>
    </>
  );
}
