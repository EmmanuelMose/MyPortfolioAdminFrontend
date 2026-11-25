import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, verifyResetCode, resetPassword } from '../../Features/auth/auth';
import './ForgetPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('Reset code sent to your email');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await verifyResetCode(email, code);
      setSuccess('Code verified successfully');
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-form">
        <div className="auth-form-header">
          <div className="auth-badge">RECOVERY</div>
          <h2>Forgot Password</h2>
          <p className="auth-subtitle">Reset your admin account password</p>
        </div>

        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`auth-step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`auth-step-line ${step >= 3 ? 'active' : ''}`} />
          <div className={`auth-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="form-step">
            <p className="step-text">Enter your email to receive a 6-digit reset code.</p>
            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="form-step">
            <p className="step-text">Enter the 6-digit code sent to <strong>{email}</strong></p>
            <div className="auth-field">
              <label>Reset Code</label>
              <input type="text" placeholder="000000" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="form-step">
            <p className="step-text">Code verified. Enter your new password.</p>
            <div className="auth-field">
              <label>New Password</label>
              <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;