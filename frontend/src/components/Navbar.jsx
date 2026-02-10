import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const Navbar =()=>{
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout =()=>{
    logout();
    navigate('/login');
  };

  return(
    <nav className="flex">
      <h1>Farmer Dashboard</h1>
      <div className="flex">
        <button>
          Upload
        </button>
        <button>
          Logout
        </button>
      </div>
    </nav>
  );

};

export default Navbar;