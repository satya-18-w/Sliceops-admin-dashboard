import type { Credential } from "../types"
import { apiClient } from "./client"

//Auth Service ROutes
export const login = (credentials: Credential) =>
    apiClient.post("/auth/login", credentials);


export const getSelf = () => apiClient.get("/auth/self");
export const logout = () => apiClient.post("/auth/logout");
export const getallUsersInaTenant = () => apiClient.get("/auth/users");