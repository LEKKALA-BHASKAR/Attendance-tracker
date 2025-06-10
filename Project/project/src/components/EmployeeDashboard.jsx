import React, { useState, useEffect } from 'react';
import { Users, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { getUsers, deleteUser } from '../utils/storage';

const EmployeeDashboard = () => {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  const handleDeleteStudent = (userId, username) => {
    try {
      deleteUser(userId);
      setSuccess(`Student ${username} deleted successfully!`);
      loadUsers();
      setShowDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const students = users.filter(user => user.role === 'student');
  const employees = users.filter(user => user.role === 'employee');
  const admins = users.filter(user => user.role === 'admin');

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="mt-2 text-gray-600">View and manage users in the system</p>
      </div>

      {success && (
        <div className="mb-6 flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-md border border-green-200">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            All Users
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.dept || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === 'student' ? (
                        <div>
                          {showDeleteConfirm === user.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDeleteStudent(user.id, user.username)}
                                className="text-red-600 hover:text-red-900 text-xs"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="text-gray-600 hover:text-gray-900 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowDeleteConfirm(user.id)}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              title="Delete student"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-xs">Delete</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Protected</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Users by Department</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Set(users.filter(u => u.dept).map(u => u.dept))).map(dept => {
            const deptUsers = users.filter(u => u.dept === dept);
            const studentCount = deptUsers.filter(u => u.role === 'student').length;
            const employeeCount = deptUsers.filter(u => u.role === 'employee').length;

            return (
              <div key={dept} className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">{dept}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Students: {studentCount}</p>
                  <p>Employees: {employeeCount}</p>
                  <p className="font-medium">Total: {deptUsers.length}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
