import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  createNewContact,
  updateExistingContact,
  fetchContactById,
} from '../store/slices/contactsSlice';

const contactTypes = ['personal', 'work', 'family', 'other'];

function ContactForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    contactType: 'personal',
    isFavourite: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { loading } = useSelector((state) => state.contacts);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchContactById(id))
        .unwrap()
        .then((response) => {
          setFormData(response.data.data);
        })
        .catch((error) => {
          enqueueSnackbar(error.message || 'Failed to fetch contact', {
            variant: 'error',
          });
          navigate('/');
        });
    }
  }, [dispatch, id, isEditMode, navigate, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isFavourite' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateExistingContact({ id, contactData: formData }));
        enqueueSnackbar('Contact updated successfully', { variant: 'success' });
      } else {
        await dispatch(createNewContact(formData));
        enqueueSnackbar('Contact created successfully', { variant: 'success' });
      }
      navigate('/');
    } catch (error) {
      enqueueSnackbar(error.message || 'Operation failed', {
        variant: 'error',
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isEditMode ? 'Edit Contact' : 'Add New Contact'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Contact Type</InputLabel>
            <Select
              name="contactType"
              value={formData.contactType}
              onChange={handleChange}
              label="Contact Type"
            >
              {contactTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isFavourite}
                onChange={handleChange}
                name="isFavourite"
              />
            }
            label="Favorite"
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                ? 'Update Contact'
                : 'Create Contact'}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ContactForm;
