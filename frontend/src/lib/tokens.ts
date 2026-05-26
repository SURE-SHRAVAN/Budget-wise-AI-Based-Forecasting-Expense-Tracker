const ACCESS_TOKEN = "budgetwise.access";
const REFRESH_TOKEN = "budgetwise.refresh";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
  },
  setAccess: (access: string) => localStorage.setItem(ACCESS_TOKEN, access),
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  },
};
