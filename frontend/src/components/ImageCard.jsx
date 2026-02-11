import { STATUS } from "../utils/constants";

const ImageCard = ({ image }) => {
  const getStatusColor = () => {
    const disease = image.diseaseDetected?.toLowerCase();
    
    if (disease === STATUS.HEALTHY) return "bg-green-500";
    if (disease === STATUS.PENDING) return "bg-yellow-500";
    return "bg-red-500"; 
  };

  const getStatusLabel = () => {
    const disease = image.diseaseDetected?.toLowerCase();
    
    if (disease === STATUS.HEALTHY) return "Healthy";
    if (disease === STATUS.PENDING) return "Analyzing...";
    return image.diseaseDetected; // Show actual disease name
  };

  return (
    <div className="bg-white/5 p-4 rounded-2xl shadow-lg hover:bg-white/10 transition-all">
      <img
        src={`${import.meta.env.VITE_SERVER_URL}/${image.imageUrl}`}
        alt="crop"
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          {new Date(image.createdAt).toLocaleDateString()}
        </p>

        <span
          className={`px-3 py-1 text-xs text-white rounded-full ${getStatusColor()}`}
        >
          {getStatusLabel()} {/*diseaseDetected */}
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
    </div>
  );
};

export default ImageCard;