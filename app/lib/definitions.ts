export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
};

export type GroupPlayer = {
  id: string;
  groupId: string;
  playerId: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateGroupPlayerInput = {
  groupId: string;
  playerId: string;
};

export type UpdateGroupPlayerInput = {
  id: string;
  groupId: string;
  playerId: string;
};


export type Group = {
  id: string;   // UUID
  name: string;
  region: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateGroupInput = {
  name: string;
  region?: string;
};

export type UpdateGroupInput = {
  id: string;
  name: string;
  region?: string;
};

export type GroupFormValues = {
  id?: string;
  name: string;
  region?: string;
};

export type InvoiceStatus = "paid";

export type Invoice = {
  id: string;
  player_id: string;
  amount: number;
  month: number;
  year: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
};

export type Presence = {
  id: string;
  player_id: string;
  month: number;
  year: number;
  count: number;
  created_at: string;
  updated_at: string;
};

export type Player = {
  id: string;
  name: string;
  nik: string;
  email: string;
  birthdate?: string;
  birth_place: string;
  phone?: string;
  address?: string;
  region: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CreatePlayerInput = {
  name: string;
  nik: string;
  email: string;
  birth_place: string;
  birthdate?: string;
  phone?: string;
  address?: string;
  region?: string;
  is_active?: boolean;
};

export type UpdatePlayerInput = {
  id: string;
  name: string;
  nik: string;
  email: string;
  birth_place: string;
  birthdate?: string;
  phone?: string;
  address?: string;
  region?: string;
  is_active?: boolean;
};

export type PlayerFormValues = {
  id?: string;
  name: string;
  nik: string;
  email: string;
  birth_place: string;
  birthdate?: string;
  phone?: string;
  address?: string;
  region?: string;
  is_active?: boolean;
};
