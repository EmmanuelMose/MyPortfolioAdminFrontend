import axios from 'axios';
import { ApiDomain } from '../../utils/APIDomain';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
};

export const getHeroProfile = async () => {
  const response = await axios.get(`${ApiDomain}/hero-profile`);
  return response.data;
};

export const createHeroProfile = async (formData: FormData) => {
  const response = await axios.post(`${ApiDomain}/hero-profile`, formData, getAuthHeaders());
  return response.data;
};

export const updateHeroProfile = async (formData: FormData) => {
  const response = await axios.put(`${ApiDomain}/hero-profile`, formData, getAuthHeaders());
  return response.data;
};

export const deleteHeroProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${ApiDomain}/hero-profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};