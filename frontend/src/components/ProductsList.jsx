import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '../axios/api';
import swal from 'sweetalert'

export default function ProductsList() {
    //const [rows, setRows] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false)
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', brand: '', description: "", });
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);



    const filteredRows = rows.filter((row) =>
        (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.category && row.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.brand && row.brand.toLowerCase().includes(searchTerm.toLowerCase()))

    );

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('products/fetch')
                if (response.data.success === true) {
                    const newRows = response.data.products.map((product, index) => ({
                        id: index + 1,
                        ...product
                    }))
                    setRows(newRows)
                }
            } catch (error) {
                toast.error('Failed to fetch product list')
            }
        }
        fetchProducts()
    }, [])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setModalOpen(false);
        setNewProduct({ name: '', price: '', category: '', brand: '', description: '', });
    };

    // Handle create new product action
    const handleCreateProduct = async () => {
        try {
            const response = await api.post('products/add', newProduct);
            if (response.data.success == true) {
                const newRow = response.data.product
                setRows([...rows, newRow]);
                swal('Product created successfully!');
                handleCloseModal();
            }

        } catch (error) {
            toast.error(error.response.data.message || 'Failed to create product.'); // Notify error
            console.error('Error creating product:', error);
        }
    };

    const handleEditProduct = (row) => {

        const selectedRow = rows.filter((product) => product._id === row)

        setNewProduct({
            name: selectedRow[0].name,
            price: selectedRow[0].price,
            category: selectedRow[0].category,
            brand: selectedRow[0].brand,
            description: selectedRow[0].description,
        });
        setEditingProduct(row);
        setModalOpen(true);
    };

    const handleUpdateProduct = async () => {
        try {
            const response = await api.put(`products/update/${editingProduct}`, newProduct);
            setRows(rows.map(row => (row._id === editingProduct._id ? response.data.product : row)));
            toast.success('Product updated successfully!');
            handleCloseModal();
        } catch (error) {
            toast.error('Failed to update product.');
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`products/delete/${id}`);
            setRows(rows.filter(row => row._id !== id));
            toast.success('Product deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete product.');
            console.error('Error deleting product:', error);
        }
    };
    const coloumns = [
        { field: "id", headerName: "S.No.", flex: 0.2 },
        { field: "name", headerName: "Product", flex: 0.5 },
        { field: "brand", headerName: "Brand", flex: 0.5 },
        { field: "category", headerName: "Category", flex: 0.5 },
        { field: "description", headerName: "Details", flex: 0.5 },
        { field: "price", headerName: "Price", flex: 0.2 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" color="primary" onClick={(e) => {
                        e.stopPropagation()
                        handleEditProduct(params.row._id);
                    }}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(params.row._id);
                    }} style={{ marginLeft: '5px' }}>
                        Delete
                    </Button>
                </>
            )
        }
    ]
    return (
        <div className="mt-[80px] w-full">
            <Box m="40px">
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <TextField
                        label="Search Products"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ marginRight: '20px' }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#0097a7',
                            '&:hover': {
                                backgroundColor: '#007B85',
                            },
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '8px 16px',
                            borderRadius: '30px',
                        }}
                        onClick={handleOpenModal}
                    >
                        Create New Product
                    </Button>
                </Box>
                <Box
                    m="40px 0 0 0"
                    height="80vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                            outline: "none",
                        },

                        "& .MuiDataGrid-row": {
                            color: "#333333",
                            borderBottom: "1px solid #ccc!important",
                            textAlign: "center"

                        },
                        "& .MuiDataGrid-columnHeader": {
                            color: "#ffffff",
                            backgroundColor: "#0097a7",
                            fontWeight: "bold",
                            textAlign: "center",
                        },
                        "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
                            color: "white",
                        },
                        "& .MuiDataGrid-sortIcon": {
                            color: "white",
                        },
                        "& .MuiDataGrid-colCell[data-field='']": {
                            backgroundColor: "#006ca5 !important",
                        },
                        "& .MuiDataGrid-colCell[data-field=' ']": {
                            backgroundColor: "#006ca5 !important",
                        },
                        "& .MuiDataGrid-colCell[data-field='  ']": {
                            backgroundColor: "#006ca5 !important",
                        },

                        // "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        //   color: "#fff !important",
                        // },
                        "& .MuiDataGrid-footerContainer": {
                            color: "#fff",
                            borderTop: "none",
                            backgroundColor: "#0097a7",
                        },
                        "& .MuiTablePagination-root": {
                            color: "#fff",
                        },
                        "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                            color: "#fff",
                        },
                        "& .name-column--cell": {
                            color: "#fff",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: "#ffff",
                        },
                        "& .MuiDataGrid-footerContainer .MuiDataGrid-iconButton": {
                            color: "white",
                        },
                        "& .MuiDataGrid-footerContainer .MuiSvgIcon-root": {
                            color: "white",
                        },
                    }}
                >
                    <DataGrid checkboxSelection rows={filteredRows} columns={coloumns} getRowId={(row) => row._id} />
                </Box>
            </Box>
            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Product Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Brand"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
                    <Button onClick={editingProduct ? handleUpdateProduct : handleCreateProduct} color="primary">
                        {editingProduct ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <ToastContainer autoClose={2000} />
            </div>
        </div>
    )
}
