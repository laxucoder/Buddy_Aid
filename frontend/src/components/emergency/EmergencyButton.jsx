import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';
import { useToast } from '../../context/ToastContext';

export default function EmergencyButton({ large = false }) {
  const { start, loading } = useEmergency();
  const nav = useNavigate();
  const { show } = useToast();

  const act = async () => {
    try {
      await start();

      show('Emergency session activated');
      nav('/emergency/live');
    } catch (error) {
      console.error('SOS activation failed:', error);

      show(
        error?.message ||
          'Unable to activate emergency. Please allow location access.'
      );
    }
  };

  return (
    <button
      onClick={act}
      disabled={loading}
      className={`btn ${
        large ? 'w-full py-4 text-base' : 'btn-primary'
      } ${large ? 'gradient-primary' : ''} ${
        loading ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <ShieldAlert size={large ? 21 : 16} />

      {loading ? 'Activating SOS...' : 'Emergency SOS'}
    </button>
  );
}