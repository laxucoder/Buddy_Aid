import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateProfile } from '../../services/userService';

export default function Profile() {
  const { user } = useAuth();
  const { show } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await updateProfile({
        name,
        phone,
        city,
        avatar,
      });

      if (response.data?.success) {
        show('Profile updated successfully');

        // Reload user data from the backend
        window.location.reload();
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      console.error('Server response:', error?.response?.data);

      show(
        error?.response?.data?.message ||
          'Unable to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="Edit Profile"
      />

      <div className="grid lg:grid-cols-[240px_1fr] gap-5">

        <aside className="soft-card p-5">
          <div className="text-center">

            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#fff0f4]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#fff0f4] text-[#f31f58] grid place-items-center mx-auto text-3xl font-black border-4 border-[#fff0f4]">
                {(name || 'B').slice(0, 1).toUpperCase()}
              </div>
            )}

            <button
              type="button"
              className="btn btn-outline mt-4 py-2"
              onClick={() => {
                const value = prompt(
                  'Enter profile image URL'
                );

                if (value) {
                  setAvatar(value);
                }
              }}
            >
              <Camera size={14} />
              Change Photo
            </button>
          </div>

          <div className="space-y-1 mt-6 text-xs font-black text-[#69718c]">
            <div className="bg-[#fff0f4] text-[#f31f58] rounded-lg p-3">
              Profile
            </div>

            <div className="p-3">
              Emergency Contacts
            </div>

            <div className="p-3">
              Privacy & Security
            </div>

            <div className="p-3">
              Notifications
            </div>
          </div>
        </aside>

        <div className="soft-card p-6">
          <div className="grid md:grid-cols-2 gap-5">

            <label>
              <span className="label block mb-1.5">
                Full Name
              </span>

              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              <span className="label block mb-1.5">
                Phone Number
              </span>

              <input
                className="field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label>
              <span className="label block mb-1.5">
                Email
              </span>

              <input
                className="field"
                value={user?.email || ''}
                readOnly
              />
            </label>

            <label>
              <span className="label block mb-1.5">
                City
              </span>

              <input
                className="field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>

            <label className="md:col-span-2">
              <span className="label block mb-1.5">
                Bio
              </span>

              <textarea
                className="field h-24 py-3"
                defaultValue="Safety is everyone’s responsibility."
                readOnly
              />
            </label>

            <div className="md:col-span-2 flex justify-end">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={14} />

                {saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}