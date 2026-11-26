import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser } from "../../Features/auth/auth";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Shield } from "lucide-react";
import registerHero from "../../assets/images/register-hero.jpg";
import "./Register.css";

type RegisterForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: "onTouched" });

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    setLoading(true);
    try {
      await registerUser(data);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-glow" />
      <div className="register-wrapper">
        <div className="register-image-side">
          <img src={registerHero} alt="Join us" className="register-image" />
          <div className="register-image-overlay" />
          <div className="register-image-text">
            <Shield className="register-image-icon" size={32} />
            <h2>Join the</h2>
            <h1>Admin<span>Panel</span></h1>
            <p>Create your account and take control of your portfolio</p>
          </div>
        </div>

        <div className="register-form-side">
          <button type="button" onClick={() => navigate("/")} className="register-back-btn">
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div className="register-header">
            <div className="register-logo">
              <span className="register-logo-text">
                Admin<span className="register-logo-highlight">Panel</span>
              </span>
            </div>
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Register to start managing your portfolio</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="register-form" noValidate>
            {error && <div className="register-error">{error}</div>}

            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="firstName">First Name</label>
                <div className={`register-input-wrapper ${errors.firstName ? "has-error" : ""}`}>
                  <User className="register-input-icon" size={18} />
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First name"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: { value: 2, message: "Too short" },
                    })}
                  />
                </div>
                {errors.firstName && <span className="register-error-text">{errors.firstName.message}</span>}
              </div>

              <div className="register-form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className={`register-input-wrapper ${errors.lastName ? "has-error" : ""}`}>
                  <User className="register-input-icon" size={18} />
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last name"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: { value: 2, message: "Too short" },
                    })}
                  />
                </div>
                {errors.lastName && <span className="register-error-text">{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="middleName">Middle Name <span className="optional">(Optional)</span></label>
              <div className="register-input-wrapper">
                <User className="register-input-icon" size={18} />
                <input
                  type="text"
                  id="middleName"
                  placeholder="Middle name"
                  {...register("middleName")}
                />
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email Address</label>
              <div className={`register-input-wrapper ${errors.email ? "has-error" : ""}`}>
                <Mail className="register-input-icon" size={18} />
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
              {errors.email && <span className="register-error-text">{errors.email.message}</span>}
            </div>

            <div className="register-form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className={`register-input-wrapper ${errors.phoneNumber ? "has-error" : ""}`}>
                <Phone className="register-input-icon" size={18} />
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+\d][\d\s\-().]{6,}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                />
              </div>
              {errors.phoneNumber && <span className="register-error-text">{errors.phoneNumber.message}</span>}
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password</label>
              <div className={`register-input-wrapper ${errors.password ? "has-error" : ""}`}>
                <Lock className="register-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Create a strong password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Include upper, lower & number",
                    },
                  })}
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="register-error-text">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="register-login">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;