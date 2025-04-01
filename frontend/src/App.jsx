import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import LandingPage from "./Pages/Home";
import CategoryPage from "./Pages/Category";
import { Login } from "./Pages/Login";
import { ProductInfo } from "./Pages/Product";
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/category" element={<CategoryPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<ProductInfo/>} />
        <Route path="/category" element={<h1>Category</h1>} />
        <Route path="/category/:id" element={<h1>Category Details</h1>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
