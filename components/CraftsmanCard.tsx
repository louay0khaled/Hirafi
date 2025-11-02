import React, { useContext, useState, useRef, useLayoutEffect } from 'react';
import { Craftsman } from '../types';
import { StarIcon, PhoneIcon, WhatsappIcon, EditIcon, DeleteIcon, KebabMenuIcon, BookmarkIcon } from './Icons';
import { AdminContext } from '../context/AdminContext';

interface CraftsmanCardProps {
  craftsman: Craftsman;
  onEdit: (craftsman: Craftsman) => void;
  onDelete: (craftsman: Craftsman) => void;
  onRate: (craftsman: Craftsman) => void;
  onViewImage: (url: string) => void;
  style?: React.CSSProperties;
}

const AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NkZDZlMSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTQgMTQgMTQgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+';

const AdminMenu: React.FC<{ onEdit: (e: React.MouseEvent) => void; onDelete: (e: React.MouseEvent) => void; }> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full" aria-label="Admin Actions">
        <KebabMenuIcon className="w-5 h-5" />
      </button>
      {isOpen && (
        <div 
            className="absolute left-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-10"
            onMouseLeave={() => setIsOpen(false)}
        >
          <button onClick={onEdit} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-t-lg">
            <EditIcon className="w-4 h-4 text-brand-600" />
            <span>تعديل</span>
          </button>
          <button onClick={onDelete} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-neutral-100 rounded-b-lg">
            <DeleteIcon className="w-4 h-4" />
            <span>حذف</span>
          </button>
        </div>
      )}
    </div>
  );
};

const ExpandableText: React.FC<{ text: string, minLines: number }> = ({ text, minLines }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    
    useLayoutEffect(() => {
        if (textRef.current) {
            // Check if the scroll height is greater than the client height
            // This indicates that the text is overflowing its container.
            setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
        }
    }, [text]);

    const lineClampClass = isExpanded ? '' : `line-clamp-${minLines}`;

    return (
        <div>
            <p ref={textRef} className={`text-neutral-700 whitespace-pre-line ${lineClampClass}`}>
                {text}
            </p>
            {isOverflowing && !isExpanded && (
                 <button onClick={() => setIsExpanded(true)} className="text-neutral-500 font-semibold text-sm mt-1">
                    ...المزيد
                </button>
            )}
        </div>
    );
};


const CraftsmanCard: React.FC<CraftsmanCardProps> = ({ craftsman, onEdit, onDelete, onRate, onViewImage, style }) => {
  const { user } = useContext(AdminContext);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(craftsman);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(craftsman);
  };
  
  const handleRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRate(craftsman);
  }

  return (
    <article 
      className="bg-white sm:rounded-xl shadow-sm overflow-hidden my-4 feed-card"
      style={style}
    >
        {/* Post Header */}
        <header className="flex items-center p-3">
             <img
                className="w-10 h-10 rounded-full object-cover"
                src={craftsman.avatar_url || AVATAR_PLACEHOLDER}
                alt={craftsman.name}
            />
            <div className="mr-3">
                 <h3 className="font-bold text-sm text-neutral-800">{craftsman.name}</h3>
                 <p className="text-xs text-neutral-500">{craftsman.craft} &middot; {craftsman.governorate}</p>
            </div>
            <div className="flex-grow"></div>
            {user && <AdminMenu onEdit={handleEdit} onDelete={handleDelete} />}
        </header>

        {/* Post Image */}
        {craftsman.header_image_url && (
            <div className="aspect-w-4 aspect-h-3 bg-neutral-200">
                <img
                    className="w-full h-full object-cover"
                    src={craftsman.header_image_url}
                    alt={`${craftsman.name}'s work`}
                    loading="lazy"
                 />
            </div>
        )}

        {/* Action Bar */}
        <section className="flex items-center p-2">
            <button onClick={handleRate} className="p-2 text-neutral-600 hover:text-red-500 hover:bg-neutral-100 rounded-full" aria-label="Rate craftsman"><StarIcon className="w-6 h-6"/></button>
            <a href={`tel:+963${craftsman.phone}`} className="p-2 text-neutral-600 hover:text-brand-600 hover:bg-neutral-100 rounded-full" aria-label="Call craftsman"><PhoneIcon className="w-6 h-6"/></a>
            <a href={`https://wa.me/963${craftsman.phone}`} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-600 hover:text-green-600 hover:bg-neutral-100 rounded-full" aria-label="Message on WhatsApp"><WhatsappIcon className="w-6 h-6"/></a>
            <div className="flex-grow"></div>
             <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full" aria-label="Save post"><BookmarkIcon className="w-6 h-6"/></button>
        </section>

        {/* Caption and Details */}
        <section className="px-4 pb-4 text-sm">
            <div className="font-semibold mb-2">
                {craftsman.rating.toFixed(1)} نجوم 
                <span className="font-normal text-neutral-500"> ({craftsman.reviews} تقييم)</span>
            </div>
            
            <ExpandableText text={craftsman.bio} minLines={2} />
            
             {craftsman.portfolio && craftsman.portfolio.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-bold mb-2 text-neutral-600 text-xs uppercase">معرض الأعمال</h4>
                    <div className="grid grid-cols-3 gap-1">
                        {craftsman.portfolio.map((imgUrl, index) => (
                          <div key={index} className="aspect-square cursor-pointer" onClick={() => onViewImage(imgUrl)}>
                            <img 
                              className="w-full h-full object-cover rounded-md"
                              src={imgUrl}
                              alt={`Portfolio work ${index + 1}`}
                              loading="lazy"
                            />
                          </div>
                        ))}
                    </div>
                </div>
            )}
        </section>

    </article>
  );
};

export default CraftsmanCard;