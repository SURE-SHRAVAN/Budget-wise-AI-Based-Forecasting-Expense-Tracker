import axiosInstance from "../utils/axiosinstance";

export const api = {

  auth: {
    register: (data: { email: string; username: string; password: string }) =>
      axiosInstance.post("/auth/register/", data).then(res => res.data),

    login: (data: { email: string; password: string }) =>
      axiosInstance.post("/auth/login/", data).then(res => res.data),

    profile: () =>
      axiosInstance.get("/auth/profile/").then(res => res.data),
  },

  transactions: {
    list: () =>
      axiosInstance.get("/transactions/").then(res => res.data),

    create: (data: any) =>
      axiosInstance.post("/transactions/", data).then(res => res.data),
  },

  goals: {
    list: () =>
      axiosInstance.get("/goals/").then(res => res.data),

    create: (data: any) =>
      axiosInstance.post("/goals/", data).then(res => res.data),
  }

};

export default api;

//