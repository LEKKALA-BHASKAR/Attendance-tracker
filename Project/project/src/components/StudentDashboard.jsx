import React from 'react';
import { User, Calendar, Building, Shield } from 'lucide-react';

const StudentDashboard = ({ currentUser }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">View your personal information and account details</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
              <p className="text-blue-100">Student Account</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                Personal Information
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Username:</span>
                  <span className="text-sm text-gray-900">{currentUser.username}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">User ID:</span>
                  <span className="text-sm text-gray-900">#{currentUser.id}</span>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2 text-gray-600" />
                Academic Information
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Department:</span>
                  <span className="text-sm text-gray-900">{currentUser.dept || 'Not Assigned'}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Role:</span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Student
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Shield className="w-5 h-5 mr-2 text-gray-600" />
              Account Details
            </h3>

            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Account Created:</span>
                </div>
                <span className="text-sm text-gray-900">{formatDate(currentUser.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Account Status: Active</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your account is active and in good standing. You have access to all student features and resources.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600">
             Under construction so No more features for you if you have any doubts ask your Dept employeee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
