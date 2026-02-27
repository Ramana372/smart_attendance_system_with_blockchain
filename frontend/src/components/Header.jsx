import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineCog,
} from 'react-icons/hi';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'faculty') return '/faculty/dashboard';
    if (user.role === 'student') return '/student/dashboard';
    return '/';
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to={dashLink()} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="8" fill="currentColor" opacity="0.12" />
              <path d="M12 34L24 14L36 34H12Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="font-semibold text-lg text-gray-800">Digital ID Attendance</h1>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm hover:text-indigo-600 flex items-center gap-1">
                  <HiOutlineCog className="w-4 h-4" /> Admin
                </Link>
              )}
              {user.role === 'faculty' && (
                <Link to="/faculty/dashboard" className="text-sm hover:text-indigo-600 flex items-center gap-1">
                  <HiOutlineAcademicCap className="w-4 h-4" /> Dashboard
                </Link>
              )}
              {user.role === 'student' && (
                <Link to="/student/dashboard" className="text-sm hover:text-indigo-600 flex items-center gap-1">
                  <HiOutlineUser className="w-4 h-4" /> My Dashboard
                </Link>
              )}
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">
                {user.first_name || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline ml-2 flex items-center gap-1"
              >
                <HiOutlineLogout className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm hover:text-indigo-600 flex items-center gap-1">
                <HiOutlineHome className="w-4 h-4" /> Home
              </Link>
              <Link to="/login" className="text-sm hover:text-indigo-600 flex items-center gap-1">
                <HiOutlineLogin className="w-4 h-4" /> Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
