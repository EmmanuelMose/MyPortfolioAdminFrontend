import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${ApiDomain}/auth/login`, data);
  return response.data;
};

export const registerUser = async (data: {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}) => {
  const response = await axios.post(`${ApiDomain}/auth/register`, data);
  return response.data;
};

export const verifyAccount = async (email: string, code: string) => {
  const response = await axios.post(`${ApiDomain}/auth/verify-account`, { email, code });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${ApiDomain}/auth/forgot-password`, { email });
  return response.data;
};

export const verifyResetCode = async (email: string, code: string) => {
  const response = await axios.post(`${ApiDomain}/auth/verify-reset-code`, { email, code });
  return response.data;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await axios.post(`${ApiDomain}/auth/reset-password`, { email, newPassword });
  return response.data;
};

export const getMe = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${ApiDomain}/auth/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};