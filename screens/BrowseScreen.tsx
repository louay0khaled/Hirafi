import React, { useState, useMemo, useEffect } from 'react';
import CraftsmanCard from '../components/CraftsmanCard';
import { craftsmen } from '../data/craftsmen';
import { GOVERNORATES } from '../constants';
import { Craftsman, Governorate } from '../types';
import Header from '../components/Header';
import { SearchIcon, LocationIcon, PhoneIcon, StarIcon } from '../components/Icons';
import SkeletonLoader from '../components/SkeletonLoader';
import Modal from '../components/Modal';

// This component was copied from FeedScreen.tsx to be used in the details modal.
const CraftsmanDetails: React.FC<{ craftsman: Craftsman }> = ({ craftsman }) => (
  <div>
    <img src={craftsman.header_image_url} alt={`${craftsman.name} header`} className="w-full h-40 object-cover rounded-t-lg" />
    <div className="p-4">
        <div className="flex items-center mb-4">
            <img src={craftsman.avatar_url} alt={craftsman.name} className="w-20 h-20 rounded-full object-cover border-4 border-white -mt-12 shadow-lg" />
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
                <img src={imgUrl} alt={`Portfolio work ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
              </div>
            ))}
        </div>
    </div>
  </div>
);

const BrowseScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<Governorate | 'الكل'>('الكل');
  const [selectedCraftsman, setSelectedCraftsman] = useState<Craftsman | null>(null);

  useEffect(() => {
    // Simulate data fetching to show skeleton loaders
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);


  const filteredCraftsmen = useMemo(() => {
    if (loading) return [];
    return craftsmen.filter(craftsman => {
      const matchesSearch =
        craftsman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        craftsman.craft.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGovernorate =
        selectedGovernorate === 'الكل' || craftsman.governorate === selectedGovernorate;

      return matchesSearch && matchesGovernorate;
    });
  }, [searchTerm, selectedGovernorate, loading]);

  return (
    <div className="max-w-lg mx-auto">
      <Header title="تصفح الحرفيين" />
      <div className="p-2 pt-4">
        <div className="relative mb-4 px-2">
          <input
            type="text"
            placeholder="ابحث عن حرفي أو حرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-10 pe-4 py-3 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
          />
          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="mb-4 px-2">
          <select
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value as Governorate | 'الكل')}
            className="w-full p-3 rounded-full bg-white shadow-md appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="الكل">كل المحافظات</option>
            {GOVERNORATES.map(gov => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <div className="flex flex-col">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : filteredCraftsmen.length > 0 ? (
          <div className="flex flex-col">
            {filteredCraftsmen.map(craftsman => (
              // FIX: Added onView, onEdit, and onDelete props to satisfy CraftsmanCardProps.
              <CraftsmanCard
                key={craftsman.id}
                craftsman={craftsman}
                onView={setSelectedCraftsman}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>لا توجد نتائج تطابق بحثك.</p>
          </div>
        )}
      </div>
      <Modal isOpen={!!selectedCraftsman} onClose={() => setSelectedCraftsman(null)} title={selectedCraftsman?.name || ''}>
        {selectedCraftsman && <CraftsmanDetails craftsman={selectedCraftsman} />}
      </Modal>
    </div>
  );
};

export default BrowseScreen;