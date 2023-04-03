import * as React from 'react';
import { styled as MuiStyled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import Loading from '../assets/loading.gif'

const StyledTableCell = MuiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = MuiStyled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
/**
    interface ColumnDataType {
        id: string,
        nameCol: boolean,
        label: string,
        render: Function  //i.e. (rowData) => {}
    }
 */
/**
    columns: Array<ColumnDataType>
 */
export default function BasicTable({ columns, data, loadMore, isLastPage = true, loadMoreLoading = false }) {

  return (
    <Wrapper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                  column.nameCol ? 
                      <StyledTableCell key={column.id}>{column.label}</StyledTableCell> : 
                      <StyledTableCell key={column.id} align="right">{column.label}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.name}>
                  {columns.map(column => (
                      column.nameCol ? 
                      <StyledTableCell 
                        key={column.id + row.name} 
                        component="th" 
                        scope="row"
                      >
                          {!column.render ? row[column.id] : column.render(row)}
                      </StyledTableCell> : 
                      <StyledTableCell 
                        key={column.id + row.name} 
                        align="right">
                          {!column.render ? row[column.id] : column.render(row)}
                      </StyledTableCell>
                  ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!isLastPage && (
        <div className='load-more-container'>
          {!loadMoreLoading ? 
            <Button variant='contained' onClick={loadMore}>Load More</Button> : 
            <img src={Loading} height="50px" />
          }
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .load-more-container {
    margin-top: 20px;
  }
`