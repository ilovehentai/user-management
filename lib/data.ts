import { User } from './types';

export const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
    payment: 1000,
    newPayment: 1100,
    percentageIncrease: 10,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    active: true,
    payment: 2000,
    newPayment: 2300,
    percentageIncrease: 15,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    active: false,
    payment: 1500,
    newPayment: 1650,
    percentageIncrease: 10,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
];