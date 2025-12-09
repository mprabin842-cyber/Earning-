import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, CheckSquare, Wallet, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link to={to} className="flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200 relative">
      <div className={`p-1.5 rounded-xl mb-1 transition-all ${isActive(to) ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400'}`}>
        <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} />
      </div>
      <span className={isActive(to) ? 'text-emerald-700' : 'text-slate-400'}>{label}</span>
      {isActive(to) && (
        <span className="absolute -top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      )}
    </Link>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-100 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 h-20 shadow-lg z-50 rounded-t-2xl">
        <div className="flex justify-around items-center h-full pb-2">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/tasks" icon={CheckSquare} label="Tasks" />
          <NavItem to="/wallet" icon={Wallet} label="Wallet" />
          <NavItem to="/profile" icon={UserIcon} label="Profile" />
        </div>
      </nav>
    </div>
  );
};

export default Layout;