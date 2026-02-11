import { useEffect, useState } from "react";
import { getImages } from "../api/image.api";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const data = await getImages();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d140d] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d140d]">

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/5 border-r border-white/10 p-6 min-h-[calc(100vh-73px)]">
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold">
              Dashboard
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="w-full text-left px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-all"
            >
              Upload Image
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Welcome back, {user?.username}!
              </h3>
              <p className="text-zinc-400 mb-6">Let's analyze your crops.</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-all"
              >
                Upload Image
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Your Stats</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-zinc-400 text-sm">Total Uploads</p>
                  <p className="text-2xl font-bold text-white">{images.length}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Healthy Crops</p>
                  <p className="text-2xl font-bold text-green-400">
                    {images.filter(img => img.diseaseDetected?.toLowerCase() === 'healthy').length}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Diseases Detected</p>
                  <p className="text-2xl font-bold text-red-400">
                    {images.filter(img => 
                      img.diseaseDetected?.toLowerCase() !== 'healthy' && 
                      img.diseaseDetected?.toLowerCase() !== 'pending'
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Recent Uploads</h3>
            
            {images.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-zinc-400 text-lg">No uploads yet</p>
                <p className="text-zinc-500 text-sm mt-2">Upload your first crop image to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {images.slice(0, 8).map((img) => (
                  <ImageCard key={img._id} image={img} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;