import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '../axios/api';
import { AiOutlineMail } from "react-icons/ai";
import swal from 'sweetalert'

export default function ClientList() {
    //const [rows, setRows] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false)
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', address: '', });
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [editingClient, setEditingClient] = useState(null);



    const filteredRows = rows.filter((row) =>
        (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.phone && row.phone.toLowerCase().includes(searchTerm.toLowerCase()))

    );
    const fetchClients = async () => {
        try {
            const response = await api.get('client/get-clients')
            if (response.data.success === true) {
                const newRows = response.data.clientData.map((client, index) => ({
                    id: index + 1,
                    ...client
                }))
                setRows(newRows)
            }
        } catch (error) {
            toast.error('Failed to fetch client list')
        }
    }

    useEffect(() => {
        fetchClients()
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
        setEditingClient(null)
        setNewClient({ name: '', email: '', phone: '', address: '', });
    };

    // Handle create new product action
    const handleAddClient = async () => {
        try {
            const response = await api.post('client/add-client', newClient);
            if (response.data.success == true) {
                const newRow = response.data.client
                // setRows([...rows, newRow]);
                toast.success('Client created successfully!');
                handleCloseModal();
                fetchClients()
            }

        } catch (error) {
            toast.error(error.response.data.message || 'Failed to create product.');
            console.error('Error adding client:', error);
        }
    };

    const handleEditClient = (row) => {

        const selectedRow = rows.filter((client) => client._id === row)

        setNewClient({
            name: selectedRow[0].name,
            email: selectedRow[0].email,
            phone: selectedRow[0].phone,
            address: selectedRow[0].address,
        });
        setEditingClient(row);
        setModalOpen(true);
    };

    const handleUpdateClient = async () => {
        try {
            const response = await api.put(`client/update-client/${editingClient}`, newClient);
            setRows(rows.map(row => (row._id === editingClient ? response.data.client : row)));
            toast.success('Client Details updated successfully!');
            setEditingClient(null)
            handleCloseModal();
            fetchClients();
        } catch (error) {
            toast.error('Failed to update client details.');
            setEditingClient(null)
            handleCloseModal()
            console.error('Error updating client details:', error);
        }
    };

    const handleDeleteClient = async (id) => {
        try {
            await api.delete(`client/delete-client/${id}`);
            setRows(rows.filter(row => row._id !== id));
            toast.success('Client deleted successfully!');
            fetchClients()
        } catch (error) {
            toast.error('Failed to delete client.');
            console.error('Error deleting client:', error);
        }
    };
    const coloumns = [
        { field: "id", headerName: "S.No.", flex: 0.2 },
        { field: "name", headerName: "Name", flex: 0.2 },
        { field: "email", headerName: "Email", flex: 0.2 },
        { field: "phone", headerName: "Phone", flex: 0.2 },
        { field: "address", headerName: "Address", flex: 0.5 },

        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" color="primary" onClick={(e) => {
                        e.stopPropagation()
                        handleEditClient(params.row._id);
                    }}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(params.row._id);
                    }} style={{ marginLeft: '5px' }}>
                        Delete
                    </Button>
                </>
            )
        },
        {
            field: "   ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params) => {
                const { row } = params;
                const handleLinkClick = (e) => {
                    e.stopPropagation();
                };
                return (
                    <a href={`mailto:${row.email}`} onClick={(e) => handleLinkClick(e)}>
                        <AiOutlineMail
                            className="text-black mt-5 ml-2 text-center"
                            size={20}
                        />
                    </a>
                );
            },
        },
    ]
    return (
        <div className="mt-[30px] w-full">
            <Box m="40px">
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <TextField
                        label="Search Clients"
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
                        Add New Client
                    </Button>
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
                <DialogTitle>{editingClient ? "Edit Client Details" : "Enter New Client Details"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newClient.name}
                        required
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Phone"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newClient.address}
                        onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
                    <Button onClick={editingClient ? handleUpdateClient : handleAddClient} color="primary">
                        {editingClient ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <ToastContainer autoClose={2000} />
            </div>
        </div>
    )
}
