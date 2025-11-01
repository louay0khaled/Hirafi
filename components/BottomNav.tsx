
import React from 'react';
import { HomeIcon, SearchIcon, MessageIcon, UserIcon } from './Icons';

interface BottomNavProps {
  currentPath: string;
}

const NavItem: React.FC<{ href: string; label: string; icon: React.ReactNode; isActive: boolean }> = ({ href, label, icon, isActive }) => {
  const activeClasses = 'text-brand-700';
  const inactiveClasses = 'text-gray-500 hover:text-brand-600';
  
  return (
    <a href={href} className={`flex flex-col items-center justify-center flex-grow transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </a>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentPath }) => {
  const navItems = [
    { href: '#home', label: 'الرئيسية', icon: <HomeIcon /> },
    { href: '#browse', label: 'تصفح', icon: <SearchIcon /> },
    { href: '#messages', label: 'الرسائل', icon: <MessageIcon /> },
    { href: '#account', label: 'حسابي', icon: <UserIcon /> },
  ];

  return (
    <footer className="fixed bottom-0 right-0 left-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(item => (
          <NavItem 
            key={item.href}
            href={item.href} 
            label={item.label} 
            icon={item.icon} 
            isActive={currentPath === item.href}
          />
        ))}
      </nav>
    </footer>
  );
};

export default BottomNav;