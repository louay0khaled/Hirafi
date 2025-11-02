import React, { useState, useContext, useMemo } from 'react';
import CraftsmanCard from '../components/CraftsmanCard';
import Modal from '../components/Modal';
import { useCraftsmen, CraftsmanFormData } from '../hooks/useCraftsmen';
import { Craftsman, Governorate } from '../types';
import { AdminContext } from '../context/AdminContext';
import { PlusIcon, LocationIcon, StarIcon, PhoneIcon, WhatsappIcon, CloseIcon, SearchIcon } from '../components/Icons';
import { GOVERNORATES } from '../constants';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import ImageModal from '../components/ImageModal';

const AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2U1ZTdlYiI+PHBhdGggZD0iTTEyIDBDNS4zNzMgMCAwIDUuMzczIDAgMTJzNS4zNzMgMTIgMTIgMTIgMTItNS4zNzMgMTItMTJTMTguNjI3IDAgMTIgMHptMCA0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHptMCAxNGMtMi42NyAwLTggMS4zNC04IDR2MWgxNnYtMWMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz4=';
const HEADER_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDE2MDAgOTAwIj48cmVjdCBmaWxsPSIjZTBlMGUwIiB3aWR0aD0iMTYwMCIgaGVpZHRoPSI5MDAiLz48L3N2Zz4=';

const RatingModal: React.FC<{ craftsman: Craftsman; onRate: (rating: number) => void; onClose: () => void; }> = ({ craftsman, onRate, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        if (rating > 0) {
            onRate(rating);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`تقييم ${craftsman.name}`}>
            <div className="text-center">
                <p className="text-gray-600 mb-4">اختر تقييمك بناءً على العوامل التالية:</p>
                <ul className="text-sm text-gray-500 list-disc list-inside mb-4 text-start">
                    <li>جودة العمل</li>
                    <li>الالتزام بالوقت</li>
                    <li>سهولة التواصل</li>
                    <li>السعر مقابل الخدمة</li>
                </ul>
                <div className="flex justify-center items-center mb-6" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            className={`w-10 h-10 cursor-pointer transition-colors ${
                                hoverRating >= star || rating >= star ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>
                 <button 
                    onClick={handleSubmit} 
                    disabled={rating === 0}
                    className="w-full px-4 py-2 bg-brand-700 text-white rounded-md hover:bg-brand-800 disabled:bg-gray-400"
                >
                    إرسال التقييم
                </button>
            </div>
        </Modal>
    )
};

const CraftsmanDetails: React.FC<{ craftsman: Craftsman; onStartRating: () => void; onAvatarClick: (url: string) => void; }> = ({ craftsman, onStartRating, onAvatarClick }) => (
  <div>
    <div 
      className="w-full h-40 bg-cover bg-center rounded-t-lg bg-gray-200"
      style={{ backgroundImage: `url(${craftsman.header_image_url || HEADER_PLACEHOLDER})` }}
      role="img"
      aria-label={`${craftsman.name} header`}
    />
    <div className="p-4">
        <div className="flex items-start mb-4">
            <div 
              className="w-28 h-28 rounded-full bg-cover bg-center border-4 border-white -mt-14 shadow-lg bg-gray-200 cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundImage: `url(${craftsman.avatar_url || AVATAR_PLACEHOLDER})` }}
              role="button"
              tabIndex={0}
              aria-label={`View profile picture of ${craftsman.name}`}
              onClick={() => craftsman.avatar_url && onAvatarClick(craftsman.avatar_url)}
              onKeyDown={(e) => (e.key === 'Enter' && craftsman.avatar_url) && onAvatarClick(craftsman.avatar_url)}
            />
            <div className="ms-4 pt-2">
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
        
        <h4 className="font-bold mt-6 mb-3 text-gray-800">للتواصل</h4>
        <div className="flex items-center space-s-3">
            <a
              href={`tel:+963${craftsman.phone}`}
              className="flex-1 flex items-center justify-center text-sm bg-gray-100 text-brand-700 font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-300"
            >
              <PhoneIcon className="me-2 w-4 h-4"/>
              اتصال
            </a>
            <a
              href={`https://wa.me/963${craftsman.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center text-sm bg-green-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              <WhatsappIcon className="me-2 w-4 h-4"/>
              واتساب
            </a>
        </div>
        
        <button onClick={onStartRating} className="mt-4 w-full text-sm flex items-center justify-center bg-accent-100 text-accent-800 font-bold py-2 rounded-lg hover:bg-accent-200 transition-colors duration-300">
            <StarIcon className="me-2 w-4 h-4"/>
            تقييم الحرفي
        </button>

        <h4 className="font-bold mt-6 mb-2">عن الحرفي</h4>
        <p className="text-gray-700 leading-relaxed">{craftsman.bio}</p>
        
        {craftsman.portfolio && craftsman.portfolio.length > 0 && (
          <>
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
          </>
        )}
    </div>
  </div>
);

const CraftsmanForm: React.FC<{ craftsman?: Craftsman; onSave: (data: CraftsmanFormData) => Promise<void>; onCancel: () => void }> = ({ craftsman, onSave, onCancel }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<CraftsmanFormData>({
        name: craftsman?.name || '',
        craft: craftsman?.craft || '',
        governorate: craftsman?.governorate || 'دمشق',
        bio: craftsman?.bio || '',
        phone: craftsman?.phone || '',
        avatar_url: craftsman?.avatar_url || '',
        header_image_url: craftsman?.header_image_url || '',
        portfolio: craftsman?.portfolio || [],
    });
    
    // Previews for existing URLs or newly selected files
    const [avatarPreview, setAvatarPreview] = useState<string | null>(craftsman?.avatar_url || null);
    const [headerPreview, setHeaderPreview] = useState<string | null>(craftsman?.header_image_url || null);
    const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>(craftsman?.portfolio || []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarFile' | 'headerFile') => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
            const previewUrl = URL.createObjectURL(file);
            if (field === 'avatarFile') setAvatarPreview(previewUrl);
            else setHeaderPreview(previewUrl);
        }
    };

    const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles: File[] = [];
            const newPreviews: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                newFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }

            if (newFiles.length > 0) {
                setFormData(prev => ({ ...prev, portfolioFiles: [...(prev.portfolioFiles || []), ...newFiles]}));
                setPortfolioPreviews(prev => [...prev, ...newPreviews]);
            }
        }
    };

    const removePortfolioImage = (index: number) => {
      const imageUrlToRemove = portfolioPreviews[index];
      setPortfolioPreviews(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({ ...prev, portfolio: prev.portfolio.filter(url => url !== imageUrlToRemove)}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    const inputClass = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition";
    const fileInputLabelClass = "cursor-pointer bg-white p-2 border border-gray-300 rounded-md text-center text-gray-700 hover:bg-gray-50 transition block";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="font-semibold">الاسم:</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required /></div>
            <div><label className="font-semibold">الحرفة:</label><input type="text" name="craft" value={formData.craft} onChange={handleChange} className={inputClass} required /></div>
            <div><label className="font-semibold">المحافظة:</label><select name="governorate" value={formData.governorate} onChange={handleChange} className={inputClass}>{GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
            <div>
              <label className="font-semibold">رقم الهاتف:</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
              <p className="text-xs text-gray-500 mt-1">أدخل الرقم بدون رمز الدولة (مثال: 992705838)</p>
            </div>
            <div><label className="font-semibold">نبذة:</label><textarea name="bio" value={formData.bio} onChange={handleChange} className={inputClass} required /></div>
            
            <div>
                <label className="block mb-1 font-semibold">الصورة الشخصية:</label>
                <label className={fileInputLabelClass}><span>{avatarPreview ? "تغيير الصورة" : "اختر ملف..."}</span><input type="file" onChange={(e) => handleFileChange(e, 'avatarFile')} className="hidden" accept="image/*" /></label>
                {avatarPreview && <img src={avatarPreview} alt="معاينة" className="mt-2 w-24 h-24 rounded-full object-cover mx-auto" />}
            </div>

            <div>
                <label className="block mb-1 font-semibold">صورة الغلاف:</label>
                 <label className={fileInputLabelClass}><span>{headerPreview ? "تغيير الصورة" : "اختر ملف..."}</span><input type="file" onChange={(e) => handleFileChange(e, 'headerFile')} className="hidden" accept="image/*" /></label>
                {headerPreview && <img src={headerPreview} alt="معاينة" className="mt-2 w-full h-32 object-cover rounded-md" />}
            </div>

            <div>
                <label className="block mb-1 font-semibold">معرض الأعمال:</label>
                <label className={fileInputLabelClass}><span>إضافة صور...</span><input type="file" onChange={handlePortfolioChange} className="hidden" accept="image/*" multiple /></label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {portfolioPreviews.map((img, index) => (
                        <div key={index} className="relative">
                            <img src={img} alt={`معرض ${index + 1}`} className="w-full h-24 object-cover rounded-md"/>
                            <button type="button" onClick={() => removePortfolioImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"><CloseIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onCancel} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">إلغاء</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-brand-700 text-white rounded-md hover:bg-brand-800 disabled:bg-brand-900 disabled:cursor-wait">
                    {isSaving ? 'جارٍ الحفظ...' : 'حفظ'}
                </button>
            </div>
        </form>
    );
};


const FeedScreen: React.FC = () => {
  const { craftsmen, loading, addCraftsman, updateCraftsman, deleteCraftsman, rateCraftsman } = useCraftsmen();
  const { isAdmin } = useContext(AdminContext);
  const { showToast } = useToast();

  const [selectedCraftsman, setSelectedCraftsman] = useState<Craftsman | null>(null);
  const [editingCraftsman, setEditingCraftsman] = useState<Craftsman | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingCraftsman, setDeletingCraftsman] = useState<Craftsman | null>(null);
  const [ratingCraftsman, setRatingCraftsman] = useState<Craftsman | null>(null);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<Governorate | 'الكل'>('الكل');
  const [selectedCraft, setSelectedCraft] = useState<string>('الكل');

  const availableCrafts = useMemo(() => [...new Set(craftsmen.map(c => c.craft))], [craftsmen]);

  const filteredCraftsmen = useMemo(() => {
    return craftsmen.filter(craftsman => {
      const matchesSearch =
        craftsman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        craftsman.craft.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGovernorate =
        selectedGovernorate === 'الكل' || craftsman.governorate === selectedGovernorate;
      const matchesCraft =
        selectedCraft === 'الكل' || craftsman.craft === selectedCraft;

      return matchesSearch && matchesGovernorate && matchesCraft;
    });
  }, [craftsmen, searchTerm, selectedGovernorate, selectedCraft]);

  const handleSave = async (data: CraftsmanFormData) => {
    try {
      if (editingCraftsman) {
          await updateCraftsman(editingCraftsman.id, data);
          showToast('تم تحديث البيانات بنجاح');
      } else if (isAdding) {
          await addCraftsman(data);
          showToast('تم إضافة الحرفي بنجاح');
      }
      setEditingCraftsman(null);
      setIsAdding(false);
    } catch (e) {
      showToast('حدث خطأ أثناء الحفظ');
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingCraftsman) {
        await deleteCraftsman(deletingCraftsman.id);
        showToast('تم حذف الحرفي بنجاح');
        setDeletingCraftsman(null);
    }
  };

  const handleRateSubmit = async (rating: number) => {
    if(ratingCraftsman) {
        await rateCraftsman(ratingCraftsman.id, rating);
        showToast('شكراً لك، تم تسجيل تقييمك');
        setRatingCraftsman(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => <SkeletonLoader key={i} />);
    }

    if (craftsmen.length === 0) {
      return (
        <div className="text-center py-20 px-4 text-gray-500">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">مرحباً بك في حِرَفي</h2>
          <p>لم تتم إضافة أي حرفيين بعد.</p>
          {isAdmin ? (
            <p className="mt-4 bg-accent-100 text-accent-800 p-3 rounded-lg">
              اضغط على زر <span className="font-bold mx-1">(+)</span> في الأسفل لإضافة أول حرفي إلى الدليل.
            </p>
          ) : (
            <p className="mt-4">سيتم عرض الحرفيين المهرة قريباً، ترقبونا!</p>
          )}
        </div>
      );
    }
    
    if (filteredCraftsmen.length === 0) {
        return (
            <div className="text-center py-20 px-4 text-gray-500">
                <h2 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h2>
                <p>لم يتم العثور على حرفيين يطابقون معايير البحث الحالية.</p>
            </div>
        );
    }

    return filteredCraftsmen.map(craftsman => (
      <CraftsmanCard 
        key={craftsman.id} 
        craftsman={craftsman}
        onView={setSelectedCraftsman}
        onEdit={setEditingCraftsman}
        onDelete={setDeletingCraftsman}
      />
    ));
  };

  return (
    <div className="pb-20">
      <div className="p-2 space-y-2 bg-gray-100 border-b sticky top-16 z-30">
        <div className="relative">
          <input type="text" placeholder="ابحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full ps-10 pe-4 py-2 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"/>
          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div>
        </div>
        <div className="flex gap-2">
            <select value={selectedGovernorate} onChange={e => setSelectedGovernorate(e.target.value as any)} className="w-full p-2 rounded-full bg-white shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="الكل">كل المحافظات</option>
                {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={selectedCraft} onChange={e => setSelectedCraft(e.target.value)} className="w-full p-2 rounded-full bg-white shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="الكل">كل الحرف</option>
                {availableCrafts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      </div>

      <div className="p-2">
        {renderContent()}
      </div>
      
      {isAdmin && (
        <button 
            onClick={() => setIsAdding(true)}
            className="fixed bottom-6 right-1/2 translate-x-1/2 sm:right-6 sm:translate-x-0 bg-brand-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-800 transition transform hover:scale-110"
            aria-label="إضافة حرفي جديد"
        >
            <PlusIcon className="w-8 h-8"/>
        </button>
      )}

      <Modal isOpen={!!selectedCraftsman} onClose={() => setSelectedCraftsman(null)} title={selectedCraftsman?.name || ''}>
        {selectedCraftsman && <CraftsmanDetails craftsman={selectedCraftsman} onStartRating={() => setRatingCraftsman(selectedCraftsman)} onAvatarClick={setImageModalUrl} />}
      </Modal>

      <Modal 
        isOpen={isAdding || !!editingCraftsman} 
        onClose={() => { setIsAdding(false); setEditingCraftsman(null); }} 
        title={isAdding ? 'إضافة حرفي جديد' : 'تعديل بيانات الحرفي'}
      >
        <CraftsmanForm 
          craftsman={editingCraftsman || undefined}
          onSave={handleSave}
          onCancel={() => { setIsAdding(false); setEditingCraftsman(null); }}
        />
      </Modal>
      
      <Modal isOpen={!!deletingCraftsman} onClose={() => setDeletingCraftsman(null)} title="تأكيد الحذف">
        <p>هل أنت متأكد من أنك تريد حذف ملف <strong>{deletingCraftsman?.name}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setDeletingCraftsman(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">إلغاء</button>
            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">حذف</button>
        </div>
      </Modal>

      {ratingCraftsman && <RatingModal craftsman={ratingCraftsman} onRate={handleRateSubmit} onClose={() => setRatingCraftsman(null)} />}
      
      <ImageModal isOpen={!!imageModalUrl} imageUrl={imageModalUrl} onClose={() => setImageModalUrl(null)} />
    </div>
  );
};

export default FeedScreen;