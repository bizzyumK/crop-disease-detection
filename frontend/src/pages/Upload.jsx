import { useState } from "react";
import { uploadImage } from "../api/image.api";

const Upload =()=>{
  const [file,setFile] = useState(null);
  const [preview,setPreview] = useState(null);
  const [progress,setProgress] = useState(0);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');

  const handleFileChange = (e)=>{
    const selected = e.target.files[0];

    if(!selected || !selected.type.startsWith('image/')){
      setError('Please select an image file');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError('');
    setSuccess('');
  };

  const handleUpload = async ()=>{
    if(!file){
      setError('Please choose an image first');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError('');
    setSuccess('');

    try{
      await uploadImage(file,setProgress);
      setSuccess("Image uploaded successfully");
      setFile(null);
      setPreview(null);
    } 
    catch(err){
      setError('Upload failed. Try again.');
    }

    finally{
      setLoading(false);
    }
  };

  return (


    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Upload Leaf Image</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange = {handleFileChange}
          className="w-full text-sm text-zinc-400"
        />

        {preview && 
        <img 
          src="{preview}"
          alt="Preview"
          className="max-h-64 mx-auto rounded-lg object-contain"
        />
        }

        {loading && (
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
        
        onClick={handleUpload}
        disabled = {loading}
        className="w-full bg-emerald-500 text-black font-bold py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
      </div>
    </div>
  );

};

export default Upload;