import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserForm from "./pages/UserForm";
import UsersPage from "./pages/Users";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import LostItems from "./pages/LostItemsPage";
import FoundItemsPage from "./pages/FoundItemsPage";
import ReportItemPage from "./pages/ReportItemPage";
import AboutPage from "./pages/AboutPage";
import UserProfile from "./pages/UserProfile";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import AdminClaims from "./pages/AdminClaims";
import RegisterPage from "./pages/Register";
import ClaimHistory from "./pages/ClaimHistory";
import AutoMatchView from "./pages/AutoMatchView";
import ChatPage from "./pages/ChatPage";
import ClaimTracking from "./pages/ClaimTracking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/user-form" element={<UserForm />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/lostItem" element={<LostItems />} />
        <Route path="/foundItem" element={<FoundItemsPage />} />
        <Route path="/report" element={<ReportItemPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/myclaims" element={<ClaimHistory />} />
        <Route path="/chat/:claimId" element={<ChatPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/ticket/:ticketId" element={<TicketDetailsPage />} />
        <Route path="/claim-details/:id" element={<ClaimTracking />} />
      </Routes>
    </Router>
  );
}

export default App;
