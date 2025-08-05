import React, { useState } from 'react';
import { Book, UserRole } from '../types';
import { format, addDays } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { bookService } from '../service/BookService';
import { useAuth } from '../context/AuthContext';
import { Edit2 } from 'lucide-react';

interface BookListProps {
  onRentBook: (book: Book, rentalDays: number) => void;
  books?: Book[];
}

const BookList: React.FC<BookListProps> = ({ onRentBook, books = [] }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rentalDays, setRentalDays] = useState(14);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [editTotalCopies, setEditTotalCopies] = useState(0);
  const [editAvailableCopies, setEditAvailableCopies] = useState(0);
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const handleRentClick = (book: Book) => {
    setSelectedBook(book);
    setShowRentalModal(true);
  };

  const handleConfirmRental = () => {
    if (selectedBook) {
      onRentBook(selectedBook, rentalDays);
      setShowRentalModal(false);
      setSelectedBook(null);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    await bookService.deleteBook(bookId);
    // Optionally refresh book list here
  };

  // Edit logic
  const handleEditClick = (book: Book) => {
    setEditBook(book);
    setEditTotalCopies(book.totalCopies);
    setEditAvailableCopies(book.availableCopies);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (editBook) {
      const updatedBook = {
        ...editBook,
        totalCopies: editTotalCopies,
        availableCopies: editAvailableCopies,
      };
      await bookService.updateBook(updatedBook); // You need to implement updateBook in BookService
      setShowEditModal(false);
      setEditBook(null);
      // Optionally refresh book list here
      window.location.reload(); // Or call a prop to refresh
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Books</h2>
      {books.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No books available</h3>
          <p className="text-gray-600">Check back later for new additions to our collection!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200">
                {book.imageUrl ? (
                  <img 
                    src={book.imageUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditClick(book)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        title="Edit Book"
                      >
                        <Edit2 size={16} className="text-gray-400 hover:text-blue-600 transition-colors" />
                      </button>
                      <button
                        onClick={() => {
                          setBookToDelete(book);
                          setShowDeleteModal(true);
                        }}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        title="Delete Book"
                      >
                        <Trash2 size={16} className="text-gray-400 hover:text-red-600 transition-colors" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                <p className="text-sm text-gray-500 mb-2">Genre: {book.genre}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{book.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    Available: {book.availableCopies}/{book.totalCopies}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.availableCopies > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <button
                  onClick={() => handleRentClick(book)}
                  disabled={book.availableCopies === 0}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    book.availableCopies > 0
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {book.availableCopies > 0 ? 'Rent Book' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Edit Book Stock</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Copies</label>
              <input
                type="number"
                min={0}
                value={editTotalCopies}
                onChange={e => setEditTotalCopies(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Copies</label>
              <input
                type="number"
                min={0}
                max={editTotalCopies}
                value={editAvailableCopies}
                onChange={e => setEditAvailableCopies(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rental Modal */}
      {showRentalModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Rent "{selectedBook.title}"</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Duration (days)
              </label>
              <select
                value={rentalDays}
                onChange={(e) => setRentalDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Due Date:</strong> {format(addDays(new Date(), rentalDays), 'PPP')}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRentalModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRental}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Confirm Rental
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && bookToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-xl font-semibold mb-4 text-red-600">Confirm Delete</h3>
      <p className="text-gray-700 mb-4">
        Are you sure you want to delete the book <strong>{bookToDelete.title}</strong>?
      </p>
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await handleDeleteBook(bookToDelete.id);
            alert(`Deleted: ${bookToDelete.title}`);
            setShowDeleteModal(false);
            setBookToDelete(null);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default BookList; 