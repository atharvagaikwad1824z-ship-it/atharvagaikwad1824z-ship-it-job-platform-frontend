import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    // later: connect API here
    toast.success("Profile Updated Successfully ✅");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Please fill all password fields ❌");
      return;
    }

    // later: connect API here
    toast.success("Password Updated Successfully 🔒");

    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      <p className="profile-subtitle">
        Manage your account information and security.
      </p>

      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <img
            src={user?.profilePic || user?.companyLogo || defaultAvatar}
            alt="Profile"
            className="profile-avatar"
          />

          <div>
            <h3>{user?.name}</h3>
            <p className="profile-role">{user?.role}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form className="profile-form" onSubmit={handleProfileUpdate}>
          <h3 className="section-title">Personal Information</h3>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="profile-btn">
            Update Profile
          </button>
        </form>

        {/* Password Form */}
        <form className="profile-form" onSubmit={handlePasswordChange}>
          <h3 className="section-title">Change Password</h3>

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="profile-btn">
            Update Password
          </button>
        </form>

        {/* Upload Profile Picture (UI only for now) */}
        <div className="upload-box">
          <h3 className="section-title">Upload Profile Picture</h3>
          <input type="file" />
          {/*<p className="upload-note">
            (This will be connected to backend later)
          </p>*/}
        </div>
      </div>
    </div>
  );
}

export default Profile;
