import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserForm from "./pages/UserForm";
import UsersPage from "./pages/Users";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import AuditLogs from "./pages/AuditLogs";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/user-form" element={<UserForm />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;
