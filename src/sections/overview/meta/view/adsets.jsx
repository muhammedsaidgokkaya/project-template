import React, { useEffect, useState, useCallback } from 'react';
import { sumBy } from 'es-toolkit';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { MetaTableRow } from '../adset/table-row';
import { TableToolbar } from '../table-toolbar';
import { TableFiltersResult } from '../table-filters-result';

const TABLE_HEAD = [
  { id: 'name', label: 'Reklam Seti Adı' },
  { id: 'bidStrategy', label: 'Teklif Stratejisi' },
  { id: 'dailyBudget', label: 'Günlük Bütçe' },
  { id: 'lifeTimeBudget', label: 'Toplam Bütçe' },
  { id: 'updateTime', label: 'Son Düzenleme' },
  { id: 'reach', label: 'Erişim' },
  { id: 'impressions', label: 'Gösterim' },
  { id: 'spend', label: 'Harcanan Tutar' },
  { id: 'cpc', label: 'Tıklama Başına Maliyet' },
  { id: 'cpm', label: 'Bin Gösterim Başına Maliyet' },
  { id: 'plan', label: 'Plan' },
  { id: 'status', label: 'Yayın Durumu' },
];

export default function CampaignsTab() {
  const theme = useTheme();

  const table = useTable();

    const confirmDialog = useBoolean();

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const filters = useSetState({
      name: '',
      status: 'all',
      startDate: null,
      endDate: null,
    });
    const { state: currentFilters, setState: updateFilters } = filters;

    const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('jwtToken'); 
          let startDate = currentFilters.startDate 
              ? new Date(currentFilters.startDate).toISOString().split('T')[0] 
              : null;

          let endDate = currentFilters.endDate 
              ? new Date(currentFilters.endDate).toISOString().split('T')[0] 
              : null;

          // Sorgu parametrelerini dinamik olarak oluştur
          let queryParams = new URLSearchParams();
          if (startDate) queryParams.append('startDate', startDate);
          if (endDate) queryParams.append('endDate', endDate);

          const response = await fetch(`${CONFIG.apiUrl}/Meta/adsets?${queryParams.toString()}`, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });
    
          const data = await response.json();
          if (Array.isArray(data)) {
            setTableData(data);
          } else {
            console.error('Beklenen formatta değil:', data);
            setTableData([]); // Boş bir dizi olarak ayarla
          }
        } catch (error) {
          console.error('Veri çekerken hata:', error);
          setTableData([]);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [currentFilters]);
    
      
    const dataFiltered = applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters: currentFilters,
      dateError,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
      !!currentFilters.name ||
      currentFilters.status !== 'all' ||
      (!!currentFilters.startDate && !!currentFilters.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

    const getTotalAmount = (status) =>
      sumBy(
        tableData.filter((item) => item.status === status),
        (invoice) => invoice.totalAmount
      );

    const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;

    const TABS = [
      {
        value: 'all',
        label: 'Hepsi',
        color: 'default',
        count: tableData.length,
      },
      {
        value: 'Aktif',
        label: 'Aktif',
        color: 'success',
        count: getInvoiceLength('Aktif'),
      },
      {
        value: 'Pasif',
        label: 'Pasif',
        color: 'error',
        count: getInvoiceLength('Pasif'),
      },
    ];

    const handleDeleteRow = useCallback(
      (id) => {
        const deleteRow = tableData.filter((row) => row.id !== id);

        toast.success('Delete success!');

        setTableData(deleteRow);

        table.onUpdatePageDeleteRow(dataInPage.length);
      },
      [dataInPage.length, table, tableData]
    );

    const handleDeleteRows = useCallback(() => {
      const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

      toast.success('Delete success!');

      setTableData(deleteRows);

      table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
    }, [dataFiltered.length, dataInPage.length, table, tableData]);

    const handleFilterStatus = useCallback(
      (event, newValue) => {
        table.onResetPage();
        updateFilters({ status: newValue });
      },
      [updateFilters, table]
    );

  return (
    <Card>
      <Tabs
        value={currentFilters.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            iconPosition="end"
            icon={
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                  'soft'
                }
                color={tab.color}
              >
                {tab.count}
              </Label>
            }
          />
        ))}
      </Tabs>

      <TableToolbar
        filters={filters}
        dateError={dateError}
        onResetPage={table.onResetPage}
        options={{ services: INVOICE_SERVICE_OPTIONS.map((option) => option.name) }}
      />

      {canReset && (
        <TableFiltersResult
          filters={filters}
          onResetPage={table.onResetPage}
          totalResults={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar sx={{ minHeight: 444 }}>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <MetaTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    editHref={paths.dashboard.invoice.edit(row.id)}
                    detailsHref={paths.dashboard.invoice.details(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((campaign) => campaign.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (status !== 'all') {
    inputData = inputData.filter((campaign) => campaign.status === status);
  }

  return inputData;
}
