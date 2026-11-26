import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { forgotPassword, verifyResetCode, resetPassword } from "../../Features/auth/auth";
import { Mail, Key, Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import "./ForgetPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const step1 = useForm<{ email: string }>({ mode: "onTouched" });
  const step2 = useForm<{ code: string }>({ mode: "onTouched" });
  const step3 = useForm<{ newPassword: string; confirmPassword: string }>({ mode: "onTouched" });

  const handleSendCode = async (data: { email: string }) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setSuccess("Reset code sent to your email");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (data: { code: string }) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await verifyResetCode(email, data.code);
      setSuccess("Code verified successfully");
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: { newPassword: string; confirmPassword: string }) => {
    setError("");
    setSuccess("");
    if (data.newPassword !== data.confirmPassword) {
      step3.setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, data.newPassword);
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-glow" />
      <div className="forgot-wrapper">
        <div className="forgot-card">
          <button type="button" onClick={() => navigate("/login")} className="forgot-back-btn">
            <ArrowLeft size={18} />
            Back to Login
          </button>

          <div className="forgot-header">
            <div className="forgot-logo">
              <Shield className="forgot-logo-icon" size={24} />
              <span className="forgot-logo-text">
                Admin<span className="forgot-logo-highlight">Panel</span>
              </span>
            </div>
            <h2 className="forgot-title">Forgot Password</h2>
            <p className="forgot-subtitle">Reset your admin account password</p>
          </div>

          <div className="forgot-steps">
            <div className={`forgot-step ${step >= 1 ? "active" : ""}`}>1</div>
            <div className={`forgot-step-line ${step >= 2 ? "active" : ""}`} />
            <div className={`forgot-step ${step >= 2 ? "active" : ""}`}>2</div>
            <div className={`forgot-step-line ${step >= 3 ? "active" : ""}`} />
            <div className={`forgot-step ${step >= 3 ? "active" : ""}`}>
              {step > 3 ? <CheckCircle size={16} /> : 3}
            </div>
          </div>

          {error && <div className="forgot-error">{error}</div>}
          {success && <div className="forgot-success">{success}</div>}

          {step === 1 && (
            <form onSubmit={step1.handleSubmit(handleSendCode)} className="forgot-form" noValidate>
              <p className="forgot-step-text">Enter your email to receive a 6-digit reset code.</p>
              <div className="forgot-form-group">
                <label htmlFor="email">Email Address</label>
                <div className={`forgot-input-wrapper ${step1.formState.errors.email ? "has-error" : ""}`}>
                  <Mail className="forgot-input-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    {...step1.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                </div>
                {step1.formState.errors.email && (
                  <span className="forgot-error-text">{step1.formState.errors.email.message}</span>
                )}
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={step2.handleSubmit(handleVerifyCode)} className="forgot-form" noValidate>
              <p className="forgot-step-text">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
              <div className="forgot-form-group">
                <label htmlFor="code">Reset Code</label>
                <div className={`forgot-input-wrapper ${step2.formState.errors.code ? "has-error" : ""}`}>
                  <Key className="forgot-input-icon" size={18} />
                  <input
                    type="text"
                    id="code"
                    placeholder="000000"
                    maxLength={6}
                    {...step2.register("code", {
                      required: "Code is required",
                      minLength: { value: 6, message: "Must be 6 digits" },
                      maxLength: { value: 6, message: "Must be 6 digits" },
                      pattern: { value: /^\d{6}$/, message: "Digits only" },
                    })}
                  />
                </div>
                {step2.formState.errors.code && (
                  <span className="forgot-error-text">{step2.formState.errors.code.message}</span>
                )}
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={step3.handleSubmit(handleResetPassword)} className="forgot-form" noValidate>
              <p className="forgot-step-text">Code verified. Enter your new password.</p>

              <div className="forgot-form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className={`forgot-input-wrapper ${step3.formState.errors.newPassword ? "has-error" : ""}`}>
                  <Lock className="forgot-input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="New password"
                    {...step3.register("newPassword", {
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
                    className="forgot-password-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {step3.formState.errors.newPassword && (
                  <span className="forgot-error-text">{step3.formState.errors.newPassword.message}</span>
                )}
              </div>

              <div className="forgot-form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`forgot-input-wrapper ${step3.formState.errors.confirmPassword ? "has-error" : ""}`}>
                  <Lock className="forgot-input-icon" size={18} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm password"
                    {...step3.register("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                  />
                  <button
                    type="button"
                    className="forgot-password-toggle"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {step3.formState.errors.confirmPassword && (
                  <span className="forgot-error-text">{step3.formState.errors.confirmPassword.message}</span>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="forgot-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;