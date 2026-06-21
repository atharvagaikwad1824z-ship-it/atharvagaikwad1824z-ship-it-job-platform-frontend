import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { loginUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      login(res.data.user, res.data.token);

      toast.success("Login Successful 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome User 👋</h2>
      <p className="login-subtitle">Login to continue</p>

      <form onSubmit={handleSubmit} className="login-form">
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

        {/* Password */}
        <div>
          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

        {/* Button */}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p className="register-text">
        Don't have an account?{" "}
        <Link className="register-link" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
