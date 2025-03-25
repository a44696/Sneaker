import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@mui/material'; 
import Button from '@mui/material/Button';
const LeftsideBar = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [selectedBrand, setSelectedBrand] = useState<string>('Tất cả sản phẩm');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả sản phẩm');
  const navigate = useNavigate();

  // Hàm thay đổi thương hiệu đã chọn
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    // Chuyển hướng sang trang tìm kiếm với thương hiệu được chọn
    const queryParams = new URLSearchParams({
      query: brand !== 'Tất cả sản phẩm' ? brand : '', // Chỉ thêm thương hiệu vào query khi không phải "Tất cả sản phẩm"
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      brand: brand,
      status: selectedStatus,
    });
    navigate(`/search-product?${queryParams.toString()}`);
  };
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]); // Cập nhật giá trị slider
  };
  // Hàm thay đổi trạng thái sản phẩm đã chọn
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    // Chuyển hướng sang trang tìm kiếm với trạng thái được chọn
    const queryParams = new URLSearchParams({
      query: '', // Truy vấn sản phẩm theo trạng thái không cần thiết, chỉ cần status
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      brand: selectedBrand,
      status: status,
    });
    navigate(`/search-product?${queryParams.toString()}`);
  };

  // Hàm gọi API và chuyển hướng đến trang kết quả tìm kiếm khi lọc giá
  const handleFilter = () => {
    const queryParams = new URLSearchParams({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      brand: selectedBrand,
      status: selectedStatus,
    });

    navigate(`/search-product?${queryParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-4 mb-2">
      <div>
        <aside className="col-span-1 bg-gray-100 p-4 rounded">
          {/* Bộ lọc giá */}
          <div className="mb-4">
      <h2 className="text-lg font-bold">Widget price filter</h2>

      <div className="mt-4">
        <Slider
          value={priceRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000000}
          step={1000}
          size="small"
          color="secondary"
       
        />
      </div>

   

    
      <Button variant="contained" color="secondary" className="w-full  p-2 rounded fw-bold" onClick={handleFilter}>Filter</Button>
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
