import { useState } from "react";
import { STATUS } from "../utils/constants";

const ImageCard = ({ image, onClick, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getStatusColor = () => {
    const disease = image.diseaseDetected?.toLowerCase();
    if (disease === STATUS.HEALTHY) return "bg-green-500";
    if (disease === STATUS.PENDING) return "bg-yellow-600";
    return "bg-red-500";
  };

  const getStatusLabel = () => {
    const disease = image.diseaseDetected?.toLowerCase();
    if (disease === STATUS.HEALTHY) return "Healthy";
    if (disease === STATUS.PENDING) return "Analyzing...";
    return image.diseaseDetected;
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // don't open modal
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(image._id);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirming(false);
  };

  return (
    <div
      onClick={() => onClick?.(image)}
      className="bg-white/5 p-4 rounded-2xl shadow-lg hover:bg-white/10 transition-all cursor-pointer relative"
    >
      <img
        src={`${import.meta.env.VITE_SERVER_URL}/${image.imageUrl}`}
        alt="crop"
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          {new Date(image.createdAt).toLocaleDateString()}
        </p>
        <span className={`px-3 py-1 text-xs text-white rounded-full ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {image.confidence && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Confidence</span>
            <span>{Math.round(image.confidence)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${image.confidence}%` }}
            />
          </div>
        </div>
      )}

      {/* Delete */}
      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
        {confirming ? (
          <>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              {deleting ? "Deleting..." : "Confirm"}
            </button>
            <button
              onClick={handleCancelDelete}
              className="flex-1 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-zinc-300 rounded-lg transition-all"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleDelete}
            className="w-full py-1.5 text-xs bg-white/5 hover:bg-red-600/20 text-zinc-400 hover:text-red-400 rounded-lg transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCard;