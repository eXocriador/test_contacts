import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

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
      search: "",
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
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/contacts", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contacts"
      );
    }
  }
);

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await api.post("/contacts", contactData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create contact"
      );
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, contactData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update contact"
      );
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contacts/${id}`);
      return id;
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
    setPage: (state, action) => {
      state.currentPage = action.payload;
      localStorage.setItem(
        "contactsState",
        JSON.stringify({
          currentPage: state.currentPage,
          perPage: state.perPage,
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
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      );
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.field;
      state.sortOrder = action.payload.order;
      localStorage.setItem(
        "contactsState",
        JSON.stringify({
          currentPage: state.currentPage,
          perPage: state.perPage,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        })
      );
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
        state.items = action.payload.data.contacts;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.data);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (contact) => contact._id === action.payload.data._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (contact) => contact._id !== action.payload
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setPage, setPerPage, setSearch, setSort } =
  contactsSlice.actions;
export default contactsSlice.reducer;
