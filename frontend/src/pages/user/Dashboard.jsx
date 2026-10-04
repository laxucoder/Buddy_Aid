import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  MapPin,
  TriangleAlert,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import MapArt from '../../components/common/MapArt';
import StatusBadge from '../../components/reports/StatusBadge';
import EmergencyButton from '../../components/emergency/EmergencyButton';

import { useAuth } from '../../context/AuthContext';
import { fetchReports } from '../../services/reportService';

export default function Dashboard() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoadingReports(true);

        const response = await fetchReports();

        const data = response?.data?.data || [];

        setReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load reports:', error);
        setReports([]);
      } finally {
        setLoadingReports(false);
      }
    };

    loadReports();
  }, []);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <PageHeader
        eyebrow="User Dashboard"
        title={`Good Evening, ${
          user?.name?.split(' ')[0] || 'there'
        }! 👋`}
        subtitle="Stay safe, stay connected with your community."
        action={<EmergencyButton />}
      />

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          icon={Users}
          label="Active Contacts"
          value="3"
          accent="pink"
        />

        <StatCard
          icon={FileText}
          label="Total Reports"
          value={loadingReports ? '...' : reports.length}
          accent="orange"
        />

        <StatCard
          icon={MapPin}
          label="Safety Score"
          value="8.5/10"
          accent="green"
        />

        <StatCard
          icon={TriangleAlert}
          label="Recent Alerts"
          value={Math.min(reports.length, 3)}
          accent="red"
        />
      </div>

      {/* ================= MAIN DASHBOARD GRID ================= */}
      <div className="dashboard-grid">
        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-4">
          {/* ================= NEARBY SAFETY REPORTS ================= */}
          <div className="soft-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-black">
                  Nearby Safety Reports
                </h2>

                <p className="muted text-[11px] mt-1">
                  Latest community activity around you
                </p>
              </div>

              <Link
                to="/reports"
                className="text-[#f31f58] text-[11px] font-black"
              >
                View All
              </Link>
            </div>

            {/* REAL MAP */}
            <MapArt compact />

            {/* REAL REPORTS */}
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              {loadingReports ? (
                <div className="thin-card p-3 text-xs muted sm:col-span-2">
                  Loading safety reports...
                </div>
              ) : reports.length === 0 ? (
                <div className="thin-card p-3 text-xs muted sm:col-span-2">
                  No safety reports available yet.
                </div>
              ) : (
                reports.slice(0, 2).map((report) => (
                  <Link
                    key={report._id || report.id}
                    to={`/reports/${report._id || report.id}`}
                    className="thin-card p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-black text-xs">
                          {report.title || 'Safety Report'}
                        </div>

                        <div className="muted text-[10px] mt-1">
                          {report.location ||
                            'Location unavailable'}
                        </div>
                      </div>

                      <StatusBadge
                        status={report.status || 'pending'}
                      />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ================= QUICK ACTIONS ================= */}
          <div className="soft-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black">Quick Actions</h2>

              <span className="badge bg-[#f1f5ff] text-[#4d72d7]">
                4 tools
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {[
                [
                  ShieldAlert,
                  'Start Emergency',
                  '/emergency',
                  'bg-[#fff0f1] text-[#e9344e]',
                ],
                [
                  MapPin,
                  'Open Safety Map',
                  '/safety-map',
                  'bg-[#edf4ff] text-[#4d72d7]',
                ],
                [
                  Plus,
                  'Report a Problem',
                  '/reports/create',
                  'bg-[#fff1e5] text-[#ec8317]',
                ],
                [
                  Users,
                  'Emergency Contacts',
                  '/contacts',
                  'bg-[#f2efff] text-[#7b55d8]',
                ],
              ].map(([Icon, title, to, colorClass]) => (
                <Link
                  key={title}
                  to={to}
                  className="thin-card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition"
                >
                  <div className={`stat-icon ${colorClass}`}>
                    <Icon size={17} />
                  </div>

                  <div>
                    <div className="font-black text-xs">
                      {title}
                    </div>

                    <div className="muted text-[10px] mt-1">
                      Open tool{' '}
                      <ArrowRight
                        className="inline"
                        size={10}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="soft-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-black">Recent Alerts</h2>

              <p className="muted text-[11px] mt-1">
                Latest community reports
              </p>
            </div>

            <Link
              to="/notifications"
              className="text-[#f31f58] text-[11px] font-black"
            >
              View All
            </Link>
          </div>

          {/* REAL REPORT ALERTS */}
          <div className="space-y-2">
            {loadingReports ? (
              <div className="thin-card p-3 text-xs muted">
                Loading latest alerts...
              </div>
            ) : reports.length === 0 ? (
              <div className="thin-card p-3 text-xs muted">
                No recent alerts.
              </div>
            ) : (
              reports.slice(0, 3).map((report) => (
                <Link
                  key={report._id || report.id}
                  to={`/reports/${report._id || report.id}`}
                  className="thin-card p-3 flex gap-3"
                >
                  <div className="stat-icon bg-[#fff2e4] text-[#ed8518]">
                    <TriangleAlert size={16} />
                  </div>

                  <div className="min-w-0">
                    <div className="font-black text-xs">
                      {report.title || 'Safety report added'}
                    </div>

                    <div className="muted text-[10px] mt-1">
                      {report.location ||
                        'Location unavailable'}
                    </div>

                    {report.status && (
                      <div className="mt-2">
                        <StatusBadge status={report.status} />
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}