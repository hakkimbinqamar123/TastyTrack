import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  TablePagination,
  Avatar,
  Card,
  CardHeader,
} from '@mui/material';


const CustomersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [allCustomers, setAllCustomers] = useState([]);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchAllCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/viewallcustomers', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAllCustomers(data);
    } catch (error) {
      console.error('Error fetching all customers:', error.message);
    }
  };

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const filteredItems = allCustomers.filter((customer) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchTermLower) ||
      customer.email.toLowerCase().includes(searchTermLower) ||
      customer.location.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className='p-5'>
      <Card className='mt-2' elevation={0}>
        <CardHeader title='Customers Details' />
      </Card>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#E0E0E0' }}>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>Index</TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer, index) => (
                <TableRow
                  key={customer._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">{customer.name}</TableCell>
                  <TableCell align="right">{customer.email}</TableCell>
                  <TableCell align="right">{customer.location}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default CustomersTable;