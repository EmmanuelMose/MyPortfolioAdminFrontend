import { BrowserRouter, useRoutes, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./dashboad/pages/LandingPage";
import Login from "./dashboad/pages/Login";
import Register from "./dashboad/pages/Register";
import ForgotPassword from "./dashboad/pages/ForgetPassword";

import AdminDashboard from "./dashboad/AdminDashboard/AdminDashboard";
import HeroProfile from "./dashboad/AdminDashboard/hero-profile/HeroProfile";
import HeroSkills from "./dashboad/AdminDashboard/hero-skills/HeroSkills";
import SocialLinks from "./dashboad/AdminDashboard/social-links/SocialLinks";
import Experience from "./dashboad/AdminDashboard/experience/Experience";
import Admins from "./dashboad/AdminDashboard/admins/Admins";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  return token && user ? <Outlet /> : <Navigate to="/login" replace />;
};

const RoleRoute = ({ roles }: { roles: ("super_admin" | "admin")[] }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard/hero" replace />;
  }
  return <Outlet />;
};

const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <AdminDashboard />,
        children: [
          { index: true, element: <Navigate to="/dashboard/hero" replace /> },
          { path: "hero", element: <HeroProfile /> },
          { path: "hero-skills", element: <HeroSkills /> },
          { path: "social-links", element: <SocialLinks /> },
          { path: "experience", element: <Experience /> },
          {
            element: <RoleRoute roles={["super_admin"]} />,
            children: [
              { path: "admins", element: <Admins /> },
              { path: "settings", element: <div>Settings Page</div> },
              { path: "logs", element: <div>Logs Page</div> },
            ],
          },
        ],
      },
    ],
  },
];

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #e5e5e5",
              fontWeight: 500,
              fontSize: "14px",
              borderRadius: "10px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
            },
            classNames: {
              error: "sonner-toast-error",
              success: "sonner-toast-success",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;