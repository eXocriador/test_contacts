import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { ContactForm } from "../components/ContactForm";
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

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

  const handleSearch = (event) => {
    dispatch(setSearch(event.target.value));
  };

  const handleSort = (field) => {
    dispatch(
      setSort({
        field,
        order: sortBy === field && sortOrder === "asc" ? "desc" : "asc"
      })
    );
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage + 1));
  };

  const handleRowsPerPageChange = (event) => {
    dispatch(setPerPage(parseInt(event.target.value, 10)));
  };

  const handleAddContact = async (contact) => {
    try {
      await dispatch(addContact(contact)).unwrap();
      setIsFormOpen(false);
      loadContacts();
    } catch (error) {
      console.error("Failed to add contact:", error);
    }
  };

  const handleEditContact = async (contact) => {
    try {
      await dispatch(editContact({ id: editingContact._id, contact })).unwrap();
      setEditingContact(null);
      setIsFormOpen(false);
      loadContacts();
    } catch (error) {
      console.error("Failed to edit contact:", error);
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
        console.error("Failed to delete contact:", error);
      }
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  if (loading && !contacts?.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const safeContacts = Array.isArray(contacts) ? contacts : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Contacts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Add Contact
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={handleCloseError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search contacts..."
        value={search}
        onChange={handleSearch}
        sx={{ mb: 4 }}
      />

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
              <TableCell
                onClick={() => handleSort("isFavourite")}
                sx={{ cursor: "pointer" }}
              >
                Favorite{" "}
                {sortBy === "isFavourite" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeContacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.contactType}</TableCell>
                <TableCell>{contact.isFavourite ? "★" : "☆"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(contact)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteContact(contact._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalPages * perPage}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={perPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <ContactForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        onSubmit={editingContact ? handleEditContact : handleAddContact}
      />
    </Container>
  );
};
