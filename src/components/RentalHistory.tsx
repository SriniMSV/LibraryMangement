import React from 'react';
import { Rental } from '../types';
import { format, isAfter, isBefore, isValid } from 'date-fns';

interface RentalHistoryProps {
  rentals: Rental[];
  onReturnBook: (rentalId: string, recordId: number) => void;
  isAdmin?: boolean;
}

const RentalHistory: React.FC<RentalHistoryProps> = ({ rentals, onReturnBook, isAdmin = false }) => {
  // Helper function to safely format dates
  const safeFormat = (date: any, formatStr: string) => {
    const d = new Date(date);
    return isValid(d) ? format(d, formatStr) : 'Invalid date';
  };

  const getStatusColor = (rental: Rental) => {
    if (rental.isReturned) {
      return 'bg-green-100 text-green-800';
    }
    if (isAfter(new Date(), rental.dueDate)) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (rental: Rental) => {
    if (rental.isReturned) {
      return 'Returned';
    }
    if (isAfter(new Date(), rental.dueDate)) {
      return 'Overdue';
    }
    return 'Active';
  };

  const isOverdue = (rental: Rental) => {
    return !rental.isReturned && isAfter(new Date(), rental.dueDate);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {isAdmin ? 'Rentals List' : 'My Rentals'}
      </h2>
      
      {rentals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No rentals yet</h3>
          <p className="text-gray-600">Start exploring our collection and rent your first book!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div key={rental.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {rental.bookTitle}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {rental.email && (
                      <p><strong>Email:</strong> {rental.email}</p>
                    )}
                    <p><strong>Rental Date:</strong> {safeFormat(rental.rentalDate, 'PPP')}</p>
                    <p><strong>Due Date:</strong> {safeFormat(rental.dueDate, 'PPP')}</p>
                    {rental.returnDate && rental.returnDate !== "null" && (
                      <p><strong>Return Date:</strong> {safeFormat(rental.returnDate, 'PPP')}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental)}`}>
                    {getStatusText(rental)}
                  </span>
                  
                  {!rental.isReturned && isAdmin && (
                    <button
                      onClick={() => {
                        console.log('Return Book clicked for rental:', rental);
                        console.log('recordId (using rental.id):', rental.id);
                        onReturnBook(rental.id, parseInt(rental.id));
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Return Book
                    </button>
                  )}
                </div>
              </div>
              
              {isOverdue(rental) && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">
                    ⚠️ This book is overdue. Please return it as soon as possible.
                  </p>
                </div>
              )}
              
              {rental.isReturned && rental.returnDate && rental.returnDate !== "null" && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">
                    ✅ Book successfully returned on {safeFormat(rental.returnDate, 'PPP')}
                  </p>
                </div>
              )}
              
              {rental.isReturned && (!rental.returnDate || rental.returnDate === "null") && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">
                    ✅ Book successfully returned
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalHistory; 