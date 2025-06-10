import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  MenuItem,
  Pagination,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getContacts, deleteContact } from '../services/contacts';
import { useSnackbar } from 'notistack';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'createdAt', label: 'Created At' },
];

const SORT_ORDERS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const Contacts = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        perPage: 10,
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
      };
      const response = await getContacts(params);
      setContacts(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to fetch contacts', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, sortBy, sortOrder, searchQuery]);

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      enqueueSnackbar('Contact deleted successfully', { variant: 'success' });
      fetchContacts();
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to delete contact', {
        variant: 'error',
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  if (loading) {
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              My Contacts
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/contacts/new')}
            >
              Add Contact
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Sort Order"
              value={sortOrder}
              onChange={handleOrderChange}
            >
              {SORT_ORDERS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {contacts.map((contact) => (
          <Grid item xs={12} sm={6} md={4} key={contact._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {contact.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {contact.email}
                </Typography>
                <Typography color="text.secondary">{contact.phone}</Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/contacts/${contact._id}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(contact._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {contacts.length === 0 && !loading && (
        <Box
          sx={{
            mt: 4,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6">No contacts found</Typography>
          <Typography variant="body1">
            Try adjusting your search or add a new contact
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Contacts;
