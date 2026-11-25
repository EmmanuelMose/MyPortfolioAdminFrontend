import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDrawer from "./aside/AdminDrawer";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false);
        setIsDrawerOpen(true);
      } else if (window.innerWidth <= 1024) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleDrawer = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsDrawerOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = user?.role === "super_admin" ? "Super Admin" : "Admin";
  const roleClass = user?.role === "super_admin" ? "role-super" : "role-admin";
  const getInitials = () => {
    if (!user?.email) return "AD";
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="admin-dashboard-layout">
      {isMobileOpen && (
        <div className="admin-dashboard-backdrop" onClick={() => setIsMobileOpen(false)} />
      )}

      <div className={`admin-dashboard-drawer-wrapper ${isMobileOpen ? "mobile-open" : ""}`}>
        <AdminDrawer
          isSidebarOpen={isDrawerOpen}
          onToggle={toggleDrawer}
          onCloseMobile={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      <div className="admin-dashboard-main">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-left">
            <button onClick={toggleDrawer} className="admin-dashboard-menu-btn" aria-label="Toggle menu">
              <span />
              <span />
              <span />
            </button>
            <h1 className="admin-dashboard-title">Admin Panel</h1>
          </div>
          <div className="admin-dashboard-header-right">
            <div className={`admin-dashboard-role-badge ${roleClass}`}>{roleLabel}</div>
            <div className="admin-dashboard-user-chip">
              <div className="admin-dashboard-user-avatar">{getInitials()}</div>
              <span className="admin-dashboard-user-email">{user?.email}</span>
            </div>
          </div>
        </header>

        <main className="admin-dashboard-content">
          <div className="admin-dashboard-content-inner" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;