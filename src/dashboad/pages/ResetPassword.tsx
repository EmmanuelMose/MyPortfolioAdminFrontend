import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { verifyResetCode, resetPassword } from "../../Features/auth/auth";
import { Eye, EyeOff, Lock, Mail, Key, ArrowLeft } from "lucide-react";
import "./ResetPassword.css";

type ResetForm = {
  email: string;
  code: string;
  newPassword: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({ mode: "onTouched" });

  const onSubmit = async (data: ResetForm) => {
    setError("");
    setLoading(true);
    try {
      await verifyResetCode(data.email, data.code);
      await resetPassword(data.email, data.newPassword);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-glow" />
      <div className="reset-wrapper">
        <div className="reset-card">
          <button type="button" onClick={() => navigate("/login")} className="reset-back-btn">
            <ArrowLeft size={14} />
            Back to Login
          </button>

          <div className="reset-header">
            <h2 className="reset-title">Reset Password</h2>
            <p className="reset-subtitle">Enter your details to reset your password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="reset-form" noValidate>
            {error && <div className="reset-error">{error}</div>}

            <div className="reset-form-group">
              <label htmlFor="email">Email Address</label>
              <div className={`reset-input-wrapper ${errors.email ? "has-error" : ""}`}>
                <Mail className="reset-input-icon" size={14} />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
              </div>
              {errors.email && <span className="reset-error-text">{errors.email.message}</span>}
            </div>

            <div className="reset-form-group">
              <label htmlFor="code">6-Digit Code</label>
              <div className={`reset-input-wrapper ${errors.code ? "has-error" : ""}`}>
                <Key className="reset-input-icon" size={14} />
                <input
                  type="text"
                  id="code"
                  placeholder="000000"
                  maxLength={6}
                  {...register("code", {
                    required: "Code is required",
                    pattern: { value: /^\d{6}$/, message: "Enter a 6-digit code" },
                  })}
                />
              </div>
              {errors.code && <span className="reset-error-text">{errors.code.message}</span>}
            </div>

            <div className="reset-form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className={`reset-input-wrapper ${errors.newPassword ? "has-error" : ""}`}>
                <Lock className="reset-input-icon" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="New password"
                  {...register("newPassword", {
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
                  className="reset-password-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.newPassword && <span className="reset-error-text">{errors.newPassword.message}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="reset-login">
              Remember your password? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;