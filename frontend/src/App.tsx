import { Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Layout from "./components/Layout/Layout";
import Cart from "./page/cart/Cart";
import CheckOutList from "./page/checkout/CheckOutList";
import { useState } from "react";

const App = () => {
  const [search, setSearch] = useState("");
  return (
    <Routes>
      <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
        <Route index element={<ProductList search={search} setSearch={setSearch}/>} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOutList />} />
      </Route>
      
    </Routes>
  );
};

export default App;
