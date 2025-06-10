import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Snackbar
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  addContact,
  editContact,
  removeContact,
  setSearch,
  setSort,
  setPage,
  setPerPage,
  clearError
} from "../store/slices/contactsSlice";
import { ContactForm } from "../components/ContactForm";
import Pagination from "../components/Pagination";

export const ContactsPage = () => {
  const dispatch = useDispatch();
  const {
    items: contacts,
    loading,
    error,
    totalPages,
    currentPage,
    perPage,
    search,
    sortBy,
    sortOrder
  } = useSelector((state) => state.contacts);

  const [openForm, setOpenForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [currentPage, perPage, search, sortBy, sortOrder]);

  const loadContacts = () => {
    dispatch(
      fetchContacts({
        page: currentPage,
        perPage,
        search,
        sortBy,
        sortOrder
      })
    );
  };

  const handleOpenForm = (contact = null) => {
    setEditingContact(contact);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingContact(null);
  };

  const handleSubmit = async (contactData) => {
    try {
      if (editingContact) {
        await dispatch(
          editContact({ id: editingContact._id, contact: contactData })
        ).unwrap();
      } else {
        await dispatch(addContact(contactData)).unwrap();
      }
      handleCloseForm();
      loadContacts();
    } catch (error) {
      setShowError(true);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await dispatch(removeContact(id)).unwrap();
        if (contacts.length === 1 && currentPage > 1) {
          dispatch(setPage(currentPage - 1));
        } else {
          loadContacts();
        }
      } catch (error) {
        setShowError(true);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchQuery));
  };

  const handleSort = (field) => {
    const newOrder = field === sortBy && sortOrder === "asc" ? "desc" : "asc";
    dispatch(setSort({ field, order: newOrder }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePerPageChange = (event) => {
    dispatch(setPerPage(Number(event.target.value)));
  };

  const handleCloseError = () => {
    setShowError(false);
    dispatch(clearError());
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Contacts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Contact
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Contacts per page</InputLabel>
              <Select
                value={perPage}
                onChange={handlePerPageChange}
                label="Contacts per page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort("name")}
                sx={{ cursor: "pointer" }}
              >
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("phoneNumber")}
                sx={{ cursor: "pointer" }}
              >
                Phone{" "}
                {sortBy === "phoneNumber" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("email")}
                sx={{ cursor: "pointer" }}
              >
                Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("contactType")}
                sx={{ cursor: "pointer" }}
              >
                Type{" "}
                {sortBy === "contactType" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.contactType}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenForm(contact)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteContact(contact._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingContact ? "Edit Contact" : "Add New Contact"}
        </DialogTitle>
        <DialogContent>
          <ContactForm
            initialData={editingContact}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error || "An error occurred"}
        </Alert>
      </Snackbar>
    </Container>
  );
};
