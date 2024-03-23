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

  const handleDelete = async (itemId) => {
    try {
      const adminKey = sessionStorage.getItem('adminkey');
      const token = sessionStorage.getItem('token');

      if (!adminKey || !token) {
        // Redirect to login page or handle unauthorized access
        console.log("Unauthorized user");
        navigate("/adminlogin");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/deleteFoodItem`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'adminkey': adminKey,
          'token': token,
        },
        body: JSON.stringify({ item_id: itemId }),
      });

      if (response.ok) {
        alert("Deleted Successfully!");
        console.log("Food Item deleted successfully");
        window.location.reload();
      } else {
        console.error("Failed to delete food item");
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  const handleUpdate = (itemId) => {
    let data = itemId;
    console.log("item data: ", data)
    sessionStorage.setItem("item_id", data);
    navigate("/product/update");
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
                  {item.options && item.options.length > 0 && (
                    <div>
                      {item.options.map((data, index) => (
                        <div key={index}>
                          {data.type && <span>{data.type} | </span>}
                          {data.price && <span>Price: {data.price}</span>}
                        </div>
                      ))}
                    </div>
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
