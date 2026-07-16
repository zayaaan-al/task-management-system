import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = ({ onSearch }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
  toast.success('Logged out successfully! 👋');

  setMenuOpen(false);

  setTimeout(() => {
    logoutUser();
    navigate('/login');
  }, 1000);
};
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-[#c3c6d7] shadow-sm">
      <div className="flex justify-between items-center w-full h-16 px-6 lg:px-8 max-w-[1440px] mx-auto">
        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-2xl font-extrabold font-['Manrope'] text-[#004ac6] tracking-tight select-none">
            TaskFlow
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-semibold pb-1.5 transition-colors ${location.pathname === '/dashboard' ? 'text-[#004ac6] border-b-2 border-[#004ac6]' : 'text-[#434655] hover:text-[#004ac6]'}`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center bg-[#f2f4f6] px-4 py-2 rounded-lg gap-2 border border-[#c3c6d7] focus-within:border-[#004ac6] transition-colors">
            <span className="material-symbols-outlined text-[#737686]" style={{ fontSize: 20 }}>search</span>
            <input
              className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-[#737686]"
              placeholder="Search tasks..."
              type="text"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>

          {/* User Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#eceef0] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#004ac6] text-white text-sm font-bold flex items-center justify-center select-none">
                {initials}
              </div>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-level-2 border border-[#c3c6d7] py-2 z-50 animate-modal-in">
                <div className="px-4 py-3 border-b border-[#eceef0]">
                  <p className="text-sm font-semibold text-[#191c1e]">{user?.name || 'User'}</p>
                  <p className="text-xs text-[#737686] truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="lg:hidden px-6 pb-3">
        <div className="flex items-center bg-[#f2f4f6] px-4 py-2 rounded-lg gap-2 border border-[#c3c6d7]">
          <span className="material-symbols-outlined text-[#737686]" style={{ fontSize: 20 }}>search</span>
          <input
            className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-[#737686]"
            placeholder="Search tasks..."
            type="text"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
