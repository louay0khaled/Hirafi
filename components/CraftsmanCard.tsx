import React, { useContext } from 'react';
import { Craftsman } from '../types';
import { StarIcon, LocationIcon, EditIcon, DeleteIcon } from './Icons';
import { AdminContext } from '../context/AdminContext';

interface CraftsmanCardProps {
  craftsman: Craftsman;
  onView: (craftsman: Craftsman) => void;
  onEdit: (craftsman: Craftsman) => void;
  onDelete: (craftsman: Craftsman) => void;
}

const CraftsmanCard: React.FC<CraftsmanCardProps> = ({ craftsman, onView, onEdit, onDelete }) => {
  const { isAdmin } = useContext(AdminContext);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden m-2 relative transition-transform duration-200 hover:scale-105">
      <div className="flex items-center p-4" onClick={() => onView(craftsman)} style={{ cursor: 'pointer' }}>
        <img
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
          src={craftsman.avatar_url}
          alt={craftsman.name}
        />
        <div className="ms-4 flex-1">
          <h3 className="text-lg font-bold text-gray-800">{craftsman.name}</h3>
          <p className="text-sm text-brand-700 font-semibold">{craftsman.craft}</p>
          <div className="flex items-center text-gray-500 mt-2 text-xs">
            <LocationIcon />
            <span className="ms-1">{craftsman.governorate}</span>
          </div>
        </div>
        <div className="flex items-center text-accent-700 bg-accent-100 rounded-full px-2 py-1">
          <span className="font-bold text-sm">{craftsman.rating.toFixed(1)}</span>
          <StarIcon className="w-4 h-4 ms-1"/>
        </div>
      </div>
      
      {isAdmin && (
        <div className="absolute top-2 left-2 flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onEdit(craftsman); }} className="p-2 bg-brand-100 text-brand-600 rounded-full hover:bg-brand-200 transition">
            <EditIcon className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(craftsman); }} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
            <DeleteIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CraftsmanCard;