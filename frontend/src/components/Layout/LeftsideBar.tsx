import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LeftsideBar = () => {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('Tất cả sản phẩm');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả sản phẩm');
  const navigate = useNavigate();

  // Hàm thay đổi thương hiệu đã chọn
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    // Chuyển hướng sang trang tìm kiếm với thương hiệu được chọn
    const queryParams = new URLSearchParams({
      query: brand !== 'Tất cả sản phẩm' ? brand : '', // Chỉ thêm thương hiệu vào query khi không phải "Tất cả sản phẩm"
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      brand: brand,
      status: selectedStatus,
    });
    navigate(`/search-product?${queryParams.toString()}`);
  };

  // Hàm thay đổi trạng thái sản phẩm đã chọn
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    // Chuyển hướng sang trang tìm kiếm với trạng thái được chọn
    const queryParams = new URLSearchParams({
      query: '', // Truy vấn sản phẩm theo trạng thái không cần thiết, chỉ cần status
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      brand: selectedBrand,
      status: status,
    });
    navigate(`/search-product?${queryParams.toString()}`);
  };

  // Hàm gọi API và chuyển hướng đến trang kết quả tìm kiếm khi lọc giá
  const handleFilter = () => {
    const queryParams = new URLSearchParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      brand: selectedBrand,
      status: selectedStatus,
    });

    navigate(`/search-product?${queryParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <aside className="col-span-1 bg-gray-100 p-4 rounded">
          {/* Bộ lọc giá */}
          <div className="mb-4">
            <h2 className="text-lg font-bold">Widget price filter</h2>
            <div className="flex justify-between text-sm">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                className="w-16 p-1 border rounded"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                className="w-16 p-1 border rounded"
                placeholder="Max"
              />
            </div>
            <button
              onClick={handleFilter}  // Gọi handleFilter khi nhấn nút Filter
              className="mt-2 w-full bg-gray-300 p-2 rounded fw-bold"
            >
              Filter
            </button>
          </div>

          {/* Danh mục sản phẩm */}
          <div className="mb-4">
            <h2 className="text-lg font-bold">Product Categories</h2>
            {['Tất cả sản phẩm', 'Nike', 'Puma', 'Adidas', 'Vans', 'Converse', 'Bape', 'Supreme', 'Jordan', 'Yeezy', 'New Balance', 'Asics'].map(
              (brand) => (
                <div key={brand} className="flex items-center">
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    checked={selectedBrand === brand}
                    onChange={() => handleBrandChange(brand)}
                    className="mr-2"
                  />
                  <label htmlFor={brand} className="text-gray-700">{brand}</label>
                </div>
              )
            )}
          </div>

          {/* Trạng thái sản phẩm */}
          <div className="mb-4">
            <h2 className="text-lg font-bold">Product Status</h2>
            <div className="flex items-center">
              <input
                type="radio"
                id="allProducts"
                name="productStatus"
                checked={selectedStatus === "Tất cả sản phẩm"}
                onChange={() => handleStatusChange("Tất cả sản phẩm")}
                className="mr-2"
              />
              <label htmlFor="allProducts" className="text-gray-700">Tất cả sản phẩm</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="inStock"
                name="productStatus"
                checked={selectedStatus === "In Stock"}
                onChange={() => handleStatusChange("In Stock")}
                className="mr-2"
              />
              <label htmlFor="inStock" className="text-gray-700">In Stock</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="onSale"
                name="productStatus"
                checked={selectedStatus === "On Sale"}
                onChange={() => handleStatusChange("On Sale")}
                className="mr-2"
              />
              <label htmlFor="onSale" className="text-gray-700">On Sale</label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LeftsideBar;
