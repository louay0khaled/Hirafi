import React, { useState } from 'react';
import CraftsmanCard from '../components/CraftsmanCard';
import { craftsmen } from '../data/craftsmen';
import SkeletonLoader from '../components/SkeletonLoader';
import { Craftsman } from '../types';
import Modal from '../components/Modal';
import { LocationIcon, StarIcon, PhoneIcon } from '../components/Icons';

const AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2U1ZTdlYiI+PHBhdGggZD0iTTEyIDBDNS4zNzMgMCAwIDUuMzczIDAgMTJzNS4zNzMgMTIgMTIgMTIgMTItNS4zNzMgMTItMTJTMTguNjI3IDAgMTIgMHptMCA0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHptMCAxNGMtMi42NyAwLTggMS4zNC04IDR2MWgxNnYtMWMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz4=';
const HEADER_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDE2MDAgOTAwIj48cmVjdCBmaWxsPSIjZTBlMGUwIiB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI5MDAiLz48L3N2Zz4=';


// This component was copied from FeedScreen.tsx to be used in the details modal.
const CraftsmanDetails: React.FC<{ craftsman: Craftsman }> = ({ craftsman }) => (
  <div>
    <div
      className="w-full h-40 bg-cover bg-center rounded-t-lg bg-gray-200"
      style={{ backgroundImage: `url(${craftsman.header_image_url || HEADER_PLACEHOLDER})` }}
      role="img"
      aria-label={`${craftsman.name} header`}
    />
    <div className="p-4">
        <div className="flex items-center mb-4">
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center border-4 border-white -mt-12 shadow-lg bg-gray-200"
              style={{ backgroundImage: `url(${craftsman.avatar_url || AVATAR_PLACEHOLDER})` }}
              role="img"
              aria-label={craftsman.name}
            />
            <div className="ms-4">
                <h3 className="text-xl font-bold">{craftsman.name}</h3>
                <p className="text-brand-700">{craftsman.craft}</p>
            </div>
        </div>
        <div className="flex items-center text-gray-600 mt-2 text-sm">
          <LocationIcon />
          <span className="ms-1">{craftsman.governorate}</span>
          <span className="mx-2">·</span>
          <div className="flex items-center text-yellow-500">
            <StarIcon />
            <span className="ms-1 font-bold">{craftsman.rating.toFixed(1)}</span>
            <span className="ms-1 text-gray-500">({craftsman.reviews} تقييم)</span>
          </div>
        </div>
        <a 
          href={`tel:${craftsman.phone}`}
          className="mt-4 w-full flex items-center justify-center bg-brand-700 text-white font-bold py-3 rounded-lg hover:bg-brand-800 transition-colors duration-300 shadow-lg"
        >
          <PhoneIcon className="me-2"/>
          اتصال
        </a>
        <h4 className="font-bold mt-6 mb-2">عن الحرفي</h4>
        <p className="text-gray-700 leading-relaxed">{craftsman.bio}</p>
        <h4 className="font-bold mt-6 mb-2">معرض الأعمال</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {craftsman.portfolio.map((imgUrl, index) => (
              <div key={index} className="aspect-square">
                 <div 
                    className="w-full h-full bg-cover bg-center rounded-lg shadow-sm"
                    style={{ backgroundImage: `url(${imgUrl})` }}
                    role="img"
                    aria-label={`Portfolio work ${index + 1}`}
                />
              </div>
            ))}
        </div>
    </div>
  </div>
);

const HomeScreen: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [selectedCraftsman, setSelectedCraftsman] = useState<Craftsman | null>(null);
  const featuredCraftsmen = craftsmen.slice(0, 4);

  React.useEffect(() => {
    // Simulate data fetching to show skeleton loaders
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <div className="p-4 bg-gradient-to-b from-brand-800 to-brand-700 text-white shadow-lg">
        <h1 className="text-2xl font-bold">مرحباً بك في حرفي</h1>
        <p className="mt-1 text-brand-200">دليلك للعثور على أمهر الحرفيين في سوريا.</p>
      </div>
      
      <div className="p-2">
        <h2 className="text-xl font-bold text-gray-800 px-2 py-4">حرفيون مميزون</h2>
        <div className="flex flex-col">
          {loading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : (
            featuredCraftsmen.map(craftsman => (
              // FIX: Added onView, onEdit, and onDelete props to satisfy CraftsmanCardProps.
              <CraftsmanCard
                key={craftsman.id}
                craftsman={craftsman}
                onView={setSelectedCraftsman}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      </div>
      <Modal isOpen={!!selectedCraftsman} onClose={() => setSelectedCraftsman(null)} title={selectedCraftsman?.name || ''}>
        {selectedCraftsman && <CraftsmanDetails craftsman={selectedCraftsman} />}
      </Modal>
    </div>
  );
};

export default HomeScreen;