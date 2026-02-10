import api from "./axios";

export const uploadImage = async (File, onProgress) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress(percent);
      }
    },
  });

  return response.data;
};
