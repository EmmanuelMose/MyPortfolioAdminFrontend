import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : ({} as Record<string, string>);
};

export type ExperiencePayload = {
  companyName?: string;
  roleTitle?: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder?: number;
};

export const listExperience = async () => {
  const response = await axios.get(`${ApiDomain}/experience`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const getExperienceById = async (id: number) => {
  const response = await axios.get(`${ApiDomain}/experience/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const createExperience = async (data: ExperiencePayload) => {
  const response = await axios.post(`${ApiDomain}/experience`, data, {
    headers: authHeaders(),
  });
  return response.data;
};

export const updateExperience = async (id: number, data: ExperiencePayload) => {
  const response = await axios.put(`${ApiDomain}/experience/${id}`, data, {
    headers: authHeaders(),
  });
  return response.data;
};

export const deleteExperience = async (id: number) => {
  const response = await axios.delete(`${ApiDomain}/experience/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};