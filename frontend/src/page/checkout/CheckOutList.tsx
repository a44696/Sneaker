import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: string;
  image: string;
  stock: number;
  discount: number;
}

const CheckOutList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const quantity = parseInt(queryParams.get("quantity") || "1");
  console.log("🔎 productId từ URL:", productId);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    agree: false,
    paymentMethod: "bank",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch product details
  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/product/get-product-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: productId }),
      });
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  const discountedPrice = product.discount
    ? (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  const subtotal = (parseFloat(discountedPrice) * quantity).toFixed(2);
  const shippingCost = parseFloat(subtotal) >= 50 ? 0 : 5;
  const total = (parseFloat(subtotal) + shippingCost).toFixed(2);

  

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.phone) newErrors.phone = "Phone is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.agree) newErrors.agree = "You must agree to terms";
    return newErrors;
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    // Kiểm tra tính hợp lệ của form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    // Lấy thông tin từ form và tính toán lại tổng giá trị đơn hàng
    const orderData = {
      list_items: [
        {
          productId: product._id,
          quantity,
        },
      ],
      totalAmt: total,  // Tổng giá trị đơn hàng
      subTotalAmt: subtotal,  // Tổng giá trị chưa bao gồm phí vận chuyển
      addressId: form.address,  // Địa chỉ giao hàng từ form
    };
  
    try {
      // Gửi yêu cầu tạo đơn hàng
      const response = await fetch("http://localhost:8080/api/order/cash-on-delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // token xác thực
        },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Đặt hàng thành công!");
        navigate("/"); // Điều hướng đến trang cảm ơn
      } else {
        alert("Có lỗi xảy ra khi tạo đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!");
    }
  };
  

  return (
    <div className="flex justify-center p-8">
      {/* Billing Details Form */}
      <div className="w-2/3 mr-8">
        <h2 className="text-xl font-semibold mb-4">Billing details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First name *"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last name *"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
          <div className="col-span-2">
            <input
              type="text"
              name="address"
              placeholder="Street address *"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="Town / City *"
              value={form.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
          <div>
            <input
              type="text"
              name="state"
              placeholder="State *"
              value={form.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone *"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address *"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
        </div>
      </div>

      {/* Your Order Section */}
      <div className="w-1/3 bg-gray-100 p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Your order</h2>
        <h3 >Product</h3>
        <div className="border-b pb-4 mb-4">
          
          <div className="flex justify-between">
            <span className="font-bold">{product.name} x {quantity}</span>
            <span className="font-bold">{subtotal}  VNĐ</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Shipping:</span>
            {shippingCost === 0 ? <span className="font-bold">Free</span> : <span>{shippingCost} VNĐ</span>}
          </div>
        </div>
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>{total} VNĐ</span>
        </div>

        {/* Payment Methods */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={form.paymentMethod === "bank"}
              onChange={handleChange}
              className="mr-2"
            /> Direct Bank Transfer
          </label>
          <label className="flex items-center mt-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={form.paymentMethod === "cod"}
              onChange={handleChange}
              className="mr-2"
            /> Cash On Delivery
          </label>
        </div>

        {/* Agree to terms */}
        <div className="mb-4 text-sm">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mr-2 mt-1"
            /> I have read and agree to the website terms and conditions
          </label>
          {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}
        </div>

        {/* Place order button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-purple-600 text-white py-2 rounded-md"
        >
          Place order
        </button>
      </div>
    </div>
  );
};

export default CheckOutList;
