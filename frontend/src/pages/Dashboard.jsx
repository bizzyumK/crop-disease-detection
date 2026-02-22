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
  const [toast, setToast] = useState(null); // { message, type }
  const navigate = useNavigate();

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

  // Error state
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {images.slice(0, 8).map((img) => (
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