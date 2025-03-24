import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: [string];
    stock: number;
    discount: number;
  };
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // ✅ Lấy danh sách giỏ hàng từ API
  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/cart/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();
      console.log("🔥 API trả về giỏ hàng:", data);

      if (data.success) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Cập nhật số lượng sản phẩm
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch("http://localhost:8080/api/cart/update-qty", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`!,
        },
        body: JSON.stringify({ _id: itemId, qty: newQuantity }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Cập nhật thất bại");

      // 🔄 Sau khi cập nhật, gọi lại API để lấy dữ liệu mới nhất
      await fetchCart();
    } catch (error: any) {
      alert("Cập nhật số lượng thất bại: " + error.message);
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  // 🗑️ Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/cart/delete-cart-item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ _id: itemId }),
      });

      if (!response.ok) throw new Error("Xóa sản phẩm thất bại");

      // 🔄 Sau khi xóa, gọi lại API để lấy dữ liệu mới nhất
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };
  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/cart/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Xóa giỏ hàng thất bại");
      }
  
      setCartItems([]); // Cập nhật lại cartItems về mảng rỗng sau khi xóa
      console.log("🛒 Giỏ hàng đã được xóa thành công.");
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      alert("Lỗi khi xóa giỏ hàng sau khi đặt hàng.");
    }
  };
  const createOrder = async () => {
    const user = localStorage.getItem("user"); // Lấy userId từ localStorage
    const userId = user ? JSON.parse(user)._id : null;
    if (!userId) {
      alert("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      return;
    }
  
    const products = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    const totalAmt = cartItems.reduce((sum, item) => {
      const priceAfterDiscount =
        item.productId.price * (1 - item.productId.discount / 100);
      return sum + priceAfterDiscount * item.quantity;
    }, 0);
  
    try {
      const response = await fetch("http://localhost:8080/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ userId, products, totalAmt }), // Truyền userId từ localStorage
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Đặt hàng thành công!");
        await clearCart();
        
      } else {
        alert("Đặt hàng thất bại: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tạo order:", error);
      alert("Đã xảy ra lỗi khi đặt hàng.");
    }
  };
  if (loading) return <div>Đang tải giỏ hàng...</div>;

  if (cartItems.length === 0) return <div>Giỏ hàng của bạn đang trống.</div>;

  // 🔥 Tính tổng tiền
  const totalPrice = cartItems.reduce((sum, item) => {
    const priceAfterDiscount =
      item.productId.price * (1 - item.productId.discount / 100);
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h2>
      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center border-b py-4">
          <img
            src={item.productId.image[0]} 
            alt={item.productId.name}
            className="w-24 h-24 object-cover mr-4"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{item.productId.name}</h3>
            <p className="text-gray-600">
              Giá:{" "}
              <span className="text-red-500 font-bold">
                {(item.productId.price * (1 - item.productId.discount / 100)).toFixed(2)}{" "}
                VNĐ
              </span>
              {item.productId.discount > 0 && (
                <span className="text-gray-400 line-through ml-2">
                  {item.productId.price} VNĐ
                </span>
              )}
            </p>

            {/* Nút tăng giảm số lượng */}
            <div className="flex items-center mt-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="px-2 py-1 bg-gray-300 text-gray-700 rounded-l"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 border">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-300 text-gray-700 rounded-r"
                disabled={item.quantity >= item.productId.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Xóa sản phẩm */}
          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-500 font-semibold ml-4"
          >
            ❌ Xóa
          </button>
        </div>
      ))}

      {/* Tổng tiền */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-bold">Tổng tiền: {totalPrice.toFixed(2)} VNĐ</p>
        <button
          onClick={createOrder}
          className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
        >
          Đặt Hàng
        </button>
      </div>
    </div>
  );
};

export default Cart;
