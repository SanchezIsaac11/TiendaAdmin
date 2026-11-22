export type UserRole = "admin" | "cashier";

export interface User {
    id: number;
    name: string;
    password?: string;
    role: UserRole;
}

export interface CreateUserInput {
    name: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserInput {
    name?: string;
    password?: string;
    role?: UserRole;
}
