import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaClipboardCheck,
  FaChartBar,
  FaUser,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";
import useAuth from "../../context/useAuth";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const navClassName = ({ isActive }) => (isActive ? "active-link" : undefined);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <span>CE</span>
        <div>
          <h2>Campus ERP</h2>
          <p>{user?.role === "admin" ? "Admin Portal" : "Student Portal"}</p>
        </div>
      </div>

      <nav>
        <NavLink to="/dashboard" className={navClassName}>
          <FaHome /> Dashboard
        </NavLink>

        {user?.role === "admin" && (
          <NavLink to="/students" className={navClassName}>
            <FaUserGraduate /> Students
          </NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink to="/departments" className={navClassName}>
            <FaBuilding /> Departments
          </NavLink>
        )}

        <NavLink to="/attendance" className={navClassName}>
          <FaClipboardCheck /> Attendance
        </NavLink>

        <NavLink to="/marks" className={navClassName}>
          <FaChartBar /> Marks
        </NavLink>

        {user?.role === "admin" && (
          <NavLink to="/reports" className={navClassName}>
            <FaFileAlt /> Reports
          </NavLink>
        )}

        <NavLink to="/profile" className={navClassName}>
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
