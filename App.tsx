import React, { useState, useEffect, useContext } from 'react';
import FeedScreen from './screens/FeedScreen';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AdminLoginModal from './components/AdminLoginModal';
import { WifiOffIcon } from './components/Icons';
import { AdminContext } from './context/AdminContext';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { user, login } = useContext(AdminContext);

  const handleOffline = () => setIsOffline(true);
  const handleOnline = () => setIsOffline(false);

  useEffect(() => {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  const handleLogin = async (password: string) => {
    const result = await login(password);
    if (result.success) {
      setIsLoginModalOpen(false);
    }
    return result; // Return the result object for the modal to handle
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {isOffline && (
        <div className="bg-yellow-500 text-black text-center p-2 text-sm font-semibold flex items-center justify-center fixed top-0 w-full z-50 shadow-md">
          <WifiOffIcon className="w-4 h-4 me-2"/>
          أنت غير متصل. يتم عرض محتوى محفوظ.
        </div>
      )}
      <Header 
        onMenuClick={() => setIsMenuOpen(true)}
        onLogoTripleClick={() => setIsLoginModalOpen(true)}
      />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main className="max-w-lg mx-auto">
        <FeedScreen />
      </main>
      
      {isLoginModalOpen && !user && (
        <AdminLoginModal 
          onClose={() => setIsLoginModalOpen(false)}
          onSubmit={handleLogin}
        />
      )}
    </div>
  );
};

export default App;