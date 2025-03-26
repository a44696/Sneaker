import React, { useEffect, useState } from "react";
import { FaUser, FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import axios from "axios";

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ search, setSearch }) => {
  const [likedCount, setLikedCount] = useState(0);
  const [user, setUser] = useState<{ name: string; avatar: string | null } | null>(null);
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);


  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    const storedUser = storedUserString && storedUserString !== "undefined" ? JSON.parse(storedUserString) : null;

    if (storedUser) {
      setUser({ name: storedUser.name, avatar: storedUser.avatar });
    }
  }, [localStorage.getItem("user")]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleLikeClick = () => {
    setLikedCount(likedCount + 1);
  };

  const handleSearchClick = () => {
    const queryParams = new URLSearchParams({
      search: search
    });
    navigate(`/search-product?${queryParams.toString()}`);
  };

  const fetchProductOptions = async (input: string) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/api/product/search-product", { search: input });
      setProductOptions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product options", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.length >= 2) {
      fetchProductOptions(search);
    } else {
      setProductOptions([]);
    }
  }, [search]);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  useEffect(() => {
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);


  return (
    <div>
      <div className="flex justify-center">
        <span className="text-white bg-purple-600 w-full text-center justify-center">
          FREE delivery & 40% Discount for next 3 orders! Place your 1st order in.
        </span>
      </div>
      <header className="bg-white shadow-md px-6">
        <div className="border-b">
          <div className="flex justify-between items-center px-6 py-2 text-sm text-gray-600">
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-gray-800">About Us</Link>
              <a href="#" className="hover:text-gray-800">My Account</a>
              <a href="#" className="hover:text-gray-800">Wishlist</a>
              <span className="text-gray-200">|</span>
              <span className="text-red-500">
                We deliver to you every day from <strong>7:00 to 23:00</strong>
              </span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-800">English ▾</a>
              <a href="#" className="hover:text-gray-800">USD ▾</a>
              <a href="#" className="hover:text-gray-800">Order Tracking</a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/assets/img1.png" alt="Lucky Larks" className="w-12 h-12" />
              <h1 className="text-2xl font-bold ml-2 text-purple-500">Lucky Larks</h1>
            </Link>
          </div>

          <div className="flex items-center border rounded-md px-2 py-2 w-2/5 bg-gray-100">
          <Autocomplete
                    className="w-full"
                    freeSolo
                    options={productOptions.map((product: any) => product.name)}
                    loading={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search for products, categories or brands..."
                        variant="standard"
                        onChange={(e) => setSearch(e.target.value)} // Khi nhập tay
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSearch(newValue); // Ghi nhận giá trị được chọn từ popup
                      }
                    }}
                  />
            <button onClick={handleSearchClick}>
              <FaSearch className="text-gray-500" />
            </button>
          </div>


          <div className="flex items-center gap-10 text-gray-700">
            <a href="#" className="flex items-center gap-1 hover:text-gray-900" onClick={handleSearchClick}>
              <FaSearch className="text-gray-500" />
            </a>
            {user ? (
              <div className="relative group">
                <img src={user.avatar || "/default-avatar.png"} alt="User Avatar" className="w-8 h-8 rounded-full cursor-pointer" />
                <div className="hidden group-hover:block absolute right-0 bg-white shadow-md rounded-md w-40 py-2">
                  <button onClick={() => navigate("/user-profile")} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    {user.name}
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-gray-900">
                <FaUser /> Sign Up / Login
              </Link>
            )}
            <a href="#" className="relative hover:text-gray-900" onClick={handleLikeClick}>
              <FaHeart />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {likedCount}
              </span>
            </a>
            <Link to="/cart" className="relative hover:text-gray-900">
            <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="border-t px-6 flex justify-between">
          <ul className="flex gap-6 py-3 text-gray-700 font-medium">
            <li><Link to="/home" className="hover:text-red-500">Home ▾</Link></li>
            <li><Link to="/" className="hover:text-red-500">Shop ▾</Link></li>
            <li><Link to="/sneakers" className="hover:text-red-500">Sneakers</Link></li>
            <li><Link to="/accessories" className="hover:text-red-500">Clothes & Accessories</Link></li>
            <li><Link to="/blog" className="hover:text-red-500">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-red-500">Contact</Link></li>
          </ul>

          <div className="flex gap-6 py-3 text-gray-700 font-medium">
            <a href="#" className="hover:text-gray-800">Trending Products ▾</a>
            <a href="#" className="hover:text-red-500 text-red-500 flex gap-2">
              <div className="px-2 rounded-md bg-red-500 text-white px-3 py-1">Sale</div>
              <span>▾</span>
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;