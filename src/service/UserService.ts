import { RegisterData, User } from '../types';
import { httpService } from './httpService';

export const userService = {
    async addUser(user: RegisterData): Promise<RegisterData> {
        const response = await httpService.post<RegisterData>('/api/register', user);
        if (!response || !response.data) {
            throw new Error('Failed to register user');
        }
        return response.data;
    },

    // registration
    async loginUser(email: string, password: string): Promise<any> {
        const response = await httpService.post('/api/login', { email, password });
        console.log('UserService loginUser response:', response); // Debug log
        if (!response || !response.data) {
            throw new Error('Login failed');
        }
        return response.data;
    },

    // delete user
    async deleteUser(userId: string): Promise<void> {
        try {
            const response = await httpService.delete(`/api/users`, { data: { userId } });
            if (!response) {
                throw new Error('Failed to delete user');
            }
            
            if (response.status !== 200) {
                throw new Error('Failed to delete user');
            }
        } catch (error: any) {
            // Handle axios error response
            if (error.response && error.response.status === 400) {
                // Extract error message from the backend response
                let errorMessage = 'This user have to return some Books, kindly check in Rental List before deleting the user.';
                
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data && typeof error.response.data === 'string') {
                    // Try to parse JSON if it's a string
                    try {
                        const parsedData = JSON.parse(error.response.data);
                        if (parsedData.message) {
                            errorMessage = parsedData.message;
                        }
                    } catch (e) {
                        // If parsing fails, use the raw data
                        errorMessage = error.response.data;
                    }
                }
                
                throw new Error(errorMessage);
            }
            
            // Re-throw other errors
            throw error;
        }
    },

    // UPDATE USER ROLE
    async updateUserRole(userId: string, newRole: string): Promise<void> {
        const response = await httpService.put(`/api/users`, { role: newRole, userId: userId });
        if (!response || response.status !== 200) {
            throw new Error('Failed to update user role');
        }
    },

    async getUsers(currentUserId?: string): Promise<User[]> {
        const url = currentUserId ? `/api/users?currentUserId=${currentUserId}` : '/api/users';
        const response = await httpService.get<User[]>(url);
        if (!response || !response.data) {
            throw new Error('Failed to fetch users');
        }
        return response.data;
    }
};