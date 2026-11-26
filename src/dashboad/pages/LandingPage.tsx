import { Link } from "react-router-dom";
import { Shield, Layers, Lock, Activity } from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-bg-glow" />
      <div className="landing-grid" />

      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-logo-mark">A</span>
          <span className="landing-logo-text">
            Admin<span className="landing-logo-accent">Panel</span>
          </span>
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="landing-nav-link">Sign In</Link>
          <Link to="/register" className="landing-nav-btn">Get Started</Link>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-badge">
          <Shield size={14} /> PORTFOLIO MANAGEMENT
        </div>
        <h1 className="landing-title">
          Emmanuel&apos;s <span>Portfolio</span> Admin
        </h1>
        <p className="landing-description">
          Manage your content, projects, and download requests securely from one powerful dashboard.
        </p>
        <div className="landing-actions">
          <Link to="/login" className="btn-primary">Sign In</Link>
          <Link to="/register" className="btn-secondary">Register</Link>
        </div>

        <div className="landing-features">
          <div className="landing-feature">
            <div className="landing-feature-icon"><Layers size={22} /></div>
            <h3>Content Control</h3>
            <p>Manage projects, certifications, and profile from one place</p>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon"><Lock size={22} /></div>
            <h3>Secure Access</h3>
            <p>Role-based authentication with invitation-only registration</p>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon"><Activity size={22} /></div>
            <h3>Activity Logs</h3>
            <p>Track every action taken across the admin panel</p>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>All rights reserved &copy; EmmanuelMose {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default LandingPage;