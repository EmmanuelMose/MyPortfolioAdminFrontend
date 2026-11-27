import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : ({} as Record<string, string>);
};

export const listHeroSkills = async () => {
  const response = await axios.get(`${ApiDomain}/hero-skills`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const createHeroSkill = async (data: {
  title: string;
  displayOrder?: number;
  isActive?: boolean;
}) => {
  const response = await axios.post(`${ApiDomain}/hero-skills`, data, {
    headers: authHeaders(),
  });
  return response.data;
};

export const updateHeroSkill = async (
  id: number,
  data: {
    title?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
) => {
  const response = await axios.put(`${ApiDomain}/hero-skills/${id}`, data, {
    headers: authHeaders(),
  });
  return response.data;
};

export const deleteHeroSkill = async (id: number) => {
  const response = await axios.delete(`${ApiDomain}/hero-skills/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};