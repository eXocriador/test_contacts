import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from "../../services/contacts";

const getInitialState = () => {
  const savedState = localStorage.getItem("contactsState");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      items: [],
      loading: false,
      error: null,
      totalPages: 1,
      currentPage: parsedState.currentPage || 1,
      perPage: parsedState.perPage || 10,
      search: parsedState.search || "",
      sortBy: parsedState.sortBy || "name",
      sortOrder: parsedState.sortOrder || "asc"
    };
  }
  return {
    items: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    perPage: 10,
    search: "",
    sortBy: "name",
    sortOrder: "asc"
  };
};

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async ({ page, perPage, search, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      const response = await getContacts(
        page,
        perPage,
        search,
        sortBy,
        sortOrder
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contacts"
      );
    }
  }
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (contact, { rejectWithValue }) => {
    try {
      const response = await createContact(contact);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create contact"
      );
    }
  }
);

export const editContact = createAsyncThunk(
  "contacts/editContact",
  async ({ id, contact }, { rejectWithValue }) => {
    try {
      const response = await updateContact(id, contact);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update contact"
      );
    }
  }
);

export const removeContact = createAsyncThunk(
  "contacts/removeContact",
  async (id, { rejectWithValue }) => {
    try {
      await deleteContact(id);
      return { _id: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete contact"
      );
    }
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState: getInitialState(),
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1;
      localStorage.setItem(
        "contactsState",
        JSON.stringify({
          currentPage: state.currentPage,
          perPage: state.perPage,
          search: state.search,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      );
    },
    setSort: (state, action) => {
      const { field, order } = action.payload;
      state.sortBy = field;
      state.sortOrder = order;
      state.currentPage = 1;
      localStorage.setItem(
        "contactsState",
        JSON.stringify({
          currentPage: state.currentPage,
          perPage: state.perPage,
          search: state.search,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      );
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
      localStorage.setItem(
        "contactsState",
        JSON.stringify({
          currentPage: state.currentPage,
          perPage: state.perPage,
          search: state.search,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      );
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
      state.currentPage = 1;
      localStorage.setItem(
        "contactsState",
        JSON.stringify({
          currentPage: state.currentPage,
          perPage: state.perPage,
          search: state.search,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      );
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.items = action.payload.data.data || [];
          state.totalPages = action.payload.data.totalPages || 1;
          state.currentPage = action.payload.data.currentPage || 1;
          state.perPage = action.payload.data.perPage || 10;
        } else {
          state.items = [];
          state.error = "Invalid response format";
        }
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.items = [];
      })
      // Add Contact
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = [...state.items, action.payload];
        } else {
          state.error = "Invalid response format";
        }
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Edit Contact
      .addCase(editContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editContact.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.items.findIndex(
            (item) => item._id === action.payload._id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        } else {
          state.error = "Invalid response format";
        }
      })
      .addCase(editContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Remove Contact
      .addCase(removeContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeContact.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          state.items = state.items.filter(
            (item) => item._id !== action.payload._id
          );
        } else {
          state.error = "Invalid response format";
        }
      })
      .addCase(removeContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { setSearch, setSort, setPage, setPerPage, clearError } =
  contactsSlice.actions;

export const fetchContactById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    const response = await getContactById(id);
    dispatch(setCurrentContact(response.data.data));
    return response;
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch contact")
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const createNewContact = (contactData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    const response = await createContact(contactData);
    dispatch(fetchContacts());
    return response;
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to create contact")
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateExistingContact = (id, contactData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    const response = await updateContact(id, contactData);
    dispatch(fetchContacts());
    return response;
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to update contact")
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteExistingContact = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());
    await deleteContact(id);
    dispatch(fetchContacts());
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to delete contact")
    );
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default contactsSlice.reducer;
