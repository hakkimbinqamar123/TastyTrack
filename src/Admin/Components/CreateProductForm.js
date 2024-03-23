import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateProductForm = () => {
  const navigate = useNavigate();

  const [foodData, setFoodData] = useState({
    CategoryName: '',
    name: '',
    img: '',
    options: [{ type: '', price: '' }],
    description: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from backend when component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fetchcategories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle error
    }
  };

  const addOption = () => {
    setFoodData({ ...foodData, options: [...foodData.options, { type: '', price: '' }] });
  };

  const handleFieldChange = (field, value) => {
    setFoodData({ ...foodData, [field]: value });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...foodData.options];
    updatedOptions[index][field] = value;
    setFoodData({ ...foodData, options: updatedOptions });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validation logic...

    try {
      // Send data to the server...
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ maxWidth: 600, margin: 'auto' }}>
        <Typography variant="h4" mb={3} textAlign="center">
          Add Food Item
        </Typography>

        <InputLabel id="category-name-placeholder" sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
          Category Name
        </InputLabel>
        <Select
          labelId="category-name-placeholder"
          value={foodData.CategoryName}
          onChange={(e) => handleFieldChange('CategoryName', e.target.value)}
          required
          fullWidth
        >
          <MenuItem value="" disabled>
            Select a category
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category.CategoryName}>
              {category.CategoryName}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Food Item Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={foodData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
        />

        <TextField
          label="Image"
          variant="outlined"
          fullWidth
          margin="normal"
          value={foodData.img}
          onChange={(e) => handleFieldChange('img', e.target.value)}
          required
        />

        {/* Options */}
        <Box>
          <Typography variant="h6" mb={1}>
            Options:
          </Typography>

          {foodData.options.map((option, index) => (
            <Box key={index} display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Option Type"
                variant="outlined"
                fullWidth
                margin="normal"
                value={option.type}
                onChange={(e) => handleOptionChange(index, 'type', e.target.value)}
                required
              />
              <TextField
                label="Option Price"
                variant="outlined"
                full margin="normal"
                value={option.price}
                onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                required
              />
            </Box>
          ))}

          <Button type="button" onClick={addOption} variant="contained" color="primary" mt={2}>
            Add Option
          </Button>
        </Box>
        {/* End of Options */}

        <TextField
          label="Description"
          placeholder="Description"
          multiline
          minRows={4}
          value={foodData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          required
          sx={{ width: '100%' }}
        />

        <Box mt={2} /> {/* Add space between TextField and Button */}

        <Button type="submit" variant="contained" color="primary">
          Add Food Item
        </Button>
      </Box>
    </form>
  );
};

export default CreateProductForm;
