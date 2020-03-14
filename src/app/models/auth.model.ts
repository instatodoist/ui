export interface UserType {
    email: string;
    password: string;
}

export interface RegisterResponse {
    ok?: boolean;
    message?: string;
    hashToken?: string;
}