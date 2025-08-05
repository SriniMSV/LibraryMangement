import React, { useState, useEffect } from 'react';
import { Book, Rental, UserRole } from '../types';
import { addDays } from 'date-fns';
import BookList from './BookList';
import RentalHistory from './RentalHistory';
import AddBook from './AddBook';
import UserManagement from './UserManagement';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../service/BookService';
// import { useEffect } from 'react';

type TabType = 'books' | 'rentals' | 'addBook' | 'users';

// get the book


// console.log(booklist);
const Dashboard: React.FC = () => {
  // const {booklist} = bookService.getBooks();
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [fetchRentals, setFetchRentals] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('books');
  const isAdmin = user?.role === UserRole.ADMIN;

  const fetchRentalsData = async () => {
    try {
      const fetchedRentals = await bookService.getRentalBooks(user?.id || '');
      console.log("Fetched Rentals: ", fetchedRentals);
      console.log("First rental structure:", fetchedRentals[0]);
      console.log("First rental keys:", fetchedRentals[0] ? Object.keys(fetchedRentals[0]) : 'No rentals');
      setRentals(fetchedRentals);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
    }
  };

  useEffect(() => {
    // Fetch rentals from the service
    if (fetchRentals && user?.id) {
      fetchRentalsData();
      setFetchRentals(false);
    }
  }, [fetchRentals, user?.id]);

  useEffect(() => {
    // Fetch books from the service
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await bookService.getBooks();
        console.log("Fetched Books: ", fetchedBooks);
        setBooks(fetchedBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleRentBook = async (book: Book, rentalDays: number) => {
    try {
      await bookService.rentBook(book.id, user?.id || '', rentalDays);
      await handleRefresh(); // Refresh the page data after successful rental
      await fetchRentalsData(); // Refresh rentals data
    } catch (error) {
      console.error('Error renting book:', error);
      alert('Failed to rent book. Please try again later.');
      return;
    }
  };

  const handleReturnBook = async (rentalId: string, recordId: number) => {
    console.log('handleReturnBook called with rentalId:', rentalId, 'recordId:', recordId);
    try {
      await bookService.returnBook(recordId);
      
      // Refresh both books and rentals data
      await handleRefresh();
      await fetchRentalsData();
      
      alert('Book returned successfully!');
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book. Please try again later.');
    }
  };

  const handleAddBook = async (newBook: Book) => {
    // setBooks(prev => [...prev, newBook]);
    try {
      console.log("Adding book: ", newBook);
      // {
      //     "id": "1754220137688",
      //     "title": "asf",
      //     "author": "dhfdg",
      //     "isbn": "1234567890",
      //     "genre": "Fiction",
      //     "totalCopies": 1,
      //     "imageUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      //     "description": "sbnfnf",
      //     "available": true,
      //     "availableCopies": 1,
      //     "addedBy": "admin1",
      //     "addedDate": "2025-08-03T11:22:17.688Z"
      // }
      // const { id, ...bookData } = newBook;
      await bookService.addBook(newBook);
      await handleRefresh();
    } catch (error) {
      alert('Failed to add book. Please try again.');
    }
  };

  const handleRefresh = async () => {
    try {
      const fetchedBooks = await bookService.getBooks();
      setBooks(fetchedBooks);
      console.log("Books refreshed: ", fetchedBooks);
    } catch (error) {
      console.error('Failed to refresh books:', error);
    }
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    // In a real app, this would update the backend
    console.log(`User ${userId} role updated to ${newRole}`);
  };

  const getTabs = () => {
    const baseTabs = [
      { id: 'books' as TabType, label: 'Browse Books' },
      { id: 'rentals' as TabType, label: isAdmin ? `Rentals List (${rentals.filter(r => !r.isReturned).length} active)` : `My Rentals (${rentals.filter(r => !r.isReturned).length} active)` },
    ];

    if (isAdmin) {
      baseTabs.push(
        { id: 'addBook' as TabType, label: 'Add Book' },
        { id: 'users' as TabType, label: 'User Management' }
      );
    }

    return baseTabs;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'books':
        return <BookList onRentBook={handleRentBook} books={books} />;
      case 'rentals':
        return <RentalHistory rentals={rentals} onReturnBook={handleReturnBook} isAdmin={isAdmin} />;
      case 'addBook':
        return isAdmin ? <AddBook onAddBook={handleAddBook} /> : null;
      case 'users':
        return isAdmin ? <UserManagement onUpdateUserRole={handleUpdateUserRole} currentUserId={user?.id} /> : null;
      default:
        return <BookList onRentBook={handleRentBook} books={books} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {getTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className="mb-6 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">
                  Admin Access - You have full management privileges
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard; 