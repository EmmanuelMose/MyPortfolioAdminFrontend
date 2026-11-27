import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : ({} as Record<string, string>);
};

const authMultipartHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    : ({ "Content-Type": "multipart/form-data" } as Record<string, string>);
};

export const listSocialLinks = async () => {
  const response = await axios.get(`${ApiDomain}/social-links`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const createSocialLink = async (data: FormData) => {
  const response = await axios.post(`${ApiDomain}/social-links`, data, {
    headers: authMultipartHeaders(),
  });
  return response.data;
};

export const updateSocialLink = async (id: number, data: FormData) => {
  const response = await axios.put(`${ApiDomain}/social-links/${id}`, data, {
    headers: authMultipartHeaders(),
  });
  return response.data;
};

export const deleteSocialLink = async (id: number) => {
  const response = await axios.delete(`${ApiDomain}/social-links/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};