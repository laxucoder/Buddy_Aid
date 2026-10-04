import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { fetchEmergencies } from '../../services/emergencyService';

export default function Emergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchEmergencies();
      setEmergencies(response.data?.data || []);
    } catch (err) {
      console.error('Failed to load emergencies:', err);
      setError('Unable to load emergency sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencies();
  }, []);

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Emergency Monitor"
        subtitle="Monitor current and recent emergency sessions."
      />

      <div className="soft-card p-3">
        {loading && (
          <div className="p-6 text-center">
            Loading emergency sessions...
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && emergencies.length === 0 && (
          <div className="p-6 text-center text-slate-500">
            No emergency sessions found.
          </div>
        )}

        {!loading && !error && emergencies.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>
                {emergencies.map((emergency) => (
                  <tr key={emergency._id}>
                    <td>
                      #{String(emergency._id).slice(-6).toUpperCase()}
                    </td>

                    <td className="font-black">
                      {emergency.userId?.name ||
                        emergency.userId?.email ||
                        'User'}
                    </td>

                    <td>
                      {typeof emergency.latitude === 'number' &&
                      typeof emergency.longitude === 'number'
                        ? `${emergency.latitude.toFixed(5)}, ${emergency.longitude.toFixed(5)}`
                        : 'Location unavailable'}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          emergency.status === 'active'
                            ? 'pending'
                            : 'success'
                        }`}
                      >
                        {emergency.status === 'active'
                          ? 'Active'
                          : 'Ended'}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        emergency.updatedAt || emergency.createdAt
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}