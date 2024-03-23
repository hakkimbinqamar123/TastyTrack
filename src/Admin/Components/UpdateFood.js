import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    TextareaAutosize,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UpdateFoodItemForm = () => {
    const navigate = useNavigate();
    const itemId = sessionStorage.getItem("item_id");

    const [foodData, setFoodData] = useState({
        CategoryName: '',
        name: '',
        img: '',
        options: [{ type: '', price: '' }],
        description: '',
    });

    useEffect(() => {
        const fetchFoodItem = async () => {
            try {
                const adminKey = sessionStorage.getItem('adminkey');
                const token = sessionStorage.getItem('token');

                if (!adminKey || !token) {
                    console.log("Unauthorized user");
                    navigate("/adminlogin");
                    return;
                }
                const response = await fetch(`http://localhost:5000/api/viewOneFoodItem`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'adminkey': adminKey,
                        'token': token,
                    },
                    body: JSON.stringify({ item_id: itemId }),
                });
                const responseData = await response.json();

                if (response.ok) {
                    const transformedOptions = responseData.data.options.map(option => ({
                        type: option.type, // Change 'half' and 'full' to 'type'
                        price: option.price, // Change 'half' and 'full' to 'price'
                    }));

                    setFoodData({
                        ...responseData.data,
                        options: transformedOptions,
                    });
                } else {
                    console.error('Error fetching food item:', responseData);
                    // Handle error scenarios
                }
            } catch (error) {
                console.error('Error fetching food item:', error.message);
                // Handle network errors or other exceptions
            }
        };

        fetchFoodItem();
    }, [itemId]);

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

        // Validation logic
        if (!foodData.CategoryName || !foodData.name || !foodData.img || !foodData.description) {
            alert('All fields are required');
            return;
        }

        for (const option of foodData.options) {
            if (!option.type || !option.price) {
                alert('All option fields are required');
                return;
            }
        }

        try {
            const adminKey = sessionStorage.getItem('adminkey');
            const token = sessionStorage.getItem('token');

            if (!adminKey || !token) {
                console.log("Unauthorized user");
                navigate("/adminlogin");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/updateFoodItem`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'adminkey': adminKey,
                    'token': token,
                },
                body: JSON.stringify({ ...foodData, item_id: itemId }),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Food item updated successfully:', responseData);
                alert("Food Item Updated Successfully!");
                navigate("/foodItems");
            } else {
                console.error('Error updating food item:', responseData);
                // Handle error scenarios
            }
        } catch (error) {
            console.error('Error updating food item:', error.message);
            // Handle network errors or other exceptions
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ maxWidth: 600, margin: 'auto' }}>
                <Typography variant="h4" mb={3} textAlign="center">
                    Update Food Item
                </Typography>

                <TextField
                    label="Category Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={foodData.CategoryName}
                    onChange={(e) => handleFieldChange('CategoryName', e.target.value)}
                    required
                />

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
                            />
                            <TextField
                                label="Option Price"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={option.price}
                                onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                            />
                        </Box>
                    ))}

                    <Button type="button" onClick={addOption} variant="contained" color="primary" mt={2}>
                        Add Option
                    </Button>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                    <TextField
                        label="Description"
                        placeholder="Description"
                        minRows={4}
                        value={foodData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        required
                        sx={{ width: '100%' }}
                    />

                    <Box mt={2} />

                    <Button type="submit" variant="contained" color="primary">
                        Update Food Item
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default UpdateFoodItemForm;
