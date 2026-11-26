import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../../Features/auth/auth";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import loginHero from "../../assets/images/login-hero.jpg";
import "./Login.css";

type LoginForm = { email: string; password: string };

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ mode: "onTouched" });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      const response = await loginUser(data);
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-wrapper">
        <div className="login-image-side">
          <img src={loginHero} alt="Admin portal" className="login-image" />
          <div className="login-image-overlay" />
          <div className="login-image-text">
            <Shield className="login-image-icon" size={32} />
            <h2>Welcome Back to</h2>
            <h1>Admin<span>Panel</span></h1>
            <p>Your all-in-one portfolio management platform</p>
          </div>
        </div>

        <div className="login-form-side">
          <button type="button" onClick={() => navigate("/")} className="login-back-btn">
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div className="login-header">
            <div className="login-logo">
              <span className="login-logo-text">
                Admin<span className="login-logo-highlight">Panel</span>
              </span>
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            {error && <div className="login-error">{error}</div>}

            <div className="login-form-group">
              <label htmlFor="email">Email Address</label>
              <div className={`login-input-wrapper ${errors.email ? "has-error" : ""}`}>
                <Mail className="login-input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && <span className="login-error-text">{errors.email.message}</span>}
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className={`login-input-wrapper ${errors.password ? "has-error" : ""}`}>
                <Lock className="login-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="login-error-text">{errors.password.message}</span>}
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="login-forgot">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="login-register">
              Don&apos;t have an account? <Link to="/register">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;