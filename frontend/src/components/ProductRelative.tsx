// ProductRelative.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const ProductRelative: React.FC<{ currentProductId: string }> = ({ currentProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/get'); // API lấy tất cả sản phẩm
      if (!response.ok) {
        throw new Error('Không thể tải danh sách sản phẩm');
      }

      const data = await response.json();
      if (data.success) {
        // Chọn ngẫu nhiên 4 sản phẩm từ danh sách
        const randomProducts = data.data.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProducts(randomProducts);
      } else {
        setError('Không có sản phẩm');
      }
    } catch (error: any) {
      setError(error.message || 'Lỗi khi lấy dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentProductId) {
      fetchProducts();
    }
  }, [currentProductId]);
  

  if (loading) {
    return <div>Đang tải sản phẩm liên quan...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-lg text-red-500">{product.price} VNĐ</p>
            <Link
              to={`/product-details/${product.id}`}
              className="block text-center mt-2 text-blue-500"
            >
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRelative;
