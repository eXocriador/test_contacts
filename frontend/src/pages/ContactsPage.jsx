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
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
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
  const [searchQuery, setSearchQuery] = useState(search);
  const [showError, setShowError] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [contactTypeFilter, setContactTypeFilter] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && currentPage < totalPages) {
        dispatch(setPage(currentPage + 1));
      } else if (e.key === "ArrowLeft" && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, dispatch]);

  useEffect(() => {
    loadContacts();
  }, [
    currentPage,
    perPage,
    search,
    sortBy,
    sortOrder,
    showFavoritesOnly,
    contactTypeFilter
  ]);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  const loadContacts = () => {
    dispatch(
      fetchContacts({
        page: currentPage,
        perPage,
        search,
        sortBy,
        sortOrder,
        isFavourite: showFavoritesOnly ? true : undefined,
        contactType: contactTypeFilter || undefined
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

  const handleDeleteContact = (id) => {
    setContactToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteContact = async () => {
    if (contactToDelete) {
      try {
        await dispatch(removeContact(contactToDelete)).unwrap();
        setShowDeleteDialog(false);
        setContactToDelete(null);
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

  const handleToggleFavorite = async (contact) => {
    try {
      await dispatch(
        editContact({
          id: contact._id,
          contact: { isFavourite: !contact.isFavourite }
        })
      ).unwrap();
      loadContacts();
    } catch (error) {
      setShowError(true);
    }
  };

  const handleFavoritesFilter = () => {
    setShowFavoritesOnly((prev) => !prev);
    dispatch(setPage(1));
  };

  const handleContactTypeFilter = (e) => {
    setContactTypeFilter(e.target.value);
    dispatch(setPage(1));
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
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <TextField
            label="Search contacts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flex: 2, minWidth: 220 }}
            InputProps={{
              endAdornment: (
                <IconButton type="submit">
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel>Per page</InputLabel>
            <Select
              value={perPage}
              onChange={handlePerPageChange}
              label="Per page"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant={showFavoritesOnly ? "contained" : "outlined"}
            color="warning"
            size="small"
            onClick={handleFavoritesFilter}
            sx={{ minWidth: 40 }}
            title="Show only favorites"
          >
            <StarIcon color={showFavoritesOnly ? "inherit" : "disabled"} />
          </Button>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={contactTypeFilter}
              onChange={handleContactTypeFilter}
              label="Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="work">Work</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
                sx={{ width: 180, fontWeight: "bold" }}
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                sx={{ width: 140, fontWeight: "bold" }}
                onClick={() => handleSort("phoneNumber")}
                style={{ cursor: "pointer" }}
              >
                Phone{" "}
                {sortBy === "phoneNumber" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                sx={{ width: 220, fontWeight: "bold" }}
                onClick={() => handleSort("email")}
                style={{ cursor: "pointer" }}
              >
                Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                sx={{ width: 100, fontWeight: "bold" }}
                onClick={() => handleSort("contactType")}
                style={{ cursor: "pointer" }}
              >
                Type{" "}
                {sortBy === "contactType" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell sx={{ width: 100, fontWeight: "bold" }}>
                Actions
              </TableCell>
              <TableCell
                sx={{ width: 80, fontWeight: "bold" }}
                align="right"
                onClick={() => handleSort("isFavourite")}
                style={{ cursor: "pointer" }}
              >
                Fav{" "}
                {sortBy === "isFavourite" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell sx={{ width: 180 }}>{contact.name}</TableCell>
                <TableCell sx={{ width: 140 }}>{contact.phoneNumber}</TableCell>
                <TableCell sx={{ width: 220 }}>{contact.email}</TableCell>
                <TableCell sx={{ width: 100 }}>{contact.contactType}</TableCell>
                <TableCell sx={{ width: 100 }}>
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
                <TableCell sx={{ width: 80 }} align="right">
                  <IconButton onClick={() => handleToggleFavorite(contact)}>
                    {contact.isFavourite ? (
                      <StarIcon color="warning" />
                    ) : (
                      <StarBorderIcon />
                    )}
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

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this contact?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteContact}>
            Delete
          </Button>
        </DialogActions>
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
