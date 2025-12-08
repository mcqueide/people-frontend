export interface PersonRequest {
  name: string;
  birthday?: string; // ISO date string (YYYY-MM-DD)
  address?: string;
  phone?: string;
}

export interface PersonResponse {
  id: string; // UUID
  name: string;
  birthday?: string; // ISO date string (YYYY-MM-DD)
  address?: string;
  phone?: string;
}
