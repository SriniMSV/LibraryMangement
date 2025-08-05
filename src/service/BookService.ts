import { Book, Rental } from '../types';
import { httpService } from './httpService';
import { addDays } from 'date-fns';

export const bookService = {
    async addBook(book: Book): Promise<Book> {
        // Omit 'id' from the book object before sending to API
        const { id, ...bookWithoutId } = book;
        const response = await httpService.post<Book>('/api/books', bookWithoutId);
        return response.data;
    },

    async getBooks(): Promise<Book[]> {
        const response = await httpService.get<Book[]>('/api/books');
        console.log("getBooks " + response.data);
        return response.data;
    },

    // delete the book
    async deleteBook(bookId: string): Promise<void> {
        const response = await httpService.delete(`/api/books`, { data: { bookId } });
        if (!response || response.status !== 200) {
            throw new Error('Failed to delete book');
        }
    },

    // update the book
    async updateBook(book: Book): Promise<void> {
        const response = await httpService.put(`/api/books`, book);
        if (!response || response.status !== 200) {
            throw new Error('Failed to update book');
        }
    },

    // set book as rental
    async rentBook(bookId: string, userId: string, rentalDays: number = 14): Promise<void> {
        const dueDate = addDays(new Date(), rentalDays).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        const response = await httpService.post(`/api/borrow`, { 
            userId: parseInt(userId), // Convert to integer as backend expects int
            bookId: parseInt(bookId), // Also convert bookId to int for consistency
            dueDate: dueDate, // Include the calculated due date
            action: "borrow" 
        });
        if (!response || response.status !== 200) { 
            throw new Error('Failed to rent book');
        }
    },

    // get rental books
    async getRentalBooks(userId: string): Promise<Rental[]> {
        const response = await httpService.get<Rental[]>(`/api/borrow?userId=${userId}`);
        if (!response || !response.data) {
            throw new Error('Failed to fetch rental books');
        }
        return response.data;
    },

    // return book
    async returnBook(recordId: number): Promise<void> {
        console.log('Returning book with recordId:', recordId);
        const payload = { recordId: recordId };
        console.log('PUT payload:', payload);
        
        const response = await httpService.put(`/api/borrow`, payload);
        console.log('PUT response:', response);
        
        if (!response || response.status !== 200) { 
            throw new Error('Failed to return book');
        }
    },
};