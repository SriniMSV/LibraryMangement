export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
  imageUrl?: string;
  addedBy?: string; // Admin who added the book
  addedDate?: Date;
}

export interface Rental {
  id: string; // This is the record ID from the backend
  userId: string;
  bookId: string;
  bookTitle: string;
  email?: string; // User's email for display
  rentalDate: string | Date; // API returns as string, but we might convert to Date
  dueDate: string | Date; // API returns as string, but we might convert to Date
  returnDate?: string | Date; // API returns as string, but we might convert to Date
  isReturned: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface AddBookData {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  totalCopies: number;
  imageUrl?: string;
} 