import React, { useRef } from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  onMenuClick?: () => void;
  onLogoTripleClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onLogoTripleClick, title }) => {
  const clickCount = useRef(0);
  const clickTimer = useRef<number | null>(null);

  const handleLogoClick = () => {
    if (!onLogoTripleClick) {
      return;
    }
    clickCount.current += 1;

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 500); // Reset after 500ms

    if (clickCount.current === 3) {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }
      clickCount.current = 0;
      onLogoTripleClick();
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-lg mx-auto p-4 flex justify-between items-center h-16">
        {/* Menu button on the right for RTL */}
        {onMenuClick ? (
          <button onClick={onMenuClick} className="text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MenuIcon className="w-6 h-6" />
          </button>
        ) : <div className="w-10" />}

        {title ? (
            <h1 className="text-2xl font-bold text-brand-700">{title}</h1>
        ) : (
            <div className="cursor-pointer select-none" onClick={handleLogoClick}>
              <h1 className="text-3xl font-extrabold">
                <span className="text-brand-700">حِر</span><span className="text-accent-500">َفي</span>
              </h1>
            </div>
        )}
        
        {/* Placeholder on the left for RTL */}
        <div className="w-10" />
      </div>
    </header>
  );
};

export default Header;