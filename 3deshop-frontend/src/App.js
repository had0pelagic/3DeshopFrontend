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
import PurchasedProducts from "./pages/PurchasedProductsPage";
import Upload from "./pages/UploadPage";
import ProductDownload from "./pages/ProductDownloadPage";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout page={<Home />} />} />
          <Route path="/register" element={<Layout page={<Register />} />} />
          <Route path="/login" element={<Layout page={<Login />} />} />
          <Route path="/account/:id" element={<Layout page={<Account />} />} />
          <Route
            path="/upload-product"
            element={
              <ProtectedRoute>
                <Layout page={<Upload />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password/:id"
            element={
              <ProtectedRoute>
                <Layout page={<ChangePassword />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-downloads/:id"
            element={
              <ProtectedRoute>
                <Layout page={<PurchasedProducts />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <Layout page={<ProductDetails />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-download/:id"
            element={
              <ProtectedRoute>
                <Layout page={<ProductDownload />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout page={<Products />} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
