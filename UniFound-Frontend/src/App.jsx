import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LostItems from "./pages/LostItemsPage";
import FoundItemsPage from "./pages/FoundItemsPage";
import ReportItemPage from "./pages/ReportItemPage";
import AboutPage from "./pages/AboutPage";
import UserProfile from "./pages/UserProfile";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import TicketsPage from "./pages/TicketsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lostItem" element={<LostItems />} />
        <Route path="/foundItem" element={<FoundItemsPage />} />
        <Route path="/report" element={<ReportItemPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        
        

        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
