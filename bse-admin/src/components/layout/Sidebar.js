import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Tag, Package, FolderOpen,
  MessageSquare, FileText, X, Zap, UserCircle
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/categories',   icon: Tag,             label: 'Catégories'      },
  { to: '/products',     icon: Package,         label: 'Produits'        },
  { to: '/projects',     icon: FolderOpen,      label: 'Projets'         },
  { to: '/messages',     icon: MessageSquare,   label: 'Messages'        },
  { to: '/site-content', icon: FileText,        label: 'Contenus du site'},
  { to: '/mon-compte',   icon: UserCircle,      label: 'Mon compte'      },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30
      w-64 bg-dark text-white flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Burkina Solar</p>
            <p className="text-xs text-white/50">Administration</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-white/70 hover:bg-white/10 hover:text-white'}
            `}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">BSE Admin v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;