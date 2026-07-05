import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
      {/* Bouton menu mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-dark hover:text-primary transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Titre page */}
      <div className="hidden lg:block">
        <p className="text-sm text-gray-500">Bienvenue,</p>
        <p className="font-semibold text-dark">{user?.nom}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 bg-light px-3 py-2 rounded-lg">
          <User size={16} className="text-dark" />
          <span className="text-sm font-medium text-dark hidden sm:block">{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

export default Header;