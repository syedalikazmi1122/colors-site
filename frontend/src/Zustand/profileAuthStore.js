import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProfileAuthStore = create(
  persist(
    (set) => ({
      name: "",
      email: "",
      role: "",
      isLoggedIn: false,
      setUser: (user) =>
        set(() => ({
          name: user.name,
          email: user.email,
          role: user.role,
          isLoggedIn: true,
        })),
      logout: () =>
        set(() => ({
          name: "",
          email: "",
          role: "",
          isLoggedIn: false,
        })),
    }),
    {
      name: "profile-auth", // Key to store in localStorage
    }
  )
);

export default useProfileAuthStore;