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
import Orders from "./pages/OrderPage";
import OrderRegistration from "./pages/OrderRegistration";
import Offer from "./pages/OfferPage";
import UserOrders from "./pages/UserOrderPage";
import UserOffers from "./pages/UserOfferPage";
import UserJobs from "./pages/UserJobPage";
import JobProgress from "./pages/JobProgressPage";
import OrderDownload from "./pages/OrderDownloadPage";
import ErrorProvider from "./components/ErrorProvider";
import UserBalanceTopUp from "./pages/UserBalanceTopUpPage";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <Router>
      <ErrorProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout page={<Home />} />} />
            <Route path="/register" element={<Layout page={<Register />} />} />
            <Route path="/login" element={<Layout page={<Login />} />} />
            <Route
              path="/account/:id"
              element={<Layout page={<Account />} />}
            />
            <Route
              path="/user-profile/:id"
              element={
                <ProtectedRoute>
                  <Layout page={<UserProfile />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-balance-top-up/:id"
              element={
                <ProtectedRoute>
                  <Layout page={<UserBalanceTopUp />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-download/:id"
              element={
                <ProtectedRoute>
                  <Layout page={<OrderDownload />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-progress/:id"
              element={
                <ProtectedRoute>
                  <Layout page={<JobProgress />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offer/:id"
              element={
                <ProtectedRoute>
                  <Layout page={<Offer />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-jobs"
              element={
                <ProtectedRoute>
                  <Layout page={<UserJobs />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-offers/:id"
              element={
                <ProtectedRoute>
                  <Layout page={<UserOffers />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-orders/:id"
              element={
                <ProtectedRoute>
                  <Layout page={<UserOrders />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Layout page={<Orders />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-registration"
              element={
                <ProtectedRoute>
                  <Layout page={<OrderRegistration />} />
                </ProtectedRoute>
              }
            />
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
            <Route path="/products" element={<Layout page={<Products />} />} />
          </Routes>
        </AuthProvider>
      </ErrorProvider>
    </Router>
  );
}
