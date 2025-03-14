import React, { useState } from "react";
import { FaUser, FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ search, setSearch }) => {
  // Trạng thái để theo dõi số lượt thích
  const [likedCount, setLikedCount] = useState(0);

  // Hàm xử lý khi nhấn vào biểu tượng yêu thích
  const handleLikeClick = () => {
    setLikedCount(likedCount + 1); // Tăng số lượt thích lên 1
  };

  const handleSearchClick = () => {
    // Khi nhấn vào biểu tượng tìm kiếm, bạn có thể thực hiện hành động tìm kiếm
    
    // Bạn có thể thực hiện gọi API hoặc xử lý tìm kiếm tại đây
  };

  return (
    <div>
      <div className="flex justify-center">
        <span className="text-white bg-purple-600 w-full text-center justify-center">
          FREE delivery & 40% Discount for next 3 orders! Place your 1st order in.
        </span>
      </div>
      <header className="bg-white shadow-md px-6">
        {/* Top Bar */}
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

        {/* Main Header */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/assets/img1.png" alt="Lucky Larks" className="w-12 h-12" />
              <h1 className="text-2xl font-bold ml-2 text-purple-500">Lucky Larks</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center border rounded-md px-2 py-2 w-2/5 bg-gray-100">
            <input
              type="text"
              placeholder="Search for products, categories or brands..."
              className="ml-2 bg-transparent w-full outline-none"
              value={search} // Gán giá trị của search vào input
              onChange={(e) => setSearch(e.target.value)} // Cập nhật giá trị tìm kiếm
            />
          </div>

          {/* Account and Cart */}
          <div className="flex items-center gap-10 text-gray-700">
            {/* Biểu tượng tìm kiếm */}
            <a href="#" className="flex items-center gap-1 hover:text-gray-900" onClick={handleSearchClick}>
              <FaSearch className="text-gray-500" />
            </a>
            <a href="#" className="flex items-center gap-3 hover:text-gray-900">
              <FaUser /> Sign In <br className="font-bold" /> Account
            </a>
            {/* Biểu tượng yêu thích với số lượt thích */}
            <a href="#" className="relative hover:text-gray-900" onClick={handleLikeClick}>
              <FaHeart />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {likedCount}
              </span>
            </a>
            <Link to="/cart" className="relative hover:text-gray-900">
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">0</span>
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="border-t px-6 flex justify-between">
        

          <ul className="flex gap-6 py-3 text-gray-700 font-medium">
            <li><Link to="/" className="hover:text-red-500">Home ▾</Link></li>
            <li><Link to="/shop" className="hover:text-red-500">Shop ▾</Link></li>
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
