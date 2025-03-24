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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex space-x-6 mb-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === "info" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} rounded-md`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === "password" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} rounded-md`}
        >
          Change Password
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 text-lg font-semibold ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} rounded-md`}
        >
          Order History
        </button>
      </div>

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
              className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
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
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email || ""}
              disabled
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && <div className="text-red-500 mt-2">{error}</div>} {/* Hiển thị thông báo lỗi nếu có */}

          <div className="mt-6">
            <button
              onClick={handleSaveChanges}
              className="w-full py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "password" && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="mt-4">
            <button
              onClick={handleSavePasswordChanges}
              className="w-full py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
            >
              Save Password
            </button>
          </div>
        </div>
      )}
      {activeTab === "orders" && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order History</h3>
          {/* Nội dung lịch sử đơn hàng sẽ thêm sau */}
        </div>
      )}
    </div>
  );
};

export default Profile;
