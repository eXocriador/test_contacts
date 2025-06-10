import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contactsReducer from './slices/contactsSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer,
    theme: themeReducer,
  },
});

export default store;
