import React, { useEffect, useState } from 'react'
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '../axios/api';


export default function InventoryList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false)
    const [newStock, setNewStock] = useState({});
    const [rows, setRows] = useState([]);
    const [updatingProduct, setUpdatingProduct] = useState(null)


    const filteredRows = rows.filter((row) =>
        (row.productName && row.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.stockStatus && row.stockStatus.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.stockStatus && row.stockStatus.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.quantity && row.quantity.toString().includes(searchTerm))
    );

    const fetchStockData = async () => {
        try {
            const response = await api.get('inventory/get-details')
            if (response.data.success === true) {
                const newRows = response.data.stocks.map((stock, index) => ({
                    id: index + 1,
                    ...stock,
                    stockStatus: stock.quantity > 5 ? "InStock" : "LowStock",
                }))
                setRows(newRows)
            }
        } catch (error) {
            toast.error("Failed to fetch Inventory Data")
        }
    }

    useEffect(() => {

        fetchStockData()
    }, [])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOpenModal = (id) => {
        setModalOpen(true);
        setUpdatingProduct(id);
        const selectedRow = rows.filter((row) => row._id === id)
        setNewStock({
            _id: selectedRow[0]._id,
            productName: selectedRow[0].productName,
            quantity: selectedRow[0].quantity,
            productId: selectedRow[0].productId
        })
    };

    // Close the modal
    const handleCloseModal = () => {
        setModalOpen(false);
        setNewStock({});
    };

    const handleAddStock = async () => {
        try {
            const response = await api.put(`inventory/add-stock/${updatingProduct}`, newStock);
            setRows(rows.map(row => (row._id === updatingProduct ? response.data.inventory : row)));
            toast.success('Stock updated successfully!');
            setUpdatingProduct(null)
            handleCloseModal();
            fetchStockData()
        } catch (error) {
            toast.error('Failed to update stock.');
            setUpdatingProduct(null)
            handleCloseModal()
            console.error('Error updating stock:', error);
        }
    }

    const coloumns = [
        { field: "id", headerName: "S.No.", flex: 0.2 },
        { field: "productName", headerName: "Product", flex: 0.5 },
        { field: "quantity", headerName: "Quantity", flex: 0.2 },
        {
            field: "stockStatus",
            headerName: "Stock Status",
            flex: 0.5,
            renderCell: (params) => (
                <span style={{
                    color: params.value === "InStock" ? 'green' : 'red',
                    fontWeight: params.value === "LowStock" ? 'bold' : 'normal'
                }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'addStock',
            headerName: 'Update Stock',
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" color="secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(params.row._id);
                    }} style={{ marginLeft: '5px' }}>
                        Add Stock
                    </Button>
                </>
            )
        }
    ]
    return (
        <div className="mt-[30px] w-full">
            <Box m="40px">
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <TextField
                        label="Search Products"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ marginRight: '20px' }}
                    />
                    {/* <Button
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
                        Add New Product to Stock
                    </Button> */}
                </Box>
                <Box
                    m="20px 0 0 0"
                    height="70vh"
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
                <DialogTitle>Update Stock</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Product Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newStock.productName}
                    />
                    <TextField
                        margin="dense"
                        label="Quantity"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newStock.quantity}
                        onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
                    <Button onClick={handleAddStock} color="primary">
                        "Update"
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <ToastContainer autoClose={2000} />
            </div>
        </div>
    )
}
