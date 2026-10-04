import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { ArrowLeft, Camera, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { createReport } from '../../services/reportService';
import api from '../../services/api';

export default function CreateReport() {
  const nav = useNavigate();
  const { show } = useToast();

  const [form, setForm] = useState({
    city: 'Greater Noida',
    area: 'Knowledge Park',
    category: 'Street Lighting',
    description: ''
  });

  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      show('Location is not supported by this browser', 'error');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        setGettingLocation(false);
        show('Current location captured');
      },
      () => {
        setGettingLocation(false);
        show('Unable to get your location', 'error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.description.trim()) {
      show('Please describe the safety issue', 'error');
      return;
    }

    try {
      setLoading(true);

      // 1. Create report in MongoDB
      const reportResponse = await createReport({
        city: form.city,
        area: form.area,
        category: form.category,
        description: form.description,
        latitude: location?.latitude,
        longitude: location?.longitude,
        location: location
          ? {
              type: 'Point',
              coordinates: [
                location.longitude,
                location.latitude
              ]
            }
          : undefined
      });

      const report = reportResponse.data?.data;

      // 2. Upload media to R2 if selected
      if (media && report?._id) {
        const mediaForm = new FormData();

        mediaForm.append('file', media);
        mediaForm.append('context', 'report');

        await api.post('/media/upload', mediaForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      show('Report submitted successfully');
      nav('/reports');
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        'Failed to submit report';

      show(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Report Problem"
        title="Report a Safety Issue"
        subtitle="Provide enough context for moderation without sharing unnecessary personal information."
      />

      <form
        onSubmit={submit}
        className="soft-card p-5 grid md:grid-cols-2 gap-5"
      >
        {/* City */}
        <label>
          <span className="label block mb-1.5">
            Select City
          </span>

          <select
            className="field"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
          >
            <option>Greater Noida</option>
            <option>Delhi</option>
            <option>Noida</option>
          </select>
        </label>

        {/* Area */}
        <label>
          <span className="label block mb-1.5">
            Select Area
          </span>

          <select
            className="field"
            value={form.area}
            onChange={(e) => update('area', e.target.value)}
          >
            <option>Knowledge Park</option>
            <option>Sector 62</option>
            <option>Beta 1</option>
          </select>
        </label>

        {/* Category */}
        <label>
          <span className="label block mb-1.5">
            Category
          </span>

          <select
            className="field"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          >
            <option>Street Lighting</option>
            <option>Harassment</option>
            <option>Suspicious Activity</option>
            <option>Broken Road</option>
            <option>Unsafe Area</option>
            <option>Other</option>
          </select>
        </label>

        {/* Location */}
        <label>
          <span className="label block mb-1.5">
            Location
          </span>

          <button
            type="button"
            onClick={getLocation}
            className="field text-left flex items-center gap-2 w-full"
          >
            {gettingLocation ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <MapPin
                size={14}
                className="text-[#f31f58]"
              />
            )}

            {location
              ? 'Location captured ✓'
              : 'Use current location'}
          </button>
        </label>

        {/* Description */}
        <label className="md:col-span-2">
          <span className="label block mb-1.5">
            Description
          </span>

          <textarea
            required
            className="field h-28 py-3 resize-none"
            placeholder="Describe the issue…"
            value={form.description}
            onChange={(e) =>
              update('description', e.target.value)
            }
          />
        </label>

        {/* Media */}
        <div className="md:col-span-2">
          <span className="label block mb-1.5">
            Add Photo / Video
          </span>

          <label className="thin-card p-4 cursor-pointer flex items-center gap-2 text-xs font-black">
            <Camera
              size={16}
              className="text-[#f31f58]"
            />

            {media ? media.name : 'Choose media'}

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) =>
                setMedia(e.target.files?.[0] || null)
              }
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => nav('/reports')}
            disabled={loading}
          >
            <ArrowLeft size={14} />
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}