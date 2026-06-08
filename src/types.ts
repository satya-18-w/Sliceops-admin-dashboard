export interface Credential {
    email: string;
    password: string;
    role: string;
}

export interface Users{
    UserData: [User]
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant_id: string;
    created_at: string;
}

export interface CreateUserBody{
    name: string;
    email: string;
    password: string;
    role: string;
}