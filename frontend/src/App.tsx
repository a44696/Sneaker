import { StrictMode } from 'react';
import CreatePayment from './page/checkout/CreatePayment.tsx';
import VnpayReturn from './page/checkout/PaymentReturn.tsx';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import authProvider from './admin/component/authProvider.tsx'; 
import CustomLayout from './admin/layouts/default';
import StaffCustomLayout from './staff/layouts/default';
import { ProductList, CategoryCreate, CategoryEdit, UserList, Category, ProductEdit, UserEdit, OrderShow, ProductCreate, OrderList } from './admin/pages/Page';
import { StaffProductList,  StaffOrderShow, StaffProductCreate, StaffOrderList, StaffProductEdit } from './staff/pages/Page';
import myDataProvider from './admin/component/customDataProvider';
import Login from './admin/component/login';
import Dashboard from './admin/pages/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductListPage from "./components/ProductList";  // Frontend page
import ProductDetails from "./components/ProductDetails";
import Layout from "./components/Layout/Layout";
import Cart from "./page/cart/Cart";
import CheckOutList from "./page/checkout/CheckOutList";
import SearchResults from "./page/search/SearchResults";
import AuthPage from "./page/auth/AuthPage";
import SignInPage from "./page/auth/SignInPage";
import ForgotPasswordPage from "./page/auth/ForgotPasswordPage";
import VerifyOtpPage from "./page/auth/VerifyOtpPage";
import ResetPasswordPage from "./page/auth/ResetPasswordPage";
import VerifyEmailPage from "./page/auth/VerifyEmailPage";
import UserProfile from "./page/user/Profile";
import { useState } from "react";
import HomePage from './page/home/Home.tsx';
import Order from './page/user/Order.tsx';
 export default function App() {
  const [search, setSearch] = useState("");

  return (
    <StrictMode>
      <Router>
        <Routes>
          {/* Các route frontend */}
          <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
            <Route index element={<HomePage />} />
            <Route path="/shop" element= {<ProductListPage search={search} setSearch={setSearch} />}/>
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/search-product" element={<SearchResults search={search} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckOutList />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-order" element={<Order />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<SignInPage />} />
          </Route>

          {/* Các route authentication */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/payment-qr" element={<CreatePayment />} />
          <Route path="/payment-return" element={<VnpayReturn />} />
        </Routes>
      </Router>
      <Router basename="/admin">
       <Routes>
      {/* Định tuyến vào Admin */}
      <Route
        path="/*"
        element={
          <Admin
            authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            dataProvider={myDataProvider}
            layout={CustomLayout}
             // Phần này cần đồng bộ với Router basename
          >
            <CustomRoutes>
              {/* Điều hướng chính xác đến /admin/dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </CustomRoutes>

            {/* Resource tương ứng */}
            <Resource name="dashboard" options={{ label: 'Dashboard' }} />
            <Resource name="product" list={ProductList} create={ProductCreate} edit={ProductEdit} />
            <Resource name="user" list={UserList} edit={UserEdit} />
            <Resource name="category" list={Category} edit={CategoryEdit} create={CategoryCreate} />
            <Resource name="order" list={OrderList} edit={OrderShow} />
          
          </Admin>
        }
      />
    </Routes>
  </Router>
  <Router basename="/staff">
       <Routes>
      {/* Định tuyến vào Staff */}
      <Route
        path="/*"
        element={
          <Admin
            authProvider={authProvider}
            loginPage={Login}
            dataProvider={myDataProvider}
            layout={StaffCustomLayout}
             // Phần này cần đồng bộ với Router basename
          >
            <CustomRoutes>
              {/* Điều hướng chính xác đến /admin/dashboard */}
              <Route path="/" element={<Navigate to="/product" replace />} />       
            </CustomRoutes>
            {/* Resource tương ứng */}
            <Resource name="product" list={StaffProductList} create={StaffProductCreate} edit={StaffProductEdit} />
            <Resource name="order" list={StaffOrderList} edit={StaffOrderShow} />
          
          </Admin>
        }
      />
    </Routes>
  </Router>
    </StrictMode>
  );
}


