import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Your Home component
import CustomerRegister from "./components/CustomerRegister";
import AdminRegister from "./components/AdminRegister";
import Login from "./components/Login";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        {/* Define your nested routes here */}
        <Route path="customerregister" element={<CustomerRegister />} />
        <Route path="adminregister" element={<AdminRegister />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
