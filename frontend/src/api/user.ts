import apiClient from "./client";

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};


export const getAllUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
}


export const updateUser = async (userId: string, data: any) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const response = await apiClient.patch(`/users/me`, data);
  return response.data;
};