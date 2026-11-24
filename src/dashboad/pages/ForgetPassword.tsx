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
      <div className="auth-form">
        <h2>Forgot Password</h2>
        
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="form-step">
            <p className="step-text">Enter your email to receive a 6-digit reset code.</p>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="form-step">
            <p className="step-text">Enter the 6-digit code sent to <strong>{email}</strong>.</p>
            <input 
              type="text" 
              placeholder="6-Digit Code" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="form-step">
            <p className="step-text">Code verified. Enter your new password.</p>
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
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