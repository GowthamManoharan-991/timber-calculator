import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RequireRole from '../components/auth/RequireRole';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import Calculator from '../pages/Calculator';
import Quotation from '../pages/Quotation';
import History from '../pages/History';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import { ROLES } from '../utils/constants';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/calculator/:id" element={<Calculator />} />
        <Route path="/quotation/:id" element={<Quotation />} />
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireRole role={ROLES.ADMIN}>
              <Admin />
            </RequireRole>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
