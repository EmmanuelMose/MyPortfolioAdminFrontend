import axios from "axios";
import { ApiDomain } from "../../utils/APIDomain";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : ({} as Record<string, string>);
};

export const listAdmins = async () => {
  const response = await axios.get(`${ApiDomain}/admins`, { headers: authHeaders() });
  return response.data;
};

export const getAdminById = async (id: number) => {
  const response = await axios.get(`${ApiDomain}/admins/${id}`, { headers: authHeaders() });
  return response.data;
};

export const inviteAdmin = async (email: string) => {
  const response = await axios.post(`${ApiDomain}/admins/invite`, { email }, { headers: authHeaders() });
  return response.data;
};

export const updateAdmin = async (
  id: number,
  data: {
    firstName?: string;
    middleName?: string | null;
    lastName?: string;
    phoneNumber?: string;
  }
) => {
  const response = await axios.put(`${ApiDomain}/admins/${id}`, data, { headers: authHeaders() });
  return response.data;
};

export const toggleAdminPermission = async (id: number, canApproveDownloads: boolean) => {
  const response = await axios.patch(
    `${ApiDomain}/admins/${id}/permissions`,
    { canApproveDownloads },
    { headers: authHeaders() }
  );
  return response.data;
};

export const toggleAdminActive = async (id: number, isActive: boolean) => {
  const response = await axios.patch(
    `${ApiDomain}/admins/${id}/status`,
    { isActive },
    { headers: authHeaders() }
  );
  return response.data;
};

export const deleteAdmin = async (id: number) => {
  const response = await axios.delete(`${ApiDomain}/admins/${id}`, { headers: authHeaders() });
  return response.data;
};

export const deleteInvite = async (id: number) => {
  const response = await axios.delete(`${ApiDomain}/admins/invite/${id}`, { headers: authHeaders() });
  return response.data;
};

export const resendVerification = async (email: string) => {
  const response = await axios.post(
    `${ApiDomain}/admins/resend-verification`,
    { email },
    { headers: authHeaders() }
  );
  return response.data;
};