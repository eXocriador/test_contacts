import api from "./api";

export const getContacts = async (
  page = 1,
  perPage = 10,
  search = "",
  sortBy = "name",
  sortOrder = "asc"
) => {
  try {
    const params = {
      page,
      perPage,
      search,
      sortBy,
      sortOrder
    };
    const response = await api.get("/contacts", { params });
    if (!response.data || !response.data.data || !response.data.data.data) {
      throw new Error("Invalid response format");
    }
    return {
      data: response.data.data.data,
      totalPages: response.data.data.totalPages,
      currentPage: response.data.data.currentPage,
      perPage: response.data.data.perPage,
      totalItems: response.data.data.totalItems
    };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const getContactById = async (id) => {
  try {
    const response = await api.get(`/contacts/${id}`);
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw error;
  }
};

export const createContact = async (contact) => {
  try {
    const response = await api.post("/contacts", contact);
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export const updateContact = async (id, contact) => {
  try {
    const response = await api.put(`/contacts/${id}`, contact);
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await api.delete(`/contacts/${id}`);
    return { _id: id };
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};
