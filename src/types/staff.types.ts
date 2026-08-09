export interface Staff {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface StaffLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  staff: {
    id: number;
    email: string;
    name: string;
  };
}
