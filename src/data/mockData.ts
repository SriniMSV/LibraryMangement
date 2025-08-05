import { Book, User, UserRole } from '../types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    genre: 'Classic',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    available: true,
    totalCopies: 5,
    availableCopies: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    addedBy: 'admin1',
    addedDate: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310789',
    genre: 'Classic',
    description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
    available: true,
    totalCopies: 4,
    availableCopies: 2,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    addedBy: 'admin1',
    addedDate: new Date('2024-01-02')
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    genre: 'Dystopian',
    description: 'A dystopian novel about totalitarianism and surveillance society.',
    available: true,
    totalCopies: 6,
    availableCopies: 4,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    addedBy: 'admin1',
    addedDate: new Date('2024-01-03')
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    genre: 'Romance',
    description: 'The story of Elizabeth Bennet and Mr. Darcy in early 19th century England.',
    available: true,
    totalCopies:  3,
    availableCopies: 1,
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    addedBy: 'admin1',
    addedDate: new Date('2024-01-04')
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0547928241',
    genre: 'Fantasy',
    description: 'Bilbo Baggins embarks on an unexpected journey with thirteen dwarves.',
    available: true,
    totalCopies: 7,
    availableCopies: 5,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    addedBy: 'admin1',
    addedDate: new Date('2024-01-05')
  },
  {
    id: '6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0316769488',
    genre: 'Coming-of-age',
    description: 'Holden Caulfield\'s journey through New York City after being expelled from prep school.',
    available: true,
    totalCopies: 4,
    availableCopies: 2,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    addedBy: 'admin1',
    addedDate: new Date('2024-01-06')
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    name: 'John Doe',
    role: UserRole.USER
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: UserRole.USER
  },
  {
    id: '3',
    username: 'SriniVasan',
    email: 'srinivasan@gmail.com',
    name: 'Srini Vasan',
    role: UserRole.USER
  },
  {
    id: 'admin1',
    username: 'admin',
    email: 'admin@library.com',
    name: 'Library Admin',
    role: UserRole.ADMIN
  },
  {
    id: 'admin2',
    username: 'superadmin',
    email: 'superadmin@library.com',
    name: 'Super Admin',
    role: UserRole.ADMIN
  }
];

export const mockRentals = [
  {
    id: '1',
    userId: '1',
    bookId: '1',
    bookTitle: 'The Great Gatsby',
    rentalDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    returnDate: undefined,
    isReturned: false
  }
]; 