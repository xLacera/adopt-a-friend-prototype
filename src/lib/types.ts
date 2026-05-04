export interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  description: string;
  imageUrl: string | null;
  temperament: string;
  species: string;
  city: string;
  available: boolean;
  createdAt: string;
}

export type Role = "USER" | "ADMIN";

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export type AdoptionStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Adoption {
  id: number;
  userId: number;
  petId: number;
  message: string;
  phone: string | null;
  status: AdoptionStatus;
  createdAt: string;
  updatedAt: string;
  pet: Pet;
  user?: { id: number; name: string; email: string };
}
