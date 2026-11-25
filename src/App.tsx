import { BrowserRouter, useRoutes, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./dashboad/pages/LandingPage";
import Login from "./dashboad/pages/Login";
import Register from "./dashboad/pages/Register";
import ForgotPassword from "./dashboad/pages/ForgetPassword";

import AdminDashboard from "./dashboad/AdminDashboard/AdminDashboard";
import HeroProfile from "./dashboad/AdminDashboard/hero-profile/HeroProfile";

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
          {
            element: <RoleRoute roles={["super_admin"]} />,
            children: [
              { path: "admins", element: <div>Admins Page</div> },
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;