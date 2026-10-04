import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { ToastProvider } from './context/ToastContext';

import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Features from './pages/public/Features';
import HowItWorks from './pages/public/HowItWorks';
import SafetyGuidelines from './pages/public/SafetyGuidelines';
import FAQ from './pages/public/FAQ';
import Support from './pages/public/Support';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';
import EmergencyDisclaimer from './pages/public/EmergencyDisclaimer';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';

import Dashboard from './pages/user/Dashboard';
import Emergency from './pages/user/Emergency';
import LiveEmergency from './pages/user/LiveEmergency';
import EmergencyHistory from './pages/user/EmergencyHistory';
import Contacts from './pages/user/Contacts';
import SafetyMap from './pages/user/SafetyMap';
import Reports from './pages/user/Reports';
import CreateReport from './pages/user/CreateReport';
import ReportDetails from './pages/user/ReportDetails';
import Notifications from './pages/user/Notifications';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import Help from './pages/user/Help';

import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import ReportsAdmin from './pages/admin/Reports';
import Emergencies from './pages/admin/Emergencies';
import SupportTickets from './pages/admin/SupportTickets';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <EmergencyProvider>
          <Routes>

            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route
                path="/safety-guidelines"
                element={<SafetyGuidelines />}
              />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route
                path="/privacy-policy"
                element={<PrivacyPolicy />}
              />
              <Route path="/terms" element={<Terms />} />
              <Route
                path="/emergency-disclaimer"
                element={<EmergencyDisclaimer />}
              />
            </Route>

            {/* Authentication */}
            <Route path="/auth">
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-otp" element={<VerifyOTP />} />
            </Route>

            {/* User Protected Pages */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                  path="/emergency"
                  element={<Emergency />}
                />

                <Route
                  path="/emergency/live"
                  element={<LiveEmergency />}
                />

                <Route
                  path="/emergency/history"
                  element={<EmergencyHistory />}
                />

                <Route
                  path="/contacts"
                  element={<Contacts />}
                />

                <Route
                  path="/safety-map"
                  element={<SafetyMap />}
                />

                <Route
                  path="/reports"
                  element={<Reports />}
                />

                <Route
                  path="/reports/create"
                  element={<CreateReport />}
                />

                <Route
                  path="/reports/:id"
                  element={<ReportDetails />}
                />

                <Route
                  path="/notifications"
                  element={<Notifications />}
                />

                <Route
                  path="/profile"
                  element={<Profile />}
                />

                <Route
                  path="/settings"
                  element={<Settings />}
                />

                <Route
                  path="/help"
                  element={<Help />}
                />

              </Route>
            </Route>

            {/* Admin Protected Pages */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route element={<AdminLayout />}>

                <Route
                  path="/admin"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/admin/users"
                  element={<Users />}
                />

                <Route
                  path="/admin/reports"
                  element={<ReportsAdmin />}
                />

                <Route
                  path="/admin/emergencies"
                  element={<Emergencies />}
                />

                <Route
                  path="/admin/support"
                  element={<SupportTickets />}
                />

                <Route
                  path="/admin/settings"
                  element={<AdminSettings />}
                />

              </Route>
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </EmergencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}