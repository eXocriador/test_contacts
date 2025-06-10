import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { sendResponse } from '../utils/sendResponse.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/filters/parsePaginationParams.js';
import { parseSortParams } from '../utils/filters/parseSortParams.js';
import { parseFilterParams } from '../utils/filters/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  });

  if (!contacts || contacts.data.length === 0) {
    throw createHttpError(404, 'Contacts not found!');
  }

  sendResponse(res, {
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  sendResponse(res, {
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body, req.user._id);

  sendResponse(res, {
    statusCode: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  await deleteContact(contactId, req.user._id);

  res.status(204).send();
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body, req.user._id);

  sendResponse(res, {
    message: `Successfully updated contact with id ${contactId}!`,
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body, req.user._id);

  if (!updatedContact) {
    throw createHttpError(404, `Contact with id ${contactId} not found!`);
  }

  sendResponse(res, {
    message: `Successfully patched contact with id ${contactId}!`,
    data: updatedContact,
  });
};
