import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import LandingPage from "./Pages/Home";
import CategoryPage from "./Pages/Category";
import { Login } from "./Pages/Login";
import { ProductInfo } from "./Pages/Product";
import { Signup } from "./Pages/Signup";
import  Dashboard from "./Pages/Dashboard/index.jsx";
import { AdminUpload } from "./Pages/UploadSVG/index.jsx";
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/category" element={<CategoryPage/>} />
        <Route path="/admin/upload" element={<AdminUpload/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Dashboard /> } />
        <Route path="/product" element={<ProductInfo/>} />
        <Route path="/category" element={<h1>Category</h1>} />
        <Route path="/category/:id" element={<h1>Category Details</h1>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
