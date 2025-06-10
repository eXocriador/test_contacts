import createHttpError from 'http-errors';
import { Contacts } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/filters/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/contacts.js';

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filters = {},
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = Contacts.find({ ...filters, parentId: userId });
    const contactsCount = await Contacts.countDocuments({
      ...filters,
      parentId: userId,
    });

    const contacts = await contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    const paginationData = calculatePaginationData(
      contactsCount,
      perPage,
      page,
    );

    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    throw createHttpError(500, 'Failed to fetch contacts');
  }
};

export const getContactById = async (contactId, userId) => {
  try {
    const contact = await Contacts.findOne({
      _id: contactId,
      parentId: userId,
    });
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    return contact;
  } catch (error) {
    if (error.status === 404) throw error;
    throw createHttpError(500, 'Failed to fetch contact');
  }
};

export const createContact = async (payload, userId) => {
  try {
    return await Contacts.create({
      ...payload,
      parentId: userId,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw createHttpError(400, 'Invalid contact data');
    }
    throw createHttpError(500, 'Failed to create contact');
  }
};

export const deleteContact = async (contactId, userId) => {
  try {
    const result = await Contacts.deleteOne({
      _id: contactId,
      parentId: userId,
    });

    if (!result.deletedCount) {
      throw createHttpError(404, 'Contact not found');
    }
  } catch (error) {
    if (error.status === 404) throw error;
    throw createHttpError(500, 'Failed to delete contact');
  }
};

export const updateContact = async (contactId, payload, userId) => {
  try {
    const contact = await Contacts.findOneAndUpdate(
      { _id: contactId, parentId: userId },
      { $set: payload },
      { new: true, runValidators: true },
    );

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    return contact;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw createHttpError(400, 'Invalid contact data');
    }
    if (error.status === 404) throw error;
    throw createHttpError(500, 'Failed to update contact');
  }
};
