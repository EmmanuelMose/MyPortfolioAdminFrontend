import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerUser, verifyAccount } from "../../Features/auth/auth";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Key } from "lucide-react";
import registerHero from "../../assets/images/register-hero.jpg";
import "./Register.css";

type RegisterForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";

  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: "onTouched",
    defaultValues: { email: prefilledEmail },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await registerUser(payload);
      setRegisteredEmail(data.email.trim().toLowerCase());
      toast.success("Registration received. Check your email for a verification code.");
      setStep("verify");
    } catch (err: any) {
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message;
      const message =
        serverMessage ||
        (status === 400 ? "Please check your details and try again" : "Registration failed");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter the 6-digit code sent to your email");
      return;
    }

    setVerifying(true);
    try {
      await verifyAccount(registeredEmail, code);
      toast.success("Account verified. You can now sign in.");
      navigate("/login");
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      toast.error(serverMessage || "Invalid or expired verification code");
    } finally {
      setVerifying(false);
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
            <h1>
              {step === "register" ? "Create your" : "Verify your"} <span>Account</span>
            </h1>
          </div>
        </div>

        <div className="register-form-side">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="register-back-btn"
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>

          {step === "register" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="register-form" noValidate>
              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className={`register-input-wrapper ${errors.firstName ? "has-error" : ""}`}>
                    <User className="register-input-icon" size={14} />
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
                  {errors.firstName && (
                    <span className="register-error-text">{errors.firstName.message}</span>
                  )}
                </div>

                <div className="register-form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className={`register-input-wrapper ${errors.lastName ? "has-error" : ""}`}>
                    <User className="register-input-icon" size={14} />
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
                  {errors.lastName && (
                    <span className="register-error-text">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="middleName">
                  Middle Name <span className="optional">(Optional)</span>
                </label>
                <div className="register-input-wrapper">
                  <User className="register-input-icon" size={14} />
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
                  <Mail className="register-input-icon" size={14} />
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
                {errors.email && (
                  <span className="register-error-text">{errors.email.message}</span>
                )}
              </div>

              <div className="register-form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className={`register-input-wrapper ${errors.phoneNumber ? "has-error" : ""}`}>
                  <Phone className="register-input-icon" size={14} />
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
                {errors.phoneNumber && (
                  <span className="register-error-text">{errors.phoneNumber.message}</span>
                )}
              </div>

              <div className="register-form-group">
                <label htmlFor="password">Password</label>
                <div className={`register-input-wrapper ${errors.password ? "has-error" : ""}`}>
                  <Lock className="register-input-icon" size={14} />
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
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="register-error-text">{errors.password.message}</span>
                )}
              </div>

              <div className="register-form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`register-input-wrapper ${errors.confirmPassword ? "has-error" : ""}`}>
                  <Lock className="register-input-icon" size={14} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Re-enter your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="register-error-text">{errors.confirmPassword.message}</span>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="register-login">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="register-form" noValidate>
              <p className="register-verify-text">
                We sent a 6-digit code to <strong>{registeredEmail}</strong>. Enter it below to
                verify your account.
              </p>

              <div className="register-form-group">
                <label htmlFor="code">Verification Code</label>
                <div className="register-input-wrapper">
                  <Key className="register-input-icon" size={14} />
                  <input
                    type="text"
                    id="code"
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={verifying}>
                {verifying ? "Verifying..." : "Verify Account"}
              </button>

              <p className="register-login">
                Wrong email? <Link to="/login">Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;