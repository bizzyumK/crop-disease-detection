import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../api/image.api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    // Revoke previous preview URL to prevent memory leak
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      setFile(null);
      setPreview(null);
      return;
    }

    // Optional: Check file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (selected.size > maxSize) {
      setError("File size must be less than 5MB.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError("");
    setSuccess("");

    try {
      await uploadImage(file, setProgress);

      setSuccess("Image uploaded successfully!");
      
      // Revoke the preview URL before clearing
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      
      setFile(null);
      setPreview(null);
      setProgress(0);

      if (inputRef.current) {
        inputRef.current.value = null;
      }
    } catch (err) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Upload Leaf Image</h1>
        
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 transition"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        
        <div className="flex flex-col">
          <label className="text-sm text-zinc-400 mb-2">
            Select Crop Image
          </label>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-300
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-emerald-500 file:text-black
                       hover:file:bg-emerald-600"
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg object-contain border border-white/10"
          />
        )}

        {loading && (
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
      </div>
    </div>
  );
};

export default Upload;