import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../Features/auth/auth';
import './ResetPassword.css.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await resetPassword(formData.email, formData.code, formData.newPassword);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        {error && <p className="error-msg">{error}</p>}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="code" placeholder="6-Digit Code" onChange={handleChange} required />
        <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required />
        <button type="submit">Reset Password</button>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;