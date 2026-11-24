import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Admin Portal</h1>
      </header>
      
      <main className="landing-hero">
        <h2>Welcome to Emmanuel's Portfolio Admin</h2>
        <p>Manage your content, projects, and download requests securely.</p>
        <div className="landing-actions">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/register" className="btn-secondary">Register</Link>
        </div>
      </main>

      <footer className="landing-footer">
        <p>All rights reserved &copy; EmmanuelMose 2026</p>
      </footer>
    </div>
  );
};

export default LandingPage;