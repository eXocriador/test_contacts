import api from "./api";

export const getContacts = async (
  page = 1,
  perPage = 10,
  search = "",
  sortBy = "name",
  sortOrder = "asc"
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    sortBy,
    sortOrder
  });

  if (search) {
    params.append("search", search);
  }

  return api.get(`/contacts?${params.toString()}`);
};

export const getContactById = async (id) => {
  return api.get(`/contacts/${id}`);
};

export const createContact = async (contact) => {
  return api.post("/contacts", contact);
};

export const updateContact = async (id, contact) => {
  return api.put(`/contacts/${id}`, contact);
};

export const deleteContact = async (id) => {
  return api.delete(`/contacts/${id}`);
};
