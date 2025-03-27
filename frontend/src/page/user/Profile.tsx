import React, { useState, useEffect } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string>(""); 
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  


  const [error, setError] = useState<string | null>(null); // State to store error messages

  const handleSaveChanges = () => {
    // Kiểm tra số điện thoại hợp lệ
    const phoneRegex = /^[0-9]{10,15}$/; // Định dạng số điện thoại (có thể thay đổi tùy theo yêu cầu)
    if (!phoneRegex.test(phoneNumber)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      return;
    }

    // Lưu các thay đổi vào localStorage
    localStorage.setItem("address", address);
    localStorage.setItem("phoneNumber", phoneNumber);

    // Hiển thị thông báo thành công
    alert("Thay đổi thành công!");

    console.log("Changes saved successfully");
  };

  const handleSavePasswordChanges = () => {
    if (newPassword === confirmPassword) {
      console.log("Password changed successfully");
      alert("Mật khẩu đã thay đổi thành công.");
    } else {
      console.log("Passwords do not match");
      alert("Mật khẩu mới và mật khẩu xác nhận không trùng khớp.");
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUsername(parsedUserInfo.name);
      setEmail(parsedUserInfo.email);
    } else {
      console.log("No user info found.");
    }

    const storedAvatar = localStorage.getItem('avatar');
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }

    const storedAddress = localStorage.getItem("address");
    if (storedAddress) {
      setAddress(storedAddress);
    }

    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result as string;
        setAvatar(avatarUrl);
        localStorage.setItem('avatar', avatarUrl); // Lưu avatar vào localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/order/order-list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi lấy danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
  
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);
  

  return (
    <div className="flex max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="w-1/4 border-r pr-4">
        <button onClick={() => setActiveTab("info")} className={`font-serif block w-full text-left p-3 mb-2 rounded ${activeTab === "info" ? "bg-purple-500 text-white" : "bg-gray-200"}`}>Personal Information</button>
        <button onClick={() => setActiveTab("password")} className={`font-serif block w-full text-left p-3 mb-2 rounded ${activeTab === "password" ? "bg-purple-500 text-white" : "bg-gray-200"}`}>Change Password</button>
        <button onClick={() => setActiveTab("orders")} className={`font-serif block w-full text-left p-3 rounded ${activeTab === "orders" ? "bg-purple-500 text-white" : "bg-gray-200"}`}>Order History</button>
      </div>
      <div>
        {activeTab === "info" && (
          <div>
            <div className="flex items-center gap-4">
              <img
                src={avatar || "/cover-images/default-avatar.jpg"}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-gray-300"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{username || "Username"}</h2>
                <p className="text-sm text-gray-600">{email || "Email"}</p>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => document.getElementById('avatarInput')?.click()}
                className="px-6 py-3 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition duration-200"
              >
                Change Photo
              </button>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username || ""}
                disabled
                className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email || ""}
                disabled
                className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>} {/* Hiển thị thông báo lỗi nếu có */}

            <div className="mt-6">
              <button
                onClick={handleSaveChanges}
                className="w-full py-3 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold  text-gray-800 mb-4">Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <div className="mt-4">
              <button
                onClick={handleSavePasswordChanges}
                className="w-full py-3 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600 transition duration-200"
              >
                Save Password
              </button>
            </div>
          </div>
        )}
        {activeTab === "orders" && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order History</h3>

            {loading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border">Order ID</th>
                    <th className="py-2 px-4 border">Total Amount</th>
                    <th className="py-2 px-4 border">Payment Status</th>
                    <th className="py-2 px-4 border">Delivery Address</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="text-center">
                      <td className="py-2 px-4 border">{order.orderId}</td>
                      <td className="py-2 px-4 border">${order.totalAmt}</td>
                      <td className="py-2 px-4 border">{order.payment_status}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          )} 
      </div>  
    </div>
  );
};

export default Profile;
