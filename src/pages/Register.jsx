import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("candidate");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      await registerUser({ name, email, password, role });

      toast.success("Registration Successful 🎉 Please Login!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <p className="register-subtitle">Join JobPlatform and start today 🚀</p>

      <form className="register-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Role Cards */}
        <div>
          <label>Select Role</label>
          <div className="role-cards">
            <div
              className={`role-card ${role === "candidate" ? "active" : ""}`}
              onClick={() => setRole("candidate")}
            >
              <h4>Candidate</h4>
              <p>Find jobs & apply</p>
            </div>

            <div
              className={`role-card ${role === "employer" ? "active" : ""}`}
              onClick={() => setRole("employer")}
            >
              <h4>Employer</h4>
              <p>Post jobs & hire</p>
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label>Confirm Password</label>
          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Button */}
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>

      {/* Login */}
      <p className="login-text">
        Already have an account?{" "}
        <Link className="login-link" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
