import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Plus, Pencil, Trash2, Phone, Star } from 'lucide-react';

import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../../services/contactService';

import { useToast } from '../../context/ToastContext';

export default function Contacts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  const loadContacts = async () => {
    try {
      setLoading(true);

      const response = await fetchContacts();

      setItems(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      show('Unable to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const add = async () => {
    const name = prompt('Contact name');
    if (!name) return;

    const phone = prompt('Phone number');
    if (!phone) return;

    try {
      const response = await createContact({
        name,
        phone,
        type: items.length === 0 ? 'Primary' : 'Secondary',
        priority: items.length + 1,
      });

      setItems((current) => [...current, response.data.data]);

      show('Contact added successfully');
    } catch (error) {
      console.error('Failed to add contact:', error);
      show('Unable to add contact');
    }
  };

  const edit = async (contact) => {
    const name = prompt('Contact name', contact.name);
    if (!name) return;

    const phone = prompt('Phone number', contact.phone);
    if (!phone) return;

    try {
      const response = await updateContact(contact._id, {
        name,
        phone,
      });

      setItems((current) =>
        current.map((item) =>
          item._id === contact._id
            ? response.data.data
            : item
        )
      );

      show('Contact updated successfully');
    } catch (error) {
      console.error('Failed to update contact:', error);
      show('Unable to update contact');
    }
  };

  const remove = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this contact?'
    );

    if (!confirmed) return;

    try {
      await deleteContact(id);

      setItems((current) =>
        current.filter((item) => item._id !== id)
      );

      show('Contact removed');
    } catch (error) {
      console.error('Failed to delete contact:', error);
      show('Unable to remove contact');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Emergency Contacts"
        title="Your trusted circle"
        subtitle="These people can be part of your emergency notification flow."
        action={
          <button
            onClick={add}
            className="btn btn-primary"
          >
            <Plus size={15} />
            Add Contact
          </button>
        }
      />

      {loading ? (
        <div className="soft-card p-8 text-center">
          Loading contacts...
        </div>
      ) : items.length === 0 ? (
        <div className="soft-card p-8 text-center">
          <h3 className="font-black text-lg">
            No emergency contacts yet
          </h3>

          <p className="muted mt-2">
            Add someone you trust to your emergency circle.
          </p>

          <button
            onClick={add}
            className="btn btn-primary mt-4"
          >
            <Plus size={15} />
            Add Contact
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((contact, index) => (
            <div
              className="soft-card p-5"
              key={contact._id}
            >
              <div className="flex items-center gap-3">
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    className="w-12 h-12 rounded-full object-cover"
                    alt={contact.name}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#fff0f4] text-[#f31f58] grid place-items-center font-black">
                    {contact.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-black">
                    {contact.name}
                  </div>

                  <div className="muted text-xs mt-1 flex items-center gap-1">
                    <Phone size={11} />
                    {contact.phone}
                  </div>
                </div>

                <button
                  onClick={() => edit(contact)}
                  className="w-8 h-8 rounded-full bg-[#fff0f4] text-[#f31f58] grid place-items-center"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => remove(contact._id)}
                  className="w-8 h-8 rounded-full bg-[#fff0f0] text-[#e33450] grid place-items-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`badge ${
                    contact.type === 'Primary'
                      ? 'success'
                      : 'info'
                  }`}
                >
                  {contact.type === 'Primary' && (
                    <Star size={10} />
                  )}

                  {contact.type}
                </span>

                <span className="text-[10px] muted">
                  Priority {contact.priority || index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}