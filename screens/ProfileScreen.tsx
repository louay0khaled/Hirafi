import React, { useState } from 'react';
import { craftsmen } from '../data/craftsmen';
import { BackIcon, LocationIcon, StarIcon, PhoneIcon, ShareIcon } from '../components/Icons';

interface ProfileScreenProps {
  craftsmanId: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ craftsmanId }) => {
  const craftsman = craftsmen.find(c => c.id === craftsmanId);
  const [activeTab, setActiveTab] = useState('portfolio');

  if (!craftsman) {
    return (
      <div className="max-w-lg mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-xl font-bold">الحرفي غير موجود</h2>
        <a href="#browse" className="mt-4 text-brand-600">العودة إلى التصفح</a>
      </div>
    );
  }

  const handleShare = async () => {
    const shareData = {
      title: `تعرف على ${craftsman.name} في تطبيق حرفي`,
      text: `شاهد أعمال ${craftsman.name}، حرفي ${craftsman.craft} من ${craftsman.governorate}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        alert('ميزة المشاركة غير مدعومة في هذا المتصفح.');
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };


  return (
    <div className="max-w-lg mx-auto bg-white min-h-screen">
      <header className="relative">
        <img src={craftsman.headerImageUrl} alt={`${craftsman.name} header`} className="w-full h-40 object-cover" />
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-center">
          <a href="#browse" className="text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors">
            <BackIcon />
          </a>
          <button onClick={handleShare} className="text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors">
            <ShareIcon />
          </button>
        </div>
        <div className="absolute -bottom-12 start-1/2 -translate-x-1/2">
          <img src={craftsman.avatarUrl} alt={craftsman.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
        </div>
      </header>

      <div className="pt-16 px-4 pb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{craftsman.name}</h1>
        <p className="text-md text-brand-700 font-semibold">{craftsman.craft}</p>
        <div className="flex justify-center items-center text-gray-600 mt-2 text-sm">
          <LocationIcon />
          <span className="ms-1">{craftsman.governorate}</span>
          <span className="mx-2">·</span>
          <div className="flex items-center text-yellow-500">
            <StarIcon />
            <span className="ms-1 font-bold">{craftsman.rating.toFixed(1)}</span>
            <span className="ms-1 text-gray-500">({craftsman.reviews} تقييم)</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <a 
          href={`tel:${craftsman.phone}`}
          className="w-full flex items-center justify-center bg-brand-700 text-white font-bold py-3 rounded-lg hover:bg-brand-800 transition-colors duration-300 shadow-lg"
        >
          <PhoneIcon className="me-2"/>
          اتصال
        </a>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex justify-around -mb-px">
          <button 
            onClick={() => setActiveTab('portfolio')} 
            className={`py-4 px-1 text-center font-medium text-sm border-b-2 ${activeTab === 'portfolio' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            معرض الأعمال
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 text-center font-medium text-sm border-b-2 ${activeTab === 'details' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            التفاصيل
          </button>
        </nav>
      </div>

      <div className="p-4">
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {craftsman.portfolio.map((imgUrl, index) => (
              <div key={index} className="aspect-square">
                <img src={imgUrl} alt={`Portfolio work ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
              </div>
            ))}
          </div>
        )}
        {activeTab === 'details' && (
          <div>
            <h3 className="text-lg font-bold mb-2">عن الحرفي</h3>
            <p className="text-gray-700 leading-relaxed">{craftsman.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;