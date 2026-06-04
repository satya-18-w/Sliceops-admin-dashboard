import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
    id: string;
    Name: string;
    Email: string;
    Role: string;
    TenantID: string;

}


interface AuthState {
    user: null | User;
    setUser: (user: User) => void;
    logout: () => void;

}

export const useAuthStore = create<AuthState>()(
    devtools((set) => ({
        user: null,
        setUser: (user) => set({ user: user }),
        logout: () => set({ user: null }), 
    }))

);