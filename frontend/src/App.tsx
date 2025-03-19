import { Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Layout from "./components/Layout/Layout";
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
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/signin" element={<SignInPage/>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Thêm route cho Forgot Password */}
      <Route path="/verify-otp" element={<VerifyOtpPage />} /> {/* Thêm route cho Verify OTP */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
        <Route index element={<ProductList search={search} setSearch={setSearch}/>} />
        <Route path="/search-product" element={<SearchResults search={search} />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        
      </Route>
      
    </Routes>
  );
};

export default App;
