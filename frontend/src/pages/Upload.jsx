import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Image uploaded successfully!");
      navigate("/dashboard"); // go back to dashboard
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d140d] px-6">
      <h1 className="text-3xl text-white mb-6">Upload Crop Image</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 bg-white/5 p-8 rounded-xl"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-full hover:bg-emerald-600 transition"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
