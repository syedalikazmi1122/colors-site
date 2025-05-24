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
import Cart from "./Pages/Cart/index.jsx";
import SearchResults from "./Pages/SearchResults";
import AdminOrders from './Pages/admindashboard/Adminorders'
// import Cart from "./pages/Cart"
import CheckoutSuccess from "./Components/Cart/CheckoutSuccess.jsx";
import CheckoutCancel from "./Components/Cart/CheckoutCancel.jsx"
import './i18n'; // Import i18n configuration
import LanguageSelector from './Components/LanguageSelector.jsx';
import { CartProvider } from './Context/CartContext'

function App() {
  const isLoggedIn = useProfileAuthStore((state) => state.isLoggedIn);
  const role = useProfileAuthStore((state) => state.role);

  return (
    <CurrencyProvider>
      <CartProvider>
        <Router>
          <div className="App">
            {/* <LanguageSelector /> */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="category/:category" element={<CategoryPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<SearchResults />} />

              <Route
                path="/login"
                element={!isLoggedIn ? <Login /> : <Navigate to={role === "admin" ? "/admin-dashboard" : "/profile"} replace />}
              />
                <Route
                path="/cart"
                element={isLoggedIn ?<Cart/> : <Navigate to="/login" replace />}
              />
                <Route
                path="/checkout/success"
                element={isLoggedIn ? <CheckoutSuccess /> : <Navigate to="/login" replace />}
              />
              <Route path="/checkout/cancel" element={isLoggedIn ? <CheckoutCancel /> : <Navigate to="/login" replace />} />        
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
              <Route 
                path="/admin/orders"
                element={isLoggedIn && role === "admin" ? <AdminOrders /> : <Navigate to="/login" replace />}
              />

              <Route path="/products/:slug" element={<ProductInfo />} />
              <Route path="WishList" element={<Wishlist />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </CurrencyProvider>
  );
}

export default App;