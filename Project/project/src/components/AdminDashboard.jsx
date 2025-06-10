import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Building, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { getUsers, addUser } from '../utils/storage';
import { getDepartments } from '../utils/auth';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    password: '',
    dept: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const departments = getDepartments();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedDept]);

  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  const filterUsers = () => {
    let filtered = users;
    if (selectedDept) {
      filtered = users.filter(user => user.dept === selectedDept);
    }
    setFilteredUsers(filtered);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newEmployee.username.trim() || !newEmployee.password.trim() || !newEmployee.dept) {
      setError('All fields are required');
      return;
    }

    if (users.some(u => u.username === newEmployee.username)) {
      setError('Username already exists');
      return;
    }

    try {
      addUser({
        username: newEmployee.username,
        password: newEmployee.password,
        role: 'employee',
        dept: newEmployee.dept
      });

      setSuccess('Employee added successfully!');
      setNewEmployee({ username: '', password: '', dept: '' });
      setShowAddEmployee(false);
      loadUsers();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add employee');
    }
  };

  const students = filteredUsers.filter(user => user.role === 'student');
  const employees = filteredUsers.filter(user => user.role === 'employee');

  const getDeptCounts = () => {
    const counts = {};
    users.filter(u => u.role === 'student').forEach(user => {
      if (user.dept) {
        counts[user.dept] = (counts[user.dept] || 0) + 1;
      }
    });
    return counts;
  };

  const deptCounts = getDeptCounts();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage users and view system statistics</p>
      </div>

      {success && (
        <div className="mb-6 flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-md border border-green-200">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-md border border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'student').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'employee').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(deptCounts).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students by Department */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Students by Department</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(deptCounts).map(([dept, count]) => (
            <div key={dept} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-700">{dept}</span>
              <span className="text-sm font-bold text-blue-600">{count} students</span>
            </div>
          ))}
        </div>
      </div>


      <div className="mb-6">
        <button
          onClick={() => setShowAddEmployee(!showAddEmployee)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>


      {showAddEmployee && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Employee</h2>
          <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={newEmployee.dept}
                onChange={(e) => setNewEmployee({ ...newEmployee, dept: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex space-x-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Add Employee
              </button>
              <button type="button" onClick={() => setShowAddEmployee(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}


      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {selectedDept && (
            <button
              onClick={() => setSelectedDept('')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Students {selectedDept && `- ${selectedDept}`}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length > 0 ? (
                  students.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dept || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Employees {selectedDept && `- ${selectedDept}`}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dept || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
