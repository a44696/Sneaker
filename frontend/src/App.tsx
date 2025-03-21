import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Layout from "./components/Layout/Layout";
import Cart from "./page/cart/Cart";
import CheckOutList from "./page/checkout/CheckOutList";
import { useState } from "react";
import SearchResults from "./page/search/SearchResults";
import AuthPage from "./page/auth/AuthPage";
import SignInPage from "./page/auth/SignInPage";
import ForgotPasswordPage from "./page/auth/ForgotPasswordPage";
import VerifyOtpPage from "./page/auth/VerifyOtpPage";
import ResetPasswordPage from "./page/auth/ResetPasswordPage";
import VerifyEmailPage from "./page/auth/VerifyEmailPage";


const App = () => {
  const [search, setSearch] = useState("");

  return (
    
    <>
      <Router>
      <Routes>
      {/* Các route React Router khác */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
        <Route index element={<ProductList search={search} setSearch={setSearch} />} />
        <Route path="/search-product" element={<SearchResults search={search} />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignInPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOutList />} />
      </Route>
    </Routes>
    </Router>
    </>
    
  );
};

export default App;
