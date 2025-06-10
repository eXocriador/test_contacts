import React, { useState, useEffect } from "react";
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
  Switch,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import { addContact, editContact } from "../store/slices/contactsSlice";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const contactTypes = ["home", "personal", "work"];

export const ContactForm = ({ open, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    contactType: "personal",
    isFavourite: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        contactType: initialData.contactType || "personal",
        isFavourite: initialData.isFavourite || false
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
    setHasUnsavedChanges(false);
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number (e.g., +1234567890)";
    }

    if (!formData.contactType) {
      newErrors.contactType = "Please select a contact type";
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
    setHasUnsavedChanges(true);
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        if (initialData) {
          await dispatch(
            editContact({ id: initialData._id, contact: formData })
          ).unwrap();
          enqueueSnackbar("Contact updated successfully", {
            variant: "success"
          });
        } else {
          await dispatch(addContact(formData)).unwrap();
          enqueueSnackbar("Contact created successfully", {
            variant: "success"
          });
        }
      }
      onClose();
    } catch (error) {
      setSubmitError(error.message || "Operation failed");
      enqueueSnackbar(error.message || "Operation failed", {
        variant: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Contact" : "Add New Contact"}
      </DialogTitle>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <FormControl
              fullWidth
              error={!!errors.contactType}
              disabled={isSubmitting}
            >
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
                <FormHelperText>{errors.contactType}</FormHelperText>
              )}
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFavourite}
                  onChange={handleChange}
                  name="isFavourite"
                  color="primary"
                  disabled={isSubmitting}
                />
              }
              label="Favorite"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
              ? "Update"
              : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
