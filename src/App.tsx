import { BrowserRouter, useRoutes, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./dashboad/pages/LandingPage";
import Login from "./dashboad/pages/Login";
import Register from "./dashboad/pages/Register";
import ForgotPassword from "./dashboad/pages/ForgetPassword";
import ResetPassword from "./dashboad/pages/ResetPassword";

import AdminDashboard from "./dashboad/AdminDashboard/AdminDashboard";
import HeroProfile from "./dashboad/AdminDashboard/hero-profile/HeroProfile";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  return token && user ? <Outlet /> : <Navigate to="/login" replace />;
};

const routes = [
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <AdminDashboard />,
        children: [
          { index: true, element: <Navigate to="/dashboard/hero" replace /> },
          { path: "hero", element: <HeroProfile /> },
        ]
      }
    ]
  }
];

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
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