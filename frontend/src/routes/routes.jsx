import Homepage from "../components/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import InvestorLayout from "../layouts/InvestorLayout";
import BrowsePitches from "../components/Investors/BrowsePitches";
import SavedIdeas from "../components/Investors/SavedIdeas";
import MyInvestements from "../components/Investors/MyInvestments";
import InvestorDashboard from "../components/Investors/InvestorDashboard";
import InvestorAuth from "../components/Investors/InvestorAuth";
import EnterpreneurLayout from "../layouts/EnterpreneurLayout";
import MainUserDashboard from "../components/Main_User/MainUserDashboard";
import EntrepreneurProfile from "../components/Main_User/EntrepreneurProfile";
import StartupStatus from "../components/Main_User/StartupStatus";
import SavedInvestors from "../components/Main_User/SavedInvestors";
import SavedMentors from "../components/Main_User/SavedMentors";
import FundingPage from "../components/FundingPage";
import EntrepreneurRegistration from "../components/EntrepreneurRegistration";
import EntrepreneurLogin from "../components/EntrepreneurLogin";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import MainAdminDashboard from "../components/admin/MainAdminDashboard";
import NewEntrepreneur from "../components/admin/NewEntrepreneur";
import NewInvestor from "../components/admin/NewInvestor";

const VITE_ENCRYPTION_KEY = "SheLaunch"; // ❗ Move to .env in production

// ✅ Check if user is logged in
export function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (token) return true;

  const cookieValue = Cookies.get("She_Launch");
  if (cookieValue) {
    const userData = JSON.parse(cookieValue);
    return !!userData.token;
  }
  return false;
}

// ✅ Get user role from encrypted cookie
export function getUserRole() {
  const cookieValue = Cookies.get("She_Launch");
  if (cookieValue) {
    const userData = JSON.parse(cookieValue);
    const bytes = CryptoJS.AES.decrypt(userData.role, VITE_ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return null;
}

export const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cookieValue = Cookies.get("She_Launch");
    if (cookieValue) {
      const userData = JSON.parse(cookieValue);
      const encryptedRole = userData?.role;

      if (encryptedRole) {
        try {
          const bytes = CryptoJS.AES.decrypt(
            encryptedRole,
            VITE_ENCRYPTION_KEY
          );
          const role = bytes.toString(CryptoJS.enc.Utf8);

          switch (role) {
            case "admin":
              navigate("/admin", { replace: true });
              return;
            case "investor":
              navigate("/investors", { replace: true });
              return;
            case "entrepreneur":
              navigate("/entrepreneur", { replace: true });
              return;

              return;
            default:
              Swal.fire({
                title: "Error",
                text: "Unauthorized role!",
                icon: "error",
                confirmButtonText: "OK",
              });
              navigate("/", { replace: true });
          }
        } catch (error) {
          console.error("Decryption error", error);
          navigate("/", { replace: true });
        }
      }
    } else {
      navigate("/homepage", { replace: true }); // Not logged in
    }
  }, [navigate]);

  return null;
};

// ✅ Route wrapper for role-based access
const UserRoleRoute = ({ role, component }) => {
  const userRole = getUserRole();
  const isLoggedInUser = isLoggedIn();

  if (!isLoggedInUser) {
    return <Navigate to="/" />;
  }
  if (userRole !== role) {
    return <Navigate to="/" />;
  }
  return component;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Main layout routes */}
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} /> {/* default homepage */}
          <Route path="homepage" element={<Homepage />} />
          <Route path="fundings" element={<FundingPage />} />
          <Route
            path="enterpreneurRegister"
            element={<EntrepreneurRegistration />}
          />
          <Route path="login" element={<EntrepreneurLogin />} />
        </Route>

        {/* Investor layout routes */}
        <Route
          path="/investors"
          element={
            <UserRoleRoute role="investor" component={<InvestorLayout />} />
          }
        >
          <Route
            index
            element={
              <UserRoleRoute
                role="investor"
                component={<InvestorDashboard />}
              />
            }
          />
          <Route
            path="browsepitches"
            element={
              <UserRoleRoute role="investor" component={<BrowsePitches />} />
            }
          />
          <Route
            path="savedideas"
            element={
              <UserRoleRoute role="investor" component={<SavedIdeas />} />
            }
          />
          <Route
            path="myinvestments"
            element={
              <UserRoleRoute role="investor" component={<MyInvestements />} />
            }
          />
        </Route>

        {/* Entrepreneur layout routes */}
        <Route
          path="/entrepreneur"
          element={
            <UserRoleRoute
              role="entrepreneur"
              component={<EnterpreneurLayout />}
            />
          }
        >
          <Route
            index
            element={
              <UserRoleRoute
                role="entrepreneur"
                component={<MainUserDashboard />}
              />
            }
          />
          <Route
            path="profile"
            element={
              <UserRoleRoute
                role="entrepreneur"
                component={<EntrepreneurProfile />}
              />
            }
          />
          <Route
            path="startupstatus"
            element={
              <UserRoleRoute
                role="entrepreneur"
                component={<StartupStatus />}
              />
            }
          />
          <Route
            path="savedinvestors"
            element={
              <UserRoleRoute
                role="entrepreneur"
                component={<SavedInvestors />}
              />
            }
          />
          <Route
            path="savedmentors"
            element={
              <UserRoleRoute role="entrepreneur" component={<SavedMentors />} />
            }
          />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={<UserRoleRoute role="admin" component={<AdminLayout />} />}
        >
          <Route
            index
            element={
              <UserRoleRoute role="admin" component={<MainAdminDashboard />} />
            }
          />
          <Route
            path="newuser"
            element={
              <UserRoleRoute role="admin" component={<NewEntrepreneur />} />
            }
          />
          <Route
            path="newinvestor"
            element={<UserRoleRoute role="admin" component={<NewInvestor />} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
