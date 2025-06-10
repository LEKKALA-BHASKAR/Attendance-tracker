import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Users, Shield } from 'lucide-react';
import { clearCurrentUser } from '../utils/storage';

const Navigation = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearCurrentUser();
    onLogout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'employee': return <Users className="w-4 h-4" />;
      case 'student': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50 border-red-200';
      case 'employee': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'student': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleColor(currentUser.role)}`}>
              {getRoleIcon(currentUser.role)}
              <span className="text-sm font-medium capitalize">{currentUser.role}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{currentUser.username}</span>
              {currentUser.dept && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{currentUser.dept}</span>
                </>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;