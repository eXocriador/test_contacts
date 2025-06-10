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
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Tooltip
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

const ContactCard = ({ contact, onEdit, onDelete, onToggleFavorite }) => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: 2
    }}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {contact.name}
        </Typography>
        <Tooltip
          title={
            contact.isFavourite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <IconButton onClick={() => onToggleFavorite(contact)}>
            {contact.isFavourite ? (
              <StarIcon color="warning" />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        <b>Phone:</b> {contact.phoneNumber}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 0.5,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        <b>Email:</b> {contact.email}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <b>Type:</b> {contact.contactType}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
      <Tooltip title="Edit">
        <IconButton color="primary" onClick={() => onEdit(contact)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => onDelete(contact._id)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
);

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

      {/* Unified filter/search panel, responsive */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          mb: 3,
          display: "flex",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 2,
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" }
        }}
      >
        <TextField
          label="Search contacts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flex: 2, minWidth: 180, width: { xs: "100%", sm: "auto" } }}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" size="small">
                <SearchIcon />
              </IconButton>
            )
          }}
          placeholder="Search by name, email or phone..."
        />
        <FormControl
          sx={{ minWidth: 100, width: { xs: "100%", sm: "auto" } }}
          size="small"
        >
          <InputLabel>Per page</InputLabel>
          <Select
            value={perPage}
            onChange={handlePerPageChange}
            label="Per page"
          >
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
          size="small"
        >
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
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" }
          }}
        >
          <Button
            variant={showFavoritesOnly ? "contained" : "outlined"}
            color="warning"
            size="small"
            onClick={handleFavoritesFilter}
            sx={{ minWidth: 40, height: 40, borderRadius: 1 }}
            title="Show only favorites"
          >
            <StarIcon color={showFavoritesOnly ? "inherit" : "disabled"} />
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Responsive Grid of Contact Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {contacts.map((contact) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={contact._id}>
            <ContactCard
              contact={contact}
              onEdit={handleOpenForm}
              onDelete={handleDeleteContact}
              onToggleFavorite={handleToggleFavorite}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      {/* Edit/Add Contact Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <ContactForm
          open={openForm}
          onClose={handleCloseForm}
          initialData={editingContact}
          onSubmit={handleSubmit}
        />
      </Dialog>

      {/* Custom Delete Dialog */}
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
