import type { CreateUserBody, Credential } from "../types"
import { apiClient } from "./client"

//Auth Service ROutes
export const login = (credentials: Credential) =>
    apiClient.post("/auth/login", credentials);


export const getSelf = () => apiClient.get("/auth/self");
export const logout = () => apiClient.post("/auth/logout");
export const getallUsersInaTenant = () => apiClient.get("/auth/users");
export const CreateUser = (user: CreateUserBody ) => apiClient.post("/auth/users/register",user);
export const updateUser = (id: string, user: { name: string; role: string }) => apiClient.put(`/auth/users/${id}`, user);
export const getAllTenants = () => apiClient.get("/tenants");
export const createTenant = (tenant: { name: string; slug: string; address: string }) => apiClient.post("/tenants/register", tenant);
export const createTenantAdmin = (user: any) => apiClient.post("/auth/users/tenant-admin", user);