import React, { useEffect, useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { CONFIG } from 'src/global-config';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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

import { ReportTableRow } from '../table-row';
import { TableToolbar } from '../table-toolbar';
import { TableFiltersResult } from '../table-filters-result';

const TABLE_HEAD = [
  { id: 'id', label: '#' },
  { id: 'name', label: 'Rapor Adı' },
  { id: 'account', label: 'Hesap' },
  { id: 'typeId', label: 'Rapor Türü' },
  { id: 'insertedDate', label: 'Oluşturma Tarihi' },
  { id: '', },
];

export function MetaReportView() {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(dayjs().add(1, 'day'));
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  const table = useTable();

    const [tableData, setTableData] = useState([]);
    const filters = useSetState({
      name: '',
      status: 'all',
      startDate: null,
      endDate: null,
    });
    const { state: currentFilters, setState: updateFilters } = filters;

    const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);
    
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

    const handleDeleteRow = useCallback(
      async (id) => {
        try {
          const deleteRow = tableData.filter((row) => row.id !== id);
          setTableData(deleteRow);
          table.onUpdatePageDeleteRow(dataInPage.length);
    
          const token = localStorage.getItem("jwtToken");
          const response = await fetch(`${CONFIG.apiUrl}/Report/delete-report?id=${id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            let errorResponse = { message: "Sunucudan beklenmeyen bir hata döndü." };
            try {
              errorResponse = await response.json();
            } catch (parseError) {
              console.error("Error parsing response:", parseError);
            }
            throw new Error(errorResponse.message || "Bir hata oluştu!");
          }
    
          toast.success('Silme işlemi başarılı!');
        } catch (error) {
          toast.error(error.message || "Silme işlemi başarısız!");
        }
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
    
    const fetchAccounts = async () => {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await fetch(`${CONFIG.apiUrl}/Meta/meta-account`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
          setAccounts(data);
          setSelectedAccount(data[0].accountId);
        } catch (error) {
          console.error('Hesap verisi alınırken bir hata oluştu', error);
        }
      };

    const fetchReports = useCallback(async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(
          `${CONFIG.apiUrl}/Report/reports?accountId=${selectedAccount}&reportType=1&startDate=${startDate}&endDate=${endDate}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!response.ok) {
          throw new Error('Rapor verisi alınırken bir hata oluştu');
        }
    
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error(error);
        toast.error('Rapor verisi alınırken bir hata oluştu');
      }
    }, [selectedAccount, startDate, endDate]);
    
    useEffect(() => {
      fetchAccounts();
    }, []);

    useEffect(() => {
      if (selectedAccount) {
        fetchReports();
      }
    }, [fetchReports, selectedAccount, startDate, endDate]);
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
          heading="Meta"
          links={[
            { name: 'Başlangıç', href: paths.dashboard.root },
            { name: 'Rapor' },
            { name: 'Meta' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.report.meta.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Yeni Rapor
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Reklam Hesapları</InputLabel>
              <Select
                value={selectedAccount}
                onChange={(event) => setSelectedAccount(event.target.value)}
                label="Reklam Hesapları"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.accountId} value={account.accountId}>
                    {account.account}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                gap: 2,
                display: 'flex',
                pr: { xs: 2.5, md: 1 },
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-end', md: 'center' },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                <DatePicker
                  label="Başlangıç Tarihi"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  sx={{ maxWidth: { md: 400 } }}
                />
                <DatePicker
                  label="Bitiş Tarihi"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  sx={{
                    maxWidth: { md: 400 },
                    [`& .MuiFormHelperText-root`]: {
                      bottom: { md: -40 },
                      position: { md: 'absolute' },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Card>
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
                          <ReportTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            editHref={paths.dashboard.invoice.edit(row.id)}
                            detailsHref={paths.dashboard.report.meta.view(row.id)}
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
          </Grid>
        </Grid>
    </DashboardContent>
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

  return inputData;
}
