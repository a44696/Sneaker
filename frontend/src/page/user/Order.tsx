import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[];
}
interface Order {
  _id: string;
  orderId: string;
  products: {
    productId: Product;
    quantity: number;
    size: number;
  }[];
  createdAt: string;
  totalAmt: number;
  payment_status: string;
  fulfillment_status: string;
}
interface User {
  _id: string;
  avatar: string;
  name: string;
  email: string;
}
const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchOrders(parsedUser._id);
    }
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/order/order-list",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Account</h2>
        <ul className="space-y-4">
          <li className="text-gray-500 hover:text-blue-500 cursor-pointer">
            <Link to="/user-profile">Profile</Link>
          </li>
          <li className="text-blue-500 font-semibold">Order</li>
        </ul>
      </div>

      {/* Order List */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
        <p className="text-gray-600 mt-4">Click on an order to view details.</p>

        <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-center">Quantity</th>
                <th className="py-3 px-6 text-center">Total Price</th>
                <th className="py-3 px-6 text-center">Created At</th>
                <th className="py-3 px-6 text-center">Payment</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-3 px-6">{`#${order.orderId}`}</td>
                  <td className="py-3 px-6 text-center">
                    {order.products.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="py-3 px-6 text-center font-semibold">
                    ${order.totalAmt.toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        order.payment_status === "CASH ON DELIVERY"
                          ? "bg-green-100 text-green-700"
                          : order.payment_status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center text-gray-500 py-4">No orders found.</p>}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/5">
              <h2 className="text-2xl font-bold">Order ID: {selectedOrder.orderId}</h2>
              <p className="text-gray-500 text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>

              <div className="mt-4">
                <h3 className="text-xl font-semibold">Order Items</h3>
                {selectedOrder.products.map((item, index) => {
                
                    return (
                        <div key={index} className="flex items-center border-b py-3">
                            {item.productId ? (
                            
                                <div  className="flex items-center w-full">
                                <img
                                    src={item.productId?.image?.[0]} // Kiểm tra nếu image là mảng
                                    alt={item.productId?.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">{item.productId?.name}</p>
                                    <p className="text-gray-500">{`Size: ${item.size}`}</p>
                                    <p className="text-gray-500">
                                    {item.quantity} x ${item.productId?.price.toLocaleString()}
                                    </p>
                                </div>
                                
                                <div className="ml-auto font-semibold">
                                    ${(item.quantity * item.productId?.price).toLocaleString()}
                                </div>
                                </div>
                            ) : (
                            // Nếu productId không phải mảng, xử lý như object (nếu có lỗi API)
                            <div className="text-red-500">Dữ liệu sản phẩm không hợp lệ</div>
                            )}
                        </div>
                        )
                })}
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Order Summary</h3>
                <p>Subtotal: ${selectedOrder.totalAmt.toLocaleString()}</p>
                <p>Shipping: Free</p>
                <p className="font-bold text-lg">Total: ${selectedOrder.totalAmt.toLocaleString()}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
