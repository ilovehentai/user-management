export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  payment: number;
  newPayment: number;
  percentageIncrease: number;
  avatar: string;
}

export interface EditUserFormData {
  name: string;
  email: string;
  active: boolean;
  payment: number;
  newPayment: number;
  percentageIncrease: number;
}