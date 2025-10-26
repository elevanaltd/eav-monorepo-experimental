// Stub types package
export type UserId = string;
export type ProjectId = string;

export interface User {
  id: UserId;
  email: string;
  role: 'admin' | 'client';
}
