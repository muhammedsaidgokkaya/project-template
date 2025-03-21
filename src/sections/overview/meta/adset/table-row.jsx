import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function MetaTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  editHref,
  detailsHref,
}) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={menuActions.onClose}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </li>

        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={menuActions.onClose}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          {row.insights?.data?.[0]?.resultDouble ?? '—'}
          <br />
          <span style={{ opacity: 0.6, fontSize: '0.85em' }}>
            {row.insights?.data?.[0]?.resultString ?? ''}
          </span>
        </TableCell>
        <TableCell>{row.bidStrategy}</TableCell>
        <TableCell>
          {row.dailyBudget === 0 ? '—' : 
            <>
              {new Intl.NumberFormat('tr-TR', { style: 'decimal', minimumFractionDigits: 2 }).format(row.dailyBudget) + ' TL'}
              <span className="daily-text"> (Günlük)</span>
            </>
          }
        </TableCell>

        <TableCell>{row.lifeTimeBudget === 0 ? '—' : new Intl.NumberFormat('tr-TR').format(row.lifeTimeBudget)}</TableCell>
        <TableCell>
          {new Date(row.updateTime).toLocaleString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </TableCell>
        <TableCell>
          {row.insights?.data?.[0]?.reach 
            ? new Intl.NumberFormat('tr-TR').format(row.insights?.data?.[0]?.reach) 
            : '—'}
        </TableCell>
        <TableCell>
          {row.insights?.data?.[0]?.impressions 
            ? new Intl.NumberFormat('tr-TR').format(row.insights?.data?.[0]?.impressions) 
            : '—'}
        </TableCell>
        <TableCell>
          {row.insights?.data?.[0]?.resultDouble ? (
            <span style={{ textDecoration: 'underline' }}>
              {new Intl.NumberFormat('tr-TR', { style: 'decimal', minimumFractionDigits: 2 }).format(
                (row.insights?.data?.[0]?.spend ?? 0) / row.insights?.data?.[0]?.resultDouble
              ) + ' TL'}
            </span>
          ) : (
            <span style={{ textDecoration: 'underline' }}>—</span>
          )}
        </TableCell>
        <TableCell>
          {new Intl.NumberFormat('tr-TR', { style: 'decimal', minimumFractionDigits: 2 }).format(row.insights?.data?.[0]?.cpc ?? 0.00)} TL
        </TableCell>
        <TableCell>
          {new Intl.NumberFormat('tr-TR', { style: 'decimal', minimumFractionDigits: 2 }).format(row.insights?.data?.[0]?.cpm ?? 0.00)} TL
        </TableCell>
        <TableCell>
          {new Intl.NumberFormat('tr-TR', { style: 'decimal', minimumFractionDigits: 2 }).format(row.insights?.data?.[0]?.spend ?? 0.00)} TL
        </TableCell>
        <TableCell>
          {new Date(row.startTime).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })} — 
          {row.endTime ? ` - ${new Date(row.endTime).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}` : ' Sürekli'}
        </TableCell>
        <TableCell>
          <Label
              variant="soft"
              color={
                (row.status === 'Aktif' && 'success') ||
                (row.status === 'Pasif' && 'error') ||
                'default'
              }
            >
              {row.status}
          </Label>
        </TableCell>

      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
