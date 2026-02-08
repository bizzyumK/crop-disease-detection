import cropImg from '../assets/login.webp'; // temporary image
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // dummy data (replace with API later)
  const images = [
    { id: 1, status: 'pending' },
    { id: 2, status: 'Leaf Blight' },
    { id: 3, status: 'Healthy' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#0d140d] px-6 py-10 overflow-hidden">

      {/* background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-900/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Farmer Dashboard 🌾
            </h1>
            <p className="text-zinc-400">
              Upload crop images and get disease advice
            </p>
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="mt-4 md:mt-0 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
          >
            Upload Image
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

              {/* Status */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-zinc-400">Status</span>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold
                    ${img.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : img.status === 'Healthy'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }
                  `}
                >
                  {img.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-emerald-500/20 text-emerald-400 font-semibold py-2 rounded-full hover:bg-emerald-500/30 transition"
                >
                  View Advice
                </button>

                <button
                  className="flex-1 bg-red-500/20 text-red-400 font-semibold py-2 rounded-full hover:bg-red-500/30 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
