export interface LoginDto {
  userName: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    userName: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}