import React, { useEffect, useState } from "react";
import { FaShieldAlt, FaShoppingCart, FaWallet } from "react-icons/fa";
import { useNavigate,useParams } from "react-router-dom"; // Import useParams để lấy params từ URL
import ProductRelative from "./ProductRelative";

interface Product {
  _id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  stock: number;
  discount: number;  // Thêm thuộc tính discount
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy productId từ URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // Số lượng mặc định là 1
  const navigate = useNavigate();

  const fetchProductDetails = async (productId: string) => { // ✅ Nhận id làm tham số
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/products/get-product-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }), // ✅ Truyền id vào body
      });
  
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu sản phẩm');
      }
  
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        setError('Sản phẩm không tìm thấy');
      }
    } catch (error: any) {
      setError(error.message || 'Lỗi khi lấy dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  
  // Gọi API mỗi khi id thay đổi
  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]); // ✅ Theo dõi id
  

  const handleAddToCart = async () => {
    if (!product) return;
  
    try {
      const response = await fetch("http://localhost:8080/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu có đăng nhập
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("✅ Thêm vào giỏ hàng thành công!", data.cart);
        navigate("/cart"); // Chuyển hướng đến giỏ hàng
      } else {
        console.error("⚠️ Lỗi khi thêm vào giỏ hàng:", data.message);
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối API:", error);
    }
  };

  // Hàm tăng số lượng
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }

  // Tính giá sau khi giảm giá
  const discountedPrice = product.discount
    ? (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2)
    : product.price;
  
  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="text-gray-400">Home</span> &gt; <span className="font-semibold">{product.name}</span>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover mb-4"
          />
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          
          {/* Hiển thị giá và giảm giá */}
          <div className="mb-4">
            {product.discount ? (
              <p className="text-xl text-red-500 font-bold mb-4">
                {discountedPrice} VNĐ
                <span className="text-gray-500 line-through ml-2">{product.price} VNĐ</span>
              </p>
            ) : (
              <p className="text-xl text-red-500 font-bold mb-4">{product.price} VNĐ</p>
            )}
          </div>

          <p className="mb-4">Còn lại: {product.stock} sản phẩm</p>
          
          {/* Phần số lượng */}
          <div className="flex items-center mb-4">
            <button 
              onClick={decreaseQuantity} 
              className="p-2 bg-gray-300 text-gray-700 rounded-l"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly // Chỉ đọc, không cho thay đổi trực tiếp
              className="p-2 w-16 text-center border border-gray-300"
              min="1"
              max={product.stock}
            />
            <button 
              onClick={increaseQuantity} 
              className="p-2 bg-gray-300 text-gray-700 rounded-r"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
          <div className="flex">
            <button onClick={handleAddToCart} className="p-3 bg-green-500 text-white rounded-md flex">
              <FaShoppingCart className="mr-2" />Add To Cart
            </button>
            <button className="p-3 mx-5 bg-black text-white rounded-md flex">
              <FaShoppingCart className="mr-2" />
              Buy Now
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-md text-gray-700 my-4">
             <div className="flex items-center gap-2">
                <FaWallet className="text-xl" />
                <p className="text-sm">
                  <strong>Payment.</strong> Thanh toán khi nhận hàng, quét mã QR, hoặc thanh toán online với -5% ưu đãi.
                </p>
              </div>
              <hr className="my-2" />
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-xl" />
                  <p className="text-sm">
                  <strong>Warranty.</strong> Chính sách bảo hành theo quy định của nhà sản xuất.
                  </p>
                </div>
            </div>
          </div>
      </div>
      <ProductRelative currentProductId={id!} />
    </div>
  );
};

export default ProductDetails;
