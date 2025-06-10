import api from "./api";

export const getContacts = async (
  page = 1,
  perPage = 10,
  search = "",
  sortBy = "name",
  sortOrder = "asc",
  isFavourite,
  contactType
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    sortBy,
    sortOrder
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }
  if (isFavourite !== undefined) {
    params.append("isFavourite", isFavourite.toString());
  }
  if (contactType) {
    params.append("contactType", contactType);
  }

  const response = await api.get(`/contacts?${params.toString()}`);
  return response.data;
};

export const getContactById = async (id) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (contact) => {
  const response = await api.post("/contacts", contact);
  return response.data;
};

export const updateContact = async (id, contact) => {
  const response = await api.put(`/contacts/${id}`, contact);
  return response.data;
};

export const deleteContact = async (id) => {
  await api.delete(`/contacts/${id}`);
  return { _id: id };
};
