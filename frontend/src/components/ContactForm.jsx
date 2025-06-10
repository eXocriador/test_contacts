import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormControlLabel,
  Switch
} from "@mui/material";
import { addContact, editContact } from "../store/slices/contactsSlice";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const contactTypes = ["home", "personal", "work"];

export const ContactForm = ({ open, onClose, contact, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    contactType: "personal",
    isFavourite: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phoneNumber: contact.phoneNumber || "",
        contactType: contact.contactType || "personal",
        isFavourite: contact.isFavourite || false
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        contactType: "personal",
        isFavourite: false
      });
    }
    setErrors({});
    setSubmitError("");
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    } else if (formData.name.length > 30) {
      newErrors.name = "Name must be at most 30 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in format +XXXXXXXXXXX";
    }

    if (!formData.contactType) {
      newErrors.contactType = "Contact type is required";
    } else if (!contactTypes.includes(formData.contactType)) {
      newErrors.contactType = `Contact type must be one of [${contactTypes.join(
        ", "
      )}]`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isFavourite" ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      if (contact) {
        await dispatch(
          editContact({ id: contact._id, contact: formData })
        ).unwrap();
        enqueueSnackbar("Contact updated successfully", { variant: "success" });
      } else {
        await dispatch(addContact(formData)).unwrap();
        enqueueSnackbar("Contact created successfully", { variant: "success" });
      }
      onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(error || "Operation failed");
      enqueueSnackbar(error || "Operation failed", {
        variant: "error"
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{contact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              inputProps={{ minLength: 3, maxLength: 30 }}
            />
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              required
              fullWidth
              label="Phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              placeholder="+1234567890"
            />
            <FormControl fullWidth error={!!errors.contactType}>
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
              {errors.contactType && (
                <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                  {errors.contactType}
                </Box>
              )}
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFavourite}
                  onChange={handleChange}
                  name="isFavourite"
                  color="primary"
                />
              }
              label="Favorite"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {contact ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
