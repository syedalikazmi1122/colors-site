// set up profile auth store
import {create} from "zustand";

const useProfileAuthStore = create((set) => ({
    name: "",
    email: "",
    role : "",
    isLoggedIn: false,
    setName: (name) => set(() => ({ name })),
    setEmail: (email) => set(() => ({ email })),
    setPassword: (password) => set(() => ({ password })),
    setRole: (role) => set(() => ({ role })),
    setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn }))
}));
export default useProfileAuthStore;