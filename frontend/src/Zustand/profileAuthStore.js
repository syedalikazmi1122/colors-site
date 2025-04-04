// set up profile auth store
import {create} from "zustand";

const useProfileAuthStore = create((set) => ({
    name: "",
    email: "",
    role : "",
    isLoggedIn: false,
    setUser :(user) => set(() => ({ name: user.name, email: user.email, role: user.role, isLoggedIn: true }))
}));
export default useProfileAuthStore;