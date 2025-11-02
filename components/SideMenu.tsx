import React, { useContext } from 'react';
import { CloseIcon, WhatsappIcon, LogoutIcon, LoginIcon } from './Icons';
import { AdminContext } from '../context/AdminContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginClick: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onAdminLoginClick }) => {
  const { user, logout } = useContext(AdminContext);

  const whatsappMessage = "مرحباً فريق حرفي، أنا حرفي وأرغب بالانضمام إلى تطبيقكم. هل يمكنني الحصول على مزيد من المعلومات؟";
  const whatsappLink = `https://wa.me/963992705838?text=${encodeURIComponent(whatsappMessage)}`;

  const handleLogout = () => {
    logout();
    onClose();
  };
  
  const handleAdminLogin = () => {
    onAdminLoginClick();
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-neutral-50 shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidemenu-title"
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-neutral-200 flex-shrink-0">
          <h2 id="sidemenu-title" className="text-xl font-bold text-brand-700">القائمة</h2>
          <button onClick={onClose} className="p-2 text-neutral-600 hover:bg-neutral-200/60 rounded-full">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-4">
            <p className="text-neutral-600 mb-4 text-sm">
              هل أنت حرفي وترغب بالانضمام؟ تواصل معنا لنشر صفحتك مجاناً.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-white text-green-600 font-semibold py-2.5 px-3 rounded-xl hover:bg-green-50 border-2 border-green-500"
            >
              <WhatsappIcon className="me-2 w-5 h-5" />
              تواصل عبر واتساب
            </a>
          </div>
          
          <div className="p-4 border-t border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-500 mb-3 px-1">الإدارة</h3>
              {user ? (
                   <button
                      onClick={handleLogout}
                      className="flex items-center w-full bg-neutral-100 text-neutral-700 font-bold py-3 px-4 rounded-xl hover:bg-neutral-200 text-sm"
                  >
                      <LogoutIcon className="me-3 w-5 h-5" />
                      تسجيل الخروج
                  </button>
              ) : (
                  <button
                      onClick={handleAdminLogin}
                      className="flex items-center w-full bg-neutral-100 text-neutral-700 font-bold py-3 px-4 rounded-xl hover:bg-neutral-200 text-sm"
                  >
                      <LoginIcon className="me-3 w-5 h-5 transform -scale-x-100" />
                      تسجيل دخول المدير
                  </button>
              )}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="p-4 border-t border-neutral-200 bg-neutral-100 flex-shrink-0">
          <p className="text-xs text-center text-neutral-500">
            تم تصميم هذا التطبيق بواسطة <span className="font-semibold text-brand-800">Loùay Ô Khałed</span>
          </p>
        </footer>
      </div>
    </>
  );
};

export default SideMenu;