export interface UserProfileType {
  _id: string;
  email: string;
}
export interface IUserPassword {
  password: string;
}

export interface IUserProfile {
  _id?: string;
  email?: string;
  lastname?: string;
  firstname?: string;
}
export interface UserType {
  email: string;
  password: string;
}

export interface RegisterResponse {
  ok?: boolean;
  message?: string;
  hashToken?: string;
};