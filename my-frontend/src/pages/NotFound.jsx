
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-content">
          <h1>404</h1>
          <h2>Page not found</h2>
          <p>The page you are looking for does not exist or may have been moved.</p>
          <div className="notfound-actions">
            <button className="primary-button" type="button" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
            <button className="secondary-button" type="button" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
        <img
          src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
          alt="404 Not Found"
          className="notfound-image"
        />
      </div>
    </div>
  );
};

export default NotFound;
