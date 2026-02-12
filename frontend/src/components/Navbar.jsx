import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
    
        <h1
          className="text-2xl font-bold text-white cursor-pointer hover:text-emerald-500 transition-colors"
          onClick={() => navigate("/dashboard")}
        >
          GreenBidu
        </h1>

        <div className="flex items-center gap-4">
          {user?.username && (
            <p className="text-white font-semibold ">
              Hello, {user.username}!
            </p>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
