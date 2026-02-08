import { useEffect, useState, useCallback } from "react";
import { getImages, deleteImage } from "../api/image.api";
import { getAdvisory } from "../api/advisory.api";
import { useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import AdvisoryModal from "../components/AdvisoryModal";
import Toast from "../components/Toast";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getImages();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const handler = () => setSidebarOpen((p) => !p);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  const handleImageClick = async (image) => {
    if (!image.diseaseDetected || image.diseaseDetected.toLowerCase() === "pending") return;
    setModalLoading(true);
    try {
      const advisory = await getAdvisory(image.diseaseDetected);
      setModalData({
        ...advisory,
        imageUrl: image.imageUrl,
        confidence: image.confidence,
        createdAt: image.createdAt,
      });
    } catch (err) {
      console.error("Failed to fetch advisory", err);
      showToast("Could not load advisory. Try again.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      showToast("Image deleted successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete image.", "error");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0d140d] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0d140d] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={fetchImages}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(images.filter((img) => img._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewAdvice = async (disease) => {
    if (!disease || disease === "pending" || disease === "Healthy") return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/advisory/${disease}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Disease: ${res.data.disease}\nAdvice: ${res.data.advice}`);
    } catch (err) {
      alert("No advice found for this disease!");
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0d140d]">
      <div className="flex">

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed top-[66px] inset-x-0 bottom-0 z-30 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:static top-[66px] md:top-auto bottom-0 left-0 z-40
          w-64 bg-[#0d140d] md:bg-white/5
          border-r border-white/10
          p-6
          md:min-h-[calc(100vh-73px)]
          overflow-y-auto
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          <nav className="space-y-2">
            <button
              onClick={() => { navigate('/dashboard'); setSidebarOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={() => { navigate('/upload'); setSidebarOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-all"
            >
              Upload Image
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Recent Uploads</h3>

          {modalLoading && (
            <p className="text-zinc-400 mb-4 text-sm">Loading advisory...</p>
          )}

          {images.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-zinc-400 text-lg">No uploads yet</p>
              <p className="text-zinc-500 text-sm mt-2">Upload your first crop image to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <ImageCard
                  key={img._id}
                  image={img}
                  onClick={handleImageClick}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalData && (
        <AdvisoryModal advisory={modalData} onClose={() => setModalData(null)} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
