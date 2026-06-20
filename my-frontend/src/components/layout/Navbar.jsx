import useAuth from "../../context/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="navbar">
      <h3>Campus ERP</h3>

      <div className="user-box">
        {user?.name}
      </div>
    </div>
  );
};

export default Navbar;
