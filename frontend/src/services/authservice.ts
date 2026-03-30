import axiosInstance from "../utils/axiosinstance";

export const authService = {

  register: async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    const response = await axiosInstance.post("/auth/register/", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {

    const response = await axiosInstance.post("/auth/login/", data);

    const { access, refresh } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    return response.data;
  },

  profile: async () => {
    const response = await axiosInstance.get("/auth/profile/");
    return response.data;
  },
};