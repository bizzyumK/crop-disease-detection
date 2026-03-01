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
  const cameraRef = useRef(null);
  const navigate = useNavigate();

  const processFile = (selected) => {
    if (preview) URL.revokeObjectURL(preview);
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (selected.size > maxSize) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);
  const handleCameraChange = (e) => processFile(e.target.files[0]);

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
      if (preview) URL.revokeObjectURL(preview);
      setFile(null);
      setPreview(null);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = null;
      if (cameraRef.current) cameraRef.current.value = null;
    } catch (err) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">

        {/* Two buttons side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Choose File */}
          <button
            onClick={() => inputRef.current.click()}
            className="py-4 border border-white/10 rounded-xl text-zinc-300 hover:bg-white/5 transition text-sm font-medium flex flex-col items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose File
          </button>

          {/* Take Photo */}
          <button
            onClick={() => cameraRef.current.click()}
            className="py-4 border border-white/10 rounded-xl text-zinc-300 hover:bg-white/5 transition text-sm font-medium flex flex-col items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Take Photo
          </button>
        </div>

        {/* Hidden inputs */}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleCameraChange} className="hidden" />

        {/* Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-contain border border-white/10"
            />
            <button
              onClick={() => { URL.revokeObjectURL(preview); setFile(null); setPreview(null); }}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Progress bar */}
        {loading && (
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
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
