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

const ProductTable = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        response = await response.json();
        setFoodItems(response[0]);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (itemId) => {
    // Implement the logic to delete the item with the given itemId
    console.log(`Delete item with ID ${itemId}`);
  };

  const handleUpdate = (itemId) => {
    // Implement the logic to update the item with the given itemId
    console.log(`Update item with ID ${itemId}`);
  };

  // Check for admin key and token
  useEffect(() => {
    const admkey = sessionStorage.getItem('adminkey');
    const token = sessionStorage.getItem('token');
    console.log("Admin Key:", admkey);
    console.log("Token:", token);

    if (!admkey || !token) {
      // Redirect to login page or handle unauthorized access
      console.log("Redirecting to login page");
      navigate("/adminlogin");
    }
  }, [navigate]);

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='p-5'>
      <Card className='mt-2' elevation={0}>
        <CardHeader title='Food Items' />
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
              <TableCell style={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Food Item</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="right">
                  <Avatar src={item.img}></Avatar>
                </TableCell>
                <TableCell align="right">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.CategoryName}</TableCell>
                <TableCell align="right">
                  {item.options && item.options[0] && (
                    <span>
                      {item.options[0].half && `Half: $${item.options[0].half} | `}
                      {item.options[0].full && `Full: $${item.options[0].full} | `}
                      {item.options[0].regular && `Regular: $${item.options[0].regular} | `}
                      {item.options[0].medium && `Medium: $${item.options[0].medium} | `}
                      {item.options[0].large && `Large: $${item.options[0].large}`}
                    </span>
                  )}
                </TableCell>
                <TableCell align="right">
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    Delete
                  </button>
                </TableCell>
                <TableCell align="right">
                  <button
                    onClick={() => handleUpdate(item._id)}
                    style={{
                      backgroundColor: 'green',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    Update
                  </button>
                </TableCell>
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

export default ProductTable;
