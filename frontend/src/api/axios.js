import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL : import.meta.env.VITE_API_BASE_URL ||  'http://localhost:5000/api',

  headers:{
    "Content-Type": "application/json",
  },

});

// attach token automatically
api.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem('token');

    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },

  (error) => Promise.reject(error)

);


//auto logout on 401
api.interceptors.response.use(
  (response)=>response,
  (error) =>{
    if(error.response?.status === 401){
      localStorage.removeItem('token');
      window.location.href ='/login';
    }
    return Promise.reject(error);
  }
);

export default api;
=======
  baseURL: 'http://localhost:5000/api',
});

// attach token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
>>>>>>> 75d60a0a5 (login auth via frontend)
