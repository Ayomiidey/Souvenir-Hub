export interface UserType {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  token?: string;
}

export interface AuthState {
  user: UserType | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
