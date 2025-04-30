import React from "react";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import LandingPage from "./Pages/Home";
import CategoryPage from "./Pages/Category";
import { Login } from "./Pages/Login";
import {ProductInfo}  from "./Pages/Product";
import { Signup } from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard/index.jsx";
import { AdminUpload } from "./Pages/UploadSVG/index.jsx";
import useProfileAuthStore from "./Zustand/profileAuthStore.js";
import { Wishlist } from "./Pages/Wishlist/index.jsx";
import { AdminDashboard } from "./Pages/admindashboard/index.jsx";
import { CurrencyProvider } from "./Context/CurrencyContext";

function App() {
  const isLoggedIn = useProfileAuthStore((state) => state.isLoggedIn);
  const role = useProfileAuthStore((state) => state.role);

  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to={role === "admin" ? "/admin-dashboard" : "/profile"} replace />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin/upload"
            element={isLoggedIn && role === "admin" ? <AdminUpload /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin-dashboard"
            element={isLoggedIn && role === "admin" ? <AdminDashboard /> : <Navigate to="/login" replace />}
          />

          <Route path="/products/:slug" element={<ProductInfo />} />
          <Route path="WishList" element={<Wishlist />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;