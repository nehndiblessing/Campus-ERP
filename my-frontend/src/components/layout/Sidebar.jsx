import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaClipboardCheck,
  FaChartBar,
  FaUser,
  FaBuilding,
} from "react-icons/fa";
import useAuth from "../../context/useAuth";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>Campus ERP</h2>

      <nav>
        <NavLink to="/dashboard">
          <FaHome /> Dashboard
        </NavLink>

        {user?.role === "admin" && (
          <NavLink to="/students">
            <FaUserGraduate /> Students
          </NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink to="/departments">
            <FaBuilding /> Departments
          </NavLink>
        )}

        <NavLink to="/attendance">
          <FaClipboardCheck /> Attendance
        </NavLink>

        <NavLink to="/marks">
          <FaChartBar /> Marks
        </NavLink>

        <NavLink to="/profile">
          <FaUser /> Profile
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
