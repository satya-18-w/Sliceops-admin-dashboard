import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant: TenantInfo;

}

interface TenantInfo {
    id: string;
    name: string;
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