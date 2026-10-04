import Contact from '../models/Contact.js';

export async function getContacts(req, res, next) {
  try {
    const contacts = await Contact.find({
      userId: req.user.id,
    }).sort({ priority: 1, createdAt: 1 });

    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function createContact(req, res, next) {
  try {
    const { name, phone, type, priority, avatar } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required',
      });
    }

    const contact = await Contact.create({
      userId: req.user.id,
      name,
      phone,
      type: type || 'Secondary',
      priority: priority || 1,
      avatar: avatar || '',
    });

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContact(req, res, next) {
  try {
    const contact = await Contact.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(req, res, next) {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact removed successfully',
    });
  } catch (error) {
    next(error);
  }
}