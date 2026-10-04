import { useEffect, useState } from 'react';

import {
  Trash2,
  Loader2,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/reports/StatusBadge';

import {
  fetchReports,
  deleteReport,
  moderateReport,
} from '../../services/reportService';

import { useToast } from '../../context/ToastContext';

export default function Reports() {
  const { show } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [filter, setFilter] = useState('All');

  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNote, setAdminNote] = useState('');

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

      show(
        error?.response?.data?.message ||
          'Failed to load reports',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this report?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteReport(id);

      setReports((prev) =>
        prev.filter((report) => report._id !== id)
      );

      if (selectedReport?._id === id) {
        setSelectedReport(null);
      }

      show('Report deleted successfully');
    } catch (error) {
      console.error('Delete report error:', error);

      show(
        error?.response?.data?.message ||
          'Failed to delete report',
        'error'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleModerate = async (status) => {
    if (!selectedReport?._id) {
      return;
    }

    try {
      setUpdatingId(selectedReport._id);

      const response = await moderateReport(
        selectedReport._id,
        {
          status,
          adminNote: adminNote.trim(),
        }
      );

      const updatedReport = response.data?.data;

      if (updatedReport) {
        setReports((prev) =>
          prev.map((report) =>
            report._id === updatedReport._id
              ? updatedReport
              : report
          )
        );

        setSelectedReport(updatedReport);
      }

      show(`Report marked as ${status}`);

      setAdminNote('');
    } catch (error) {
      console.error('Moderate report error:', error);

      show(
        error?.response?.data?.message ||
          'Failed to update report',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports =
    filter === 'All'
      ? reports
      : reports.filter(
          (report) => report.status === filter
        );

  const getLocation = (report) => {
    if (report.area && report.city) {
      return `${report.area}, ${report.city}`;
    }

    return (
      report.area ||
      report.city ||
      'Location not provided'
    );
  };

  const getDate = (report) => {
    if (!report.createdAt) {
      return 'Recently';
    }

    return new Date(
      report.createdAt
    ).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Reports Management"
        subtitle="Review and moderate community submissions."
      />

      <div className="soft-card p-3">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[
            'All',
            'Pending',
            'Under Review',
            'Verified',
            'Resolved',
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`btn py-2 ${
                filter === status
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
            >
              {status}
            </button>
          ))}

          <button
            type="button"
            onClick={loadReports}
            className="btn btn-outline py-2 ml-auto"
            disabled={loading}
          >
            <RefreshCw
              size={14}
              className={
                loading ? 'animate-spin' : ''
              }
            />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2">
            <Loader2
              size={18}
              className="animate-spin"
            />

            <span className="text-sm">
              Loading reports...
            </span>
          </div>
        ) : filteredReports.length === 0 ? (
          /* Empty */
          <div className="py-12 text-center">
            <p className="font-black text-[#25304d]">
              No reports found
            </p>

            <p className="text-xs text-[#7b849a] mt-1">
              There are no reports in this category.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map(
                  (report, index) => (
                    <tr key={report._id}>

                      {/* Number */}
                      <td>
                        #{String(index + 1).padStart(3, '0')}
                      </td>

                      {/* Category */}
                      <td className="font-black">
                        {report.category || 'Other'}
                      </td>

                      {/* Location */}
                      <td>
                        {getLocation(report)}
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge
                          status={
                            report.status || 'Pending'
                          }
                        />
                      </td>

                      {/* Date */}
                      <td>
                        {getDate(report)}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex flex-wrap gap-2">

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReport(report);
                              setAdminNote(
                                report.adminNote || ''
                              );
                            }}
                            className="btn btn-outline py-2"
                          >
                            <Eye size={14} />
                            Review
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(report._id)
                            }
                            disabled={
                              deletingId === report._id
                            }
                            className="btn btn-outline py-2 text-[#f31f58]"
                          >
                            {deletingId === report._id ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={14} />
                            )}

                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Panel */}
      {selectedReport && (
        <div className="soft-card p-6 mt-5">

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black text-[#f31f58] uppercase tracking-wider">
                Report Review
              </div>

              <h2 className="text-xl font-black mt-1">
                {selectedReport.category || 'Community Report'}
              </h2>

              <p className="text-sm text-[#7b849a] mt-1">
                {getLocation(selectedReport)}
              </p>
            </div>

            <StatusBadge
              status={
                selectedReport.status || 'Pending'
              }
            />
          </div>

          {/* Description */}
          <div className="mt-5">
            <p className="text-xs font-black text-[#25304d]">
              Description
            </p>

            <div className="mt-2 rounded-2xl bg-[#f8f9fc] border border-[#edf0f5] p-4 text-sm text-[#59637a] leading-6">
              {selectedReport.description ||
                'No description provided.'}
            </div>
          </div>

          {/* Admin Note */}
          <div className="mt-5">
            <label className="text-xs font-black text-[#25304d]">
              Admin Note
            </label>

            <textarea
              value={adminNote}
              onChange={(e) =>
                setAdminNote(e.target.value)
              }
              placeholder="Add a note about this moderation decision..."
              rows={3}
              className="field mt-2 w-full resize-none"
            />
          </div>

          {/* Moderation Actions */}
          <div className="flex flex-wrap gap-2 mt-5">

            <button
              type="button"
              onClick={() =>
                handleModerate('Under Review')
              }
              disabled={
                updatingId === selectedReport._id
              }
              className="btn btn-outline py-2"
            >
              {updatingId === selectedReport._id ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Clock3 size={14} />
              )}

              Under Review
            </button>

            <button
              type="button"
              onClick={() =>
                handleModerate('Verified')
              }
              disabled={
                updatingId === selectedReport._id
              }
              className="btn btn-outline py-2"
            >
              <CheckCircle2 size={14} />
              Verify
            </button>

            <button
              type="button"
              onClick={() =>
                handleModerate('Resolved')
              }
              disabled={
                updatingId === selectedReport._id
              }
              className="btn btn-primary py-2"
            >
              <CheckCircle2 size={14} />
              Resolve
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedReport(null);
                setAdminNote('');
              }}
              className="btn btn-outline py-2 ml-auto"
            >
              <XCircle size={14} />
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}