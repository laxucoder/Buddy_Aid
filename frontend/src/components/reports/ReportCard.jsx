import {
  MapPin,
  Heart,
  Clock,
  FileText
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';

export default function ReportCard({ report }) {
  // Get location text safely
  const locationText =
    report.area && report.city
      ? `${report.area}, ${report.city}`
      : report.area ||
        report.city ||
        'Location not provided';

  // Get report title safely
  const title =
    report.title ||
    report.category ||
    'Safety Report';

  // Get status safely
  const status =
    report.status ||
    'Pending';

  // Format date safely
  const reportDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      )
    : 'Recently';

  // Get report ID
  const reportId =
    report._id || report.id;

  return (
    <div className="thin-card p-3 flex gap-3">

      {/* Image / Placeholder */}
      {report.img || report.imageUrl ? (
        <img
          src={report.img || report.imageUrl}
          alt={title}
          className="w-16 h-14 rounded-xl object-cover"
        />
      ) : (
        <div className="w-16 h-14 rounded-xl flex items-center justify-center bg-[#fff0f4] shrink-0">
          <FileText
            size={20}
            className="text-[#f31f58]"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">

        {/* Title + Status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-sm truncate">
            {title}
          </h3>

          <StatusBadge status={status} />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-[11px] muted mt-1">
          <MapPin size={12} />

          <span className="truncate">
            {locationText}
          </span>
        </div>

        {/* Description */}
        {report.description && (
          <p className="text-[11px] muted mt-2 line-clamp-2">
            {report.description}
          </p>
        )}

        {/* Bottom information */}
        <div className="flex items-center gap-3 text-[11px] muted mt-2">

          <span className="flex items-center gap-1">
            <Clock size={11} />
            {reportDate}
          </span>

          <span className="flex items-center gap-1">
            <Heart size={11} />
            {report.votes || 0}
          </span>

          {reportId && (
            <Link
              to={`/reports/${reportId}`}
              className="ml-auto text-[#f31f58] font-black"
            >
              View
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}