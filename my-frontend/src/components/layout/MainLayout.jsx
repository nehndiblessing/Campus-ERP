import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </div>
  
    </div>
  );
};

export default MainLayout;