import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '../axios/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Correct import
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';



export default function SalesList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false)
    const [newSales, setNewSales] = useState({ productName: '', clientEmail: '', soldUnits: 0, });
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [editingSales, setEditingSales] = useState(null);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);


    const formatDate = (date) => {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        // const hours = String(d.getHours()).padStart(2, "0");
        // const minutes = String(d.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year}`;
    };

    // const filteredRows = rows.filter((row) =>
    //     (row.productName && row.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //     (row.clientEmail && row.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //     (row.soldUnits && String(row.soldUnits).includes(searchTerm)) ||
    //     (row.purchasedDate && formatDate(row.purchasedDate) === searchTerm)

    // );

    const filteredRows = rows.filter((row) => {
        const purchaseDate = new Date(row.purchasedDate);
        const isInDateRange = (!fromDate || purchaseDate >= new Date(fromDate)) &&
            (!toDate || purchaseDate <= new Date(toDate));

        return (
            isInDateRange &&
            ((row.productName && row.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.clientEmail && row.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.soldUnits && String(row.soldUnits).includes(searchTerm)))
        );
    });


    const fetchSales = async () => {
        try {
            const response = await api.get('sales/get-sales')
            if (response.data.success === true) {
                const newRows = response.data.salesData.map((sale, index) => ({
                    id: index + 1,
                    ...sale,
                    createdAt: formatDate(sale.purchasedDate)
                }))
                setRows(newRows)
            }
        } catch (error) {
            toast.error('Failed to fetch sales list')
        }
    }

    useEffect(() => {
        fetchSales()
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
        setEditingSales(null)
        setNewSales({ productName: '', clientEmail: '', soldUnits: 0, });
    };

    // Handle create new product action
    const handleAddSales = async () => {
        try {
            const response = await api.post('sales/add-sales', newSales);
            if (response.data.success == true) {
                const newRow = response.data.salesData
                setRows([...rows, newRow]);
                toast.success('Sales details added');
                handleCloseModal();
                fetchSales()
            }

        } catch (error) {
            toast.error(error.response.data.message || 'Failed to add sales data.');
            console.error('Error adding sales:', error);
        }
    };

    const handleEditSales = (row) => {

        const selectedRow = rows.filter((sale) => sale._id === row)

        setNewSales({
            productName: selectedRow[0].productName,
            clientEmail: selectedRow[0].clientEmail,
            soldUnits: selectedRow[0].soldUnits,
        });
        setEditingSales(row);
        setModalOpen(true);
    };

    const handleUpdateSales = async () => {
        try {
            const response = await api.put(`sales/edit-sales/${editingSales}`, newSales);
            setRows(rows.map(row => (row._id === editingSales ? response.data.salesData : row)));
            toast.success('Sales details updated successfully!');
            setEditingSales(null)
            handleCloseModal();
            fetchSales();
        } catch (error) {
            toast.error('Failed to update sales details.');
            setEditingSales(null)
            handleCloseModal()
            console.error('Error updating sales details:', error);
        }
    };

    const handleDeleteSales = async (id) => {
        try {
            await api.delete(`sales/delete-sales/${id}`);
            setRows(rows.filter(row => row._id !== id));
            toast.success('Sales data deleted successfully!');
            fetchSales()
        } catch (error) {
            toast.error('Failed to delete sales data.');
            console.error('Error deleting sales data:', error);
        }
    };
    const coloumns = [
        { field: "id", headerName: "S.No.", flex: 0.1 },
        { field: "createdAt", headerName: "Date", flex: 0.2 },
        { field: "productName", headerName: "Product", flex: 0.2 },
        { field: "clientEmail", headerName: "Client Email", flex: 0.2 },
        { field: "soldUnits", headerName: "No. of Units Sold", flex: 0.2 },

        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" color="primary" onClick={(e) => {
                        e.stopPropagation()
                        handleEditSales(params.row._id);
                    }}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSales(params.row._id);
                    }} style={{ marginLeft: '5px' }}>
                        Delete
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
                        label="Search.."
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ marginRight: '20px' }}
                    />
                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="From"
                                value={fromDate}
                                onChange={(date) => setFromDate(date)}
                                slots={{
                                    textField: (textFieldProps) => (
                                        <TextField {...textFieldProps} />
                                    ),
                                }}
                                sx={{ ml: 2 }}
                            />
                            <DatePicker
                                label="To"
                                value={toDate}
                                onChange={(date) => setToDate(date)}
                                sx={{ ml: 2 }}
                                //renderInput={(params: any) => <TextField {...params} />}
                                slots={{
                                    textField: (textFieldProps) => (
                                        <TextField {...textFieldProps} />
                                    ),
                                }}
                            />
                        </LocalizationProvider >
                    </Box>


                    <Box display="flex" justifyContent="left" mb={2}>

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
                            Add New Sales
                        </Button>
                    </Box>

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
                <DialogTitle>{editingSales ? "Edit Sale Details" : "Add New Sales"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Product Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newSales.productName}
                        required
                        onChange={(e) => setNewSales({ ...newSales, productName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Client Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newSales.clientEmail}
                        onChange={(e) => setNewSales({ ...newSales, clientEmail: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="No. of Units Sold"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newSales.soldUnits}
                        onChange={(e) => setNewSales({ ...newSales, soldUnits: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
                    <Button onClick={editingSales ? handleUpdateSales : handleAddSales} color="primary">
                        {editingSales ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <ToastContainer autoClose={2000} />
            </div>
        </div>

    )
}
