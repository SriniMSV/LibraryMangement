import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ActionIcon } from '@mantine/core';
import { Trash2, Edit2 } from 'lucide-react'
import { userService } from '../service/UserService';

interface UserManagementProps {
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  currentUserId?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ onUpdateUserRole, currentUserId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    // Fetch users from the service
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getUsers(currentUserId);
        console.log("Fetched Users: ", fetchedUsers);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    if (currentUserId) {
      fetchUsers();
    }
  }, [currentUserId]);
  

  // const handleRoleChange = async (user: User) => {
  //   setSelectedUser(user);
  //   setShowRoleModal(true);
  //   try {
  //     await userService.updateUserRole(user.id, user.role);
  //     alert(`User role updated successfully! ${user.name} is now ${user.role}.`);
  //   } catch (error) {
  //     console.error('Error updating user role:', error);
  //     // alert('Failed to update user role. Please try again later.');
  //     return;
  //   }
  // };

  const handleRoleChange = (user: User) => {
  setSelectedUser(user);
  setShowRoleModal(true);
  };  

  const confirmRoleChange = async (newRole: UserRole) => {
    if (selectedUser) {
      try {
        await userService.updateUserRole(selectedUser.id, newRole);
        const updatedUsers = users.map(user =>
          user.id === selectedUser.id ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        onUpdateUserRole(selectedUser.id, newRole);
        setShowRoleModal(false);
        setSelectedUser(null);
        alert(`User role updated successfully! ${selectedUser.name} is now ${newRole}.`);
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('Failed to update user role. Please try again later.');
      }
    }
  };
  

  const getRoleBadgeColor = (role: UserRole) => {
    return role === UserRole.ADMIN 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      alert('User deleted successfully!');
      // Refresh the users list after successful deletion
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user. Please try again later.';
      alert(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">User Management</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Users</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleRoleChange(user)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setUserToDelete(user);
                        
                        // alert(`User ${user.name} deleted successfully!`);
                      }}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                        <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change User Role</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Current user: <strong>{selectedUser.name}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Current role: <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Role
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.USER}
                    defaultChecked={selectedUser.role === UserRole.USER}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">User - Can browse and rent books</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.ADMIN}
                    defaultChecked={selectedUser.role === UserRole.ADMIN}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Admin - Can manage books and users</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const form = document.querySelector('input[name="role"]:checked') as HTMLInputElement;
                  if (form) {
                    confirmRoleChange(form.value as UserRole);
                  }
                }}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
      {userToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
      <p className="text-sm text-gray-700 mb-6">
        Are you sure you want to delete <strong>{userToDelete.name}</strong>?
        This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setUserToDelete(null)}
          className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await handleDeleteUser(userToDelete.id);
            setUserToDelete(null);
          }}
          className="py-2 px-4 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
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

export default UserManagement; 