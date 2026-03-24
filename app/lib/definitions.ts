export type GroupPlayer = {
  id: string;
  groupId: string;
  playerId: string;
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
};

export type CreateGroupInput = {
  name: string;
};

export type UpdateGroupInput = {
  id: string;
  name: string;
};

export type GroupFormValues = {
  id?: string;
  name: string;
};

export type InvoiceStatus = "paid" | "pending" | "overdue";

export type Invoice = {
  id: string;
  user_id: string;
  amount: number;
  month: number;
  year: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
};

export type CreateInvoiceInput = {
  user_id: string;
  amount: number;
  month: number;
  year: number;
  status: InvoiceStatus;
};

export type UpdateInvoiceInput = {
  id: string;
  user_id: string;
  amount: number;
  month: number;
  year: number;
  status: InvoiceStatus;
};

export type InvoiceFormValues = {
  id?: string;
  user_id: string;
  amount: number;
  month: number;
  year: number;
  status: InvoiceStatus;
};

export type Player = {
  id: string;   // UUID
  name: string;
};

export type CreatePlayerInput = {
  name: string;
};

export type UpdatePlayerInput = {
  id: string;
  name: string;
};

export type PlayerFormValues = {
  id?: string;
  name: string;
};
