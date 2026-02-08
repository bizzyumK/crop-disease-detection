import api from './axios';

<<<<<<< HEAD
export const loginUser = async(data) =>{
  const response = await api.post('/auth/login',data);
  return response.data;
}

export const registerUser = async (data) =>{
  const response = await api.post('/auth/register',data);
  return response.data;
}
=======
export const loginUser = (data) => {
  return api.post('/auth/login', data);
};
>>>>>>> 75d60a0a5 (login auth via frontend)
