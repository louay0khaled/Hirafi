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

const AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2U1ZTdlYiI+PHBhdGggZD0iTTEyIDBDNS4zNzMgMCAwIDUuMzczIDAgMTJzNS4zNzMgMTIgMTIgMTIgMTItNS4zNzMgMTItMTJTMTguNjI3IDAgMTIgMHptMCA0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHptMCAxNGMtMi42NyAwLTggMS4zNC04IDR2MWgxNnYtMWMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz4=';

const CraftsmanCard: React.FC<CraftsmanCardProps> = ({ craftsman, onView, onEdit, onDelete }) => {
  const { user } = useContext(AdminContext);
  const imageUrl = craftsman.avatar_url || AVATAR_PLACEHOLDER;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden m-2 relative transition-transform duration-200 hover:scale-105">
      <div className="flex items-center p-4" onClick={() => onView(craftsman)} style={{ cursor: 'pointer' }}>
        <div
          className="w-20 h-20 rounded-full flex-shrink-0 bg-cover bg-center border-4 border-gray-200 bg-gray-200"
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={craftsman.name}
        ></div>
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
      
      {user && (
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