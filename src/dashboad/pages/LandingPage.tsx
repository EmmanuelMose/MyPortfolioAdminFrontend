import { Link } from "react-router-dom";
import { Shield, Layers, Lock, Activity } from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-grid" />

      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-logo-text">
            Emmanuel Guru <span className="landing-logo-accent">Admin Panel</span>
          </span>
        </div>
        <Link to="/register" className="landing-nav-btn">
          Get Started
        </Link>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-badge">
            <Shield size={14} />
            PORTFOLIO MANAGEMENT
          </div>

          <h1 className="landing-title">
            Emmanuel&apos;s <span>Portfolio</span> Admin
          </h1>

          <p className="landing-description">
            A secure, invitation-only dashboard built to manage your portfolio
            content, projects, certifications, and download requests — all from
            one powerful place. Sign in to take full control of everything you
            publish.
          </p>

          <div className="landing-stats">
            <div className="landing-stat">
              <span className="landing-stat-value">50+</span>
              <span className="landing-stat-label">Projects Managed</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-value">20+</span>
              <span className="landing-stat-label">Certifications</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-value">500+</span>
              <span className="landing-stat-label">Downloads Approved</span>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="landing-feature">
            <div className="landing-feature-icon">
              <Layers size={22} />
            </div>
            <h3>Content Control</h3>
            <p>
              Manage projects, certifications, and profile details from a
              single unified dashboard. Everything you publish lives here.
            </p>
          </div>

          <div className="landing-feature">
            <div className="landing-feature-icon">
              <Lock size={22} />
            </div>
            <h3>Secure Access</h3>
            <p>
              Role-based authentication with invitation-only registration so
              only trusted admins can reach sensitive areas.
            </p>
          </div>

          <div className="landing-feature">
            <div className="landing-feature-icon">
              <Activity size={22} />
            </div>
            <h3>Activity Logs</h3>
            <p>
              Every login, edit, and download approval is tracked so you always
              know exactly what changed and who did it.
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>All rights reserved &copy; EmmanuelMose {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default LandingPage;