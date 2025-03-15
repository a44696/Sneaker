import { Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Layout from "./components/Layout/Layout";
import { useState } from "react";
import SearchResults from "./page/search/SearchResults";

const App = () => {
  const [search, setSearch] = useState("");
  return (
    <Routes>
      <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
        <Route index element={<ProductList search={search} setSearch={setSearch}/>} />
        <Route path="/search-product" element={<SearchResults search={search} />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
      </Route>
      
    </Routes>
  );
};

export default App;
