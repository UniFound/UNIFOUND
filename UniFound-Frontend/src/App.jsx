import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TicketsPage from "./pages/TicketsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
