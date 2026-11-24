import { BrowserRouter, useRoutes } from "react-router-dom";

import LandingPage from "./dashboad/pages/LandingPage";
import Login from "./dashboad/pages/Login";
import Register from "./dashboad/pages/Register";
import ForgotPassword from "./dashboad/pages/ForgetPassword";
import ResetPassword from "./dashboad/pages/ResetPassword";

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
    path: "/dashboard",
    element: <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Dashboard Placeholder (Coming Next)</div>
  }
];

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;