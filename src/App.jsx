import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./store/userSlice";
import HomePage from "@/components/pages/HomePage";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;

    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
    });

    ApperUI.setup(client, {
      target: "#authentication",
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: "both",
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get("redirect");
        const isAuthPage =
          currentPath.includes("/login") ||
          currentPath.includes("/signup") ||
          currentPath.includes("/callback") ||
          currentPath.includes("/error") ||
          currentPath.includes("/prompt-password") ||
          currentPath.includes("/reset-password");

        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes("/login") && !currentPath.includes("/signup")) {
              navigate(currentPath);
            } else {
              navigate("/");
            }
          } else {
            navigate("/");
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes("/signup")
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes("/login")
                ? `/login?redirect=${currentPath}`
                : "/login"
            );
          } else if (redirectPath) {
            if (
              !["error", "signup", "login", "callback", "prompt-password", "reset-password"].some((path) =>
                currentPath.includes(path)
              )
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate("/login");
          }
          dispatch(clearUser());
        }
      },
      onError: function (error) {
        console.error("Authentication failed:", error);
      },
    });
  }, []);

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <Button variant="outline" size="sm" onClick={authMethods.logout}>
            <ApperIcon name="LogOut" size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;