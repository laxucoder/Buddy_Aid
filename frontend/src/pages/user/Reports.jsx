import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import {
  Plus,
  Search,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReportCard from '../../components/reports/ReportCard';
import { fetchReports } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';

export default function Reports() {
  const { show } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const response = await fetchReports();

      setReports(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load reports:', error);

      const message =
        error?.response?.data?.message ||
        'Failed to load reports';

      show(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const text = `
      ${report.city || ''}
      ${report.area || ''}
      ${report.category || ''}
      ${report.description || ''}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        eyebrow="Community Reports"
        title="Safety reports"
        subtitle="Browse, search and review community-submitted safety issues."
        action={
          <Link
            to="/reports/create"
            className="btn btn-primary"
          >
            <Plus size={15} />
            Create Report
          </Link>
        }
      />

      {/* Search & Filters */}
      <div className="soft-card p-3 mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 px-3 py-2 border border-[#eee1e8] rounded-xl">
          <Search
            size={14}
            className="text-[#9ca3b7]"
          />

          <input
            className="outline-none text-xs w-52"
            placeholder="Search reports…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {[
          'All',
          'Lighting',
          'Harassment',
          'Unsafe Area',
          'Other'
        ].map((category) => (
          <button
            key={category}
            className={`btn py-2 ${
              category === 'All'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="soft-card p-10 flex items-center justify-center gap-2">
          <Loader2
            size={18}
            className="animate-spin"
          />

          <span className="text-sm">
            Loading reports...
          </span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReports.length === 0 && (
        <div className="soft-card p-10 text-center">
          <p className="font-black text-[#25304d]">
            No reports found
          </p>

          <p className="text-xs text-[#7b849a] mt-1">
            Try creating a new safety report.
          </p>
        </div>
      )}

      {/* Reports */}
      {!loading && filteredReports.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredReports.map((report) => (
            <ReportCard
              key={report._id || report.id}
              report={report}
            />
          ))}
        </div>
      )}
    </div>
  );
}