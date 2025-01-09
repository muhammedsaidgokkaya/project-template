import React, { useEffect, useState, useCallback } from 'react';
import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { _invoices } from 'src/_mock';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { SearchConsoleTableRow } from './table-row';

export default function DataTableSearchConsole({ dimension, titleName, startDate, endDate }) {
  const TABLE_HEAD = [
    { id: 'key', label: titleName },
    { id: 'clikcs', label: 'Tıklamalar' },
    { id: 'impressions', label: 'Gösterimler' },
    { id: 'to', label: 'Tıklama Oranı' },
    { id: 'position', label: 'Pozisyon' },
  ];

  const theme = useTheme();
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dimensions: dimension,
  });

  useEffect(() => {
    const fetchData = async (start, end) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken'); 
        
        const response = await fetch(`${CONFIG.apiUrl}/SearchConsole/get-search-console-querys?dimensions=${filters.dimensions}&startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format('YYYY-MM-DD')}`, {
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
          setTableData([]);
        }
      } catch (error) {
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData(startDate, endDate);
  }, [filters.dimensions, startDate, endDate]);
  

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters,
    dateError: false,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.dimensions;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <Card>
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
              sx={{
                th: {
                  overflow: 'hidden',
                },
              }}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <SearchConsoleTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
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

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
