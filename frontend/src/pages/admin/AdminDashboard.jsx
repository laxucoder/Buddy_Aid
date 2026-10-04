import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';

import {
  Users,
  FileText,
  ShieldAlert,
  LifeBuoy,
  TrendingUp,
} from 'lucide-react';

import { fetchAdminStats } from '../../services/adminService';
import { fetchReports } from '../../services/reportService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    activeEmergencies: 0,
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [statsResponse, reportsResponse] =
          await Promise.all([
            fetchAdminStats(),
            fetchReports(),
          ]);

        setStats(
          statsResponse?.data?.data || {
            totalUsers: 0,
            totalReports: 0,
            pendingReports: 0,
            activeEmergencies: 0,
          }
        );

        setReports(
          reportsResponse?.data?.data || []
        );
      } catch (error) {
        console.error(
          'Failed to load admin dashboard:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /*
   * Create monthly report statistics
   * from real MongoDB reports.
   */
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
  ];

  const monthlyCounts = months.map((month, index) => {
    const count = reports.filter((report) => {
      if (!report.createdAt) return false;

      const date = new Date(report.createdAt);

      return date.getMonth() === index;
    }).length;

    return count;
  });

  const maxReports = Math.max(
    ...monthlyCounts,
    1
  );

  return (
    <div>
      {/* ================= HEADER ================= */}

      <PageHeader
        eyebrow="Buddy Aid · Admin"
        title="Admin Dashboard"
        subtitle="Monitor users, reports, emergencies and support activity."
      />

      {/* ================= STAT CARDS ================= */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={loading ? '...' : stats.totalUsers}
          accent="pink"
        />

        <StatCard
          icon={FileText}
          label="Total Reports"
          value={loading ? '...' : stats.totalReports}
          accent="orange"
        />

        <StatCard
          icon={ShieldAlert}
          label="Active Emergencies"
          value={
            loading
              ? '...'
              : stats.activeEmergencies
          }
          accent="red"
        />

        <StatCard
          icon={LifeBuoy}
          label="Pending Reports"
          value={
            loading
              ? '...'
              : stats.pendingReports
          }
          accent="green"
        />
      </div>

      {/* ================= LOWER GRID ================= */}

      <div className="reports-grid mt-5">

        {/* ================= REPORT OVERVIEW ================= */}

        <div className="soft-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black">
                Reports Overview
              </div>

              <div className="muted text-[10px] mt-1">
                Real report activity from MongoDB
              </div>
            </div>

            <FileText
              size={17}
              className="text-[#f31f58]"
            />
          </div>

          <div className="h-48 flex items-end gap-5 border-b border-[#efe2e8] mt-5 px-3">
            {monthlyCounts.map((count, index) => {
              const height =
                count === 0
                  ? 4
                  : Math.max(
                      (count / maxReports) * 100,
                      8
                    );

              return (
                <div
                  className="flex-1 flex flex-col items-center gap-2"
                  key={months[index]}
                >
                  <div
                    className="w-full max-w-8 rounded-t-md gradient-primary"
                    style={{
                      height: `${height}%`,
                    }}
                    title={`${count} reports`}
                  />

                  <span className="text-[10px] muted">
                    {months[index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RECENT ACTIVITY ================= */}

        <div className="soft-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black">
                Recent Activity
              </div>

              <div className="muted text-[10px] mt-1">
                Latest community reports
              </div>
            </div>

            <TrendingUp
              size={17}
              className="text-emerald-500"
            />
          </div>

          <div className="space-y-3 mt-5">
            {loading ? (
              <div className="thin-card p-3 text-xs muted">
                Loading activity...
              </div>
            ) : reports.length === 0 ? (
              <div className="thin-card p-3 text-xs muted">
                No recent activity.
              </div>
            ) : (
              reports
                .slice(0, 4)
                .map((report) => (
                  <div
                    className="thin-card p-3 flex items-center gap-3"
                    key={
                      report._id ||
                      report.id
                    }
                  >
                    <div className="stat-icon bg-[#fff0f4] text-[#f31f58]">
                      <FileText size={15} />
                    </div>

                    <div className="min-w-0">
                      <div className="font-black text-xs truncate">
                        {report.title ||
                          'Safety report submitted'}
                      </div>

                      <div className="muted text-[10px] mt-1">
                        {report.location ||
                          'Location unavailable'}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}