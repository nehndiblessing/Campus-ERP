import { useContext } from "react";
import AuthContext from "./AuthContextCore";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
