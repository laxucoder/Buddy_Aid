import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import MapArt from '../../components/common/MapArt';
import { fetchReports } from '../../services/reportService';

export default function SafetyMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetchReports();

        setReports(response.data?.data || []);
      } catch (err) {
        console.error('Failed to load safety reports:', err);
        setError('Unable to load safety reports.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const validReports = useMemo(() => {
    return reports.filter(
      (report) =>
        typeof report.latitude === 'number' &&
        typeof report.longitude === 'number'
    );
  }, [reports]);

  return (
    <div>
      <PageHeader
        eyebrow="Safety"
        title="Safety Map"
        subtitle="View community safety reports and reported locations."
      />

      <div className="space-y-4">
        {loading && (
          <div className="soft-card p-6 text-center">
            Loading safety reports...
          </div>
        )}

        {error && (
          <div className="soft-card p-6 text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="soft-card p-6 text-center text-slate-500">
            No safety reports found.
          </div>
        )}

        {!loading && !error && validReports.length > 0 && (
          <div className="soft-card overflow-hidden">
            <MapArt
              reports={validReports}
              compact={false}
            />
          </div>
        )}

        {!loading && !error && validReports.length === 0 && reports.length > 0 && (
          <div className="soft-card p-6 text-center text-slate-500">
            Reports are available, but no report has valid map coordinates yet.
          </div>
        )}
      </div>

      {!loading && reports.length > 0 && (
        <div className="mt-4 soft-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-[#25304d]">
                Community Reports
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {reports.length} report{reports.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="badge success">
              Live Data
            </div>
          </div>
        </div>
      )}
    </div>
  );
}