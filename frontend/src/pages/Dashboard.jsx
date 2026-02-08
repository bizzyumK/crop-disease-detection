import cropImg from '../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check login
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!storedUser || !token) {
      navigate('/login'); // redirect if not logged in
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // dummy images
  const images = [
    { id: 1, status: 'pending' },
    { id: 2, status: 'Leaf Blight' },
    { id: 3, status: 'Healthy' },
  ];

  if (!user) return null; // wait until user loaded

  return (
    <div className="relative min-h-screen w-full bg-[#0d140d] px-6 py-10 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-900/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {user.name} 🌾
            </h1>
            <p className="text-zinc-400">Upload crop images and get disease advice</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold px-6 py-3 rounded-full hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:scale-[1.02] transition-transform"
            >
              <img
                src={cropImg}
                alt="crop"
                className="w-full h-52 object-cover rounded-2xl mb-4"
              />
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-zinc-400">Status</span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold
                    ${img.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : img.status === 'Healthy'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                    }`}
                >
                  {img.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
