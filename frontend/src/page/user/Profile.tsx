import React, { useState, useEffect } from "react";
import { Button, TextField, Avatar, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { Link } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

interface User {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
}

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  const handleChangePassword = async () => {
    // try {
    //   const response = await axios.put("http://localhost:8080/api/user/change-password", {
    //     userId: user?._id,
    //     oldPassword,
    //     newPassword,
    //   });

    //   if (response.data.success) {
    //     alert("Đổi mật khẩu thành công!");
    //     setOpenChangePassword(false);
    //     setOldPassword("");
    //     setNewPassword("");
    //   } else {
    //     throw new Error(response.data.message || "Lỗi không xác định");
    //   }
    // } catch (err) {
    //   console.error("Lỗi khi đổi mật khẩu:", err);
    //   alert("Đổi mật khẩu thất bại! Vui lòng thử lại.");
    // }
  };
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", user?._id || "");

        const response = await axios.put("http://localhost:8080/api/user/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        
        if (response.data.success) {
            alert("Cập nhật ảnh đại diện thành công!");
            setUser((prevUser) => prevUser ? { ...prevUser, avatar: response.data.data.avatar } : prevUser);
            localStorage.setItem("user", JSON.stringify({ 
                ...JSON.parse(localStorage.getItem("user") || "{}"), 
                avatar: response.data.data.avatar 
            }));
            window.location.reload();
        } else {
            throw new Error(response.data.message || "Lỗi không xác định");
        }
    } catch (err) {
        console.error("Lỗi khi tải ảnh lên:", err);
        alert("Tải ảnh thất bại! Vui lòng thử lại.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put("http://localhost:8080/api/user/update-profile", {
        id: user?._id,
        phone: phoneNumber,
        address: address,
      });
  
      if (response.data.success) {
        alert("Thay đổi thành công!");
        
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          const updatedUser = { ...prevUser, mobile: phoneNumber, address };
          localStorage.setItem("user", JSON.stringify(updatedUser)); 
          return updatedUser;
        });
  
      } else {
        throw new Error(response.data.message || "Lỗi không xác định");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Cập nhật thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Account</h2>
        <ul className="space-y-4">
          <li className="text-blue-500 font-semibold">Profile</li>
          <li className="text-gray-500 hover:text-blue-500 cursor-pointer">
            <Link to="/user-order">Order</Link>
          </li>
        </ul>
      </div>

      {/* Profile Card */}
      <div className="flex-1 p-8">
        <Card className="shadow-lg rounded-lg">
          <CardContent>
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-r from-blue-300 to-yellow-100 rounded-t-lg flex flex-col items-center -mt-1">
                <Avatar
                  src={user?.avatar || "/cover-images/default-avatar.jpg"}
                  className="!w-28 !h-28 border-4 border-white shadow-md !mt-4"
                />
                <label className="mt-2">
                  <Button variant="contained" component="span">
                    Change Photo
                  </Button>
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handlePhotoChange} />
                </label>
                <h2 className="text-xl font-semibold text-gray-800 mt-2">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Form nhập thông tin */}
            <div className="mt-6 space-y-4">
              <TextField fullWidth label="Phone Number" variant="outlined" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <TextField fullWidth label="Address" variant="outlined" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            {/* Nút Save */}
            <div className="grid grid-cols-2 gap-6 mt-6">
             <Button onClick={() => setOpenChangePassword(true)} variant="contained" color="secondary" fullWidth>
                Change Password
              </Button>
              <Button onClick={handleSaveChanges} variant="contained" color="primary" fullWidth>
                Save Changes
              </Button>
             
            </div>
            
            
          </CardContent>
        </Card>
      </div>
      <Dialog open={openChangePassword} onClose={() => setOpenChangePassword(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="dense"
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePassword(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary" variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
