import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Home from "./pages/HomePage";
import Layout from "./components/Layout";
import Login from "./pages/LoginPage";
import Products from "./pages/ProductsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout page={<Home />} />} />
        <Route path="/register" element={<Layout page={<Register />} />} />
        <Route path="/login" element={<Layout page={<Login />} />} />
        <Route path="/products" element={<Layout page={<Products />} />} />
      </Routes>
    </Router>
  );
}
