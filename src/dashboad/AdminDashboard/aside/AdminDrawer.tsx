import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { adminDrawerData, type DrawerData } from "./drawerData";
import "./AdminDrawer.css";

type AdminDrawerProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
};

const AdminDrawer = ({ isSidebarOpen, onToggle, onCloseMobile, onLogout }: AdminDrawerProps) => {
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      onCloseMobile();
    }
  };

  const getInitials = () => {
    if (!user?.email) return "AD";
    return user.email.substring(0, 2).toUpperCase();
  };

  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    return adminDrawerData.filter((item) => item.roles.includes(user.role));
  }, [user]);

  const displayRole = user?.role === "super_admin" ? "Super Admin" : "Admin";

  return (
    <aside className={`admin-drawer ${isSidebarOpen ? "admin-drawer-open" : "admin-drawer-closed"}`}>
      <div className="admin-drawer-header">
        <div className="admin-drawer-brand">
          <span className="admin-drawer-brand-icon">A</span>
          <span className={`admin-drawer-title ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Admin<span className="admin-drawer-brand-highlight">Panel</span>
          </span>
        </div>
        <button onClick={onToggle} className="admin-drawer-toggle" aria-label="Toggle sidebar">
          {isSidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      <div className="admin-drawer-user">
        <div className="admin-drawer-user-avatar">{getInitials()}</div>
        <div className={`admin-drawer-user-info ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
          <span className="admin-drawer-user-name">{user?.email || "Admin"}</span>
          <span className="admin-drawer-user-role">{displayRole}</span>
        </div>
      </div>

      <nav className="admin-drawer-nav">
        {filteredNavItems.map((item: DrawerData) => (
          <NavLink
            key={item.id}
            to={item.link}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `admin-drawer-link ${isActive ? "admin-drawer-link-active" : ""} ${!isSidebarOpen ? "admin-drawer-link-collapsed" : ""}`
            }
            title={!isSidebarOpen ? item.name : undefined}
          >
            {isSidebarOpen ? (
              <span className="admin-drawer-text">{item.name}</span>
            ) : (
              <span className="admin-drawer-glyph">{item.name.charAt(0)}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="admin-drawer-footer">
        <button onClick={onLogout} className="admin-drawer-logout" title={!isSidebarOpen ? "Log Out" : undefined}>
          {isSidebarOpen ? <span className="admin-drawer-text">Log Out</span> : <span className="admin-drawer-glyph">⏻</span>}
        </button>
        {isSidebarOpen && (
          <span className="admin-drawer-footer-text">v1.0 • {new Date().getFullYear()}</span>
        )}
      </div>
    </aside>
  );
};

export default AdminDrawer;