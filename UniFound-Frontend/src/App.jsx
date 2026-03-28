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
import LostItems from "./pages/LostItemsPage";
import FoundItemsPage from "./pages/FoundItemsPage";
import ReportItemPage from "./pages/ReportItemPage";
import AboutPage from "./pages/AboutPage";
import UserProfile from "./pages/UserProfile";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import TicketsPage from "./pages/TicketsPage";
import AdminTicketsPage from "./pages/AdminTicketsPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/user-form" element={<UserForm />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/lostItem" element={<LostItems />} />
        <Route path="/foundItem" element={<FoundItemsPage />} />
        <Route path="/report" element={<ReportItemPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        

        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/ticket/:ticketId" element={<TicketDetailsPage />} />
        <Route path="/admin/tickets" element={<AdminTicketsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
