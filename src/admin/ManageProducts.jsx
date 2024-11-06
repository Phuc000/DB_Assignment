// src/admin/ManageProducts.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend API
    // Replace '/api/products' with your actual API endpoint
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/products/store/1`)
      .then((response) => response.json())
      .then((data) => (
        console.log('Fetched products:', data),
        setProducts(data)
      ))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleAddProduct = () => {
    // Handle adding a new product
    console.log('Add new product');
  };

  const handleEditProduct = (productId) => {
    // Handle editing product
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = (productId) => {
    // Handle deleting product
    console.log('Delete product:', productId);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddProduct}
        sx={{ mb: 2 }}
      >
        Add New Product
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell>Image URL</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.ProductID}>
                <TableCell>{product.ProductID}</TableCell>
                <TableCell>{product.PName}</TableCell>
                <TableCell>{product.Category}</TableCell>
                <TableCell align="right">${product.Price}</TableCell>
                <TableCell align="right">{product.Weight}</TableCell>
                <TableCell>{product.imageURL}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduct(product.ProductID)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteProduct(product.ProductID)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageProducts;