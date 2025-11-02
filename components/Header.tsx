import React from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

const Logo: React.FC = () => (
  <svg width="85" height="32" viewBox="0 0 85 32" xmlns="http://www.w.org/2000/svg">
    <text x="0" y="26" fontFamily="Cairo, sans-serif" fontSize="30" fontWeight="800" letterSpacing="-0.5">
      <tspan fill="#266f68">حِر</tspan>
      <tspan fill="#d97706">َفي</tspan>
    </text>
  </svg>
);


const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="bg-neutral-50/60 backdrop-blur-xl border-b border-neutral-200/60 sticky top-0 z-40">
      <div className="max-w-lg mx-auto p-4 flex justify-between items-center h-16">
        {/* Menu button on the right for RTL */}
        {onMenuClick ? (
          <button onClick={onMenuClick} className="text-neutral-600 p-2 rounded-full hover:bg-neutral-200/60">
            <MenuIcon className="w-6 h-6" />
          </button>
        ) : <div className="w-10" />}

        {title ? (
            <h1 className="text-2xl font-bold text-brand-700 font-heading">{title}</h1>
        ) : (
            <div className="cursor-pointer select-none">
              <Logo />
            </div>
        )}
        
        {/* Placeholder on the left for RTL */}
        <div className="w-10" />
      </div>
    </header>
  );
};

export default Header;