import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDrawer from "./aside/AdminDrawer";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-layout">
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
            <button onClick={toggleDrawer} className="admin-dashboard-menu-btn">
              ☰
            </button>
            <h1 className="admin-dashboard-title">Admin Panel</h1>
          </div>
          <div className="admin-dashboard-header-right">
            <span className="admin-dashboard-user-email">{user?.email}</span>
          </div>
        </header>

        <main className="admin-dashboard-content">
          <div className="admin-dashboard-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;