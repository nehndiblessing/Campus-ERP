import MainLayout from "../components/layout/MainLayout";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <MainLayout>
        <p>No user is currently signed in.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>Profile</h1>
      <div className="profile-card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;