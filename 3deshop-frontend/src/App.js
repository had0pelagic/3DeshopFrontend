import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Home from "./pages/HomePage";
import Layout from "./components/Layout";
import Login from "./pages/LoginPage";
import Account from "./pages/AccountPage";
import ProductDetails from "./pages/ProductDetailPage";
import Products from "./pages/ProductsPage";
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import ChangePassword from "./pages/ChangePasswordPage";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout page={<Home />} />} />
          <Route path="/register" element={<Layout page={<Register />} />} />
          <Route path="/login" element={<Layout page={<Login />} />} />
          <Route path="/account/:id" element={<Layout page={<Account />} />} />
          <Route path="/change-password/:id" element={<Layout page={<ChangePassword />} />} />
          <Route
            path="/product/:id"
            element={<Layout page={<ProductDetails />} />}
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout page={<Products />} />{" "}
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
