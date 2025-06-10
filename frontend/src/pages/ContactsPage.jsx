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
  Tooltip,
  Menu,
  Divider
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
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
  clearError,
  clearSearch
} from "../store/slices/contactsSlice";
import { ContactForm } from "../components/ContactForm";
import Pagination from "../components/Pagination";

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "phoneNumber", label: "Phone" },
  { value: "createdAt", label: "Created Date" },
  { value: "isFavourite", label: "Favorite Status" }
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showError, setShowError] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [contactTypeFilter, setContactTypeFilter] = useState("");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

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
    const timer = setTimeout(() => {
      dispatch(
        fetchContacts({
          page: currentPage,
          perPage,
          search: searchQuery,
          sortBy,
          sortOrder,
          isFavourite: showFavoritesOnly ? true : undefined,
          contactType: contactTypeFilter || undefined
        })
      );
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(timer);
  }, [
    currentPage,
    perPage,
    searchQuery,
    sortBy,
    sortOrder,
    showFavoritesOnly,
    contactTypeFilter,
    dispatch
  ]);

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
      dispatch(
        fetchContacts({
          page: currentPage,
          perPage,
          search: searchQuery,
          sortBy,
          sortOrder,
          isFavourite: showFavoritesOnly ? true : undefined,
          contactType: contactTypeFilter || undefined
        })
      );
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
          dispatch(
            fetchContacts({
              page: currentPage,
              perPage,
              search: searchQuery,
              sortBy,
              sortOrder,
              isFavourite: showFavoritesOnly ? true : undefined,
              contactType: contactTypeFilter || undefined
            })
          );
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
      dispatch(
        fetchContacts({
          page: currentPage,
          perPage,
          search: searchQuery,
          sortBy,
          sortOrder,
          isFavourite: showFavoritesOnly ? true : undefined,
          contactType: contactTypeFilter || undefined
        })
      );
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    dispatch(setSearch(value));
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(clearSearch());
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (field) => {
    const newOrder = field === sortBy && sortOrder === "asc" ? "desc" : "asc";
    dispatch(setSort({ field, order: newOrder }));
    handleSortClose();
  };

  const handleToggleSortOrder = () => {
    dispatch(
      setSort({ field: sortBy, order: sortOrder === "asc" ? "desc" : "asc" })
    );
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

      {/* Search and filters */}
      <Box
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
          onChange={handleSearchChange}
          size="small"
          sx={{ flex: 2, minWidth: 180, width: { xs: "100%", sm: "auto" } }}
          InputProps={{
            endAdornment: searchQuery && (
              <IconButton size="small" onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            ),
            startAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            )
          }}
          placeholder="Search by name, email or phone..."
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Per Page</InputLabel>
          <Select
            value={perPage}
            onChange={handlePerPageChange}
            label="Per Page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSortClick}
            startIcon={<SortIcon />}
          >
            Sort by: {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
          </Button>
          <IconButton
            size="small"
            onClick={handleToggleSortOrder}
            color={sortOrder === "asc" ? "primary" : "default"}
          >
            {sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Box>

        <Button
          variant={showFavoritesOnly ? "contained" : "outlined"}
          color="warning"
          size="small"
          onClick={handleFavoritesFilter}
          startIcon={showFavoritesOnly ? <StarIcon /> : <StarBorderIcon />}
        >
          {showFavoritesOnly ? "Favorites" : "All"}
        </Button>
      </Box>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            selected={sortBy === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

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

      {contacts.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No contacts found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or add a new contact
          </Typography>
        </Box>
      )}

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
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
