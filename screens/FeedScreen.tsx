import React, { useState, useContext, useMemo } from 'react';
import CraftsmanCard from '../components/CraftsmanCard';
import Modal from '../components/Modal';
import { useCraftsmen, CraftsmanFormData } from '../hooks/useCraftsmen';
import { Craftsman, Governorate } from '../types';
import { AdminContext } from '../context/AdminContext';
import { PlusIcon, StarIcon, CloseIcon, SearchIcon, ChevronDownIcon } from '../components/Icons';
import { GOVERNORATES } from '../constants';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import ImageModal from '../components/ImageModal';

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
                <p className="text-neutral-600 mb-4">اختر تقييمك بناءً على العوامل التالية:</p>
                <ul className="text-sm text-neutral-500 list-disc list-inside mb-4 text-start">
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
                                hoverRating >= star || rating >= star ? 'text-yellow-400 scale-110' : 'text-neutral-300'
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
                    className="w-full px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:bg-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                    إرسال التقييم
                </button>
            </div>
        </Modal>
    )
};

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
        portfolioFiles: [],
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

    const removePortfolioImage = (indexToRemove: number) => {
      const urlToRemove = portfolioPreviews[indexToRemove];
    
      // Remove from the visual preview list
      setPortfolioPreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    
      if (urlToRemove.startsWith('blob:')) {
        // This is a newly added file (represented by a blob URL).
        // We need to find its corresponding File object in `portfolioFiles` and remove it.
        // We can do this by tracking how many blob URLs exist up to the removal index.
        let blobIndex = -1;
        for (let i = 0; i <= indexToRemove; i++) {
          if (portfolioPreviews[i].startsWith('blob:')) {
            blobIndex++;
          }
        }
    
        if (blobIndex !== -1) {
          setFormData(prev => ({
            ...prev,
            portfolioFiles: (prev.portfolioFiles || []).filter((_, i) => i !== blobIndex),
          }));
        }
      } else {
        // This is an existing image from the database. Remove it from the `portfolio` URL list.
        setFormData(prev => ({
          ...prev,
          portfolio: prev.portfolio.filter(url => url !== urlToRemove),
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    const inputClass = "w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";
    const fileInputLabelClass = "cursor-pointer bg-white p-2 border border-neutral-300 rounded-lg text-center text-neutral-700 hover:bg-neutral-100 block";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="font-semibold text-neutral-700">الاسم:</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required /></div>
            <div><label className="font-semibold text-neutral-700">الحرفة:</label><input type="text" name="craft" value={formData.craft} onChange={handleChange} className={inputClass} required /></div>
            <div><label className="font-semibold text-neutral-700">المحافظة:</label><select name="governorate" value={formData.governorate} onChange={handleChange} className={inputClass}>{GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
            <div>
              <label className="font-semibold text-neutral-700">رقم الهاتف:</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
              <p className="text-xs text-neutral-500 mt-1">أدخل الرقم بدون رمز الدولة (مثال: 992705838)</p>
            </div>
            <div><label className="font-semibold text-neutral-700">نبذة:</label><textarea name="bio" value={formData.bio} onChange={handleChange} className={inputClass} required rows={4} /></div>
            
            <div>
                <label className="block mb-1 font-semibold text-neutral-700">الصورة الشخصية:</label>
                <label className={fileInputLabelClass}><span>{avatarPreview ? "تغيير الصورة" : "اختر ملف..."}</span><input type="file" onChange={(e) => handleFileChange(e, 'avatarFile')} className="hidden" accept="image/*" /></label>
                {avatarPreview && <img src={avatarPreview} alt="معاينة" className="mt-2 w-24 h-24 rounded-full object-cover mx-auto" />}
            </div>

            <div>
                <label className="block mb-1 font-semibold text-neutral-700">صورة الغلاف:</label>
                 <label className={fileInputLabelClass}><span>{headerPreview ? "تغيير الصورة" : "اختر ملف..."}</span><input type="file" onChange={(e) => handleFileChange(e, 'headerFile')} className="hidden" accept="image/*" /></label>
                {headerPreview && <img src={headerPreview} alt="معاينة" className="mt-2 w-full h-32 object-cover rounded-lg" />}
            </div>

            <div>
                <label className="block mb-1 font-semibold text-neutral-700">معرض الأعمال:</label>
                <label className={fileInputLabelClass}><span>إضافة صور...</span><input type="file" onChange={handlePortfolioChange} className="hidden" accept="image/*" multiple /></label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {portfolioPreviews.map((img, index) => (
                        <div key={img} className="relative group">
                            <img src={img} alt={`معرض ${index + 1}`} className="w-full h-24 object-cover rounded-lg"/>
                            <button type="button" onClick={() => removePortfolioImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><CloseIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onCancel} disabled={isSaving} className="px-4 py-2 bg-neutral-200 text-neutral-800 font-semibold rounded-lg hover:bg-neutral-300 disabled:opacity-50">إلغاء</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 disabled:bg-brand-800 disabled:cursor-wait">
                    {isSaving ? 'جارٍ الحفظ...' : 'حفظ'}
                </button>
            </div>
        </form>
    );
};


const FeedScreen: React.FC = () => {
  const { craftsmen, loading, addCraftsman, updateCraftsman, deleteCraftsman, rateCraftsman } = useCraftsmen();
  const { user } = useContext(AdminContext);
  const { showToast } = useToast();

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
      return Array.from({ length: 3 }).map((_, i) => <SkeletonLoader key={i} />);
    }

    if (craftsmen.length === 0) {
      return (
        <div className="text-center py-20 px-4 text-neutral-500">
          <h2 className="text-2xl font-bold text-neutral-700 mb-2 font-heading">مرحباً بك في حِرَفي</h2>
          <p>لم تتم إضافة أي حرفيين بعد.</p>
          {user ? (
            <p className="mt-4 bg-accent-100 text-accent-800 p-3 rounded-xl">
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
            <div className="text-center py-20 px-4 text-neutral-500">
                <h2 className="text-xl font-bold text-neutral-700 mb-2 font-heading">لا توجد نتائج</h2>
                <p>لم يتم العثور على حرفيين يطابقون معايير البحث الحالية.</p>
            </div>
        );
    }

    return filteredCraftsmen.map((craftsman, index) => (
      <CraftsmanCard 
        key={craftsman.id} 
        craftsman={craftsman}
        onEdit={setEditingCraftsman}
        onDelete={setDeletingCraftsman}
        onRate={setRatingCraftsman}
        onViewImage={setImageModalUrl}
        style={{ animationDelay: `${index * 70}ms` }}
      />
    ));
  };

  return (
    <div className="pb-20">
      <div className="p-3 bg-neutral-50/80 backdrop-blur-sm border-b border-neutral-200 sticky top-16 z-30 sm:rounded-b-xl">
        <div className="relative">
          <input type="text" placeholder="ابحث بالاسم أو الحرفة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full ps-10 pe-4 py-2.5 border border-neutral-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"/>
          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-neutral-400" /></div>
        </div>
        <div className="flex gap-2 mt-2">
            <div className="relative w-full">
                <select value={selectedGovernorate} onChange={e => setSelectedGovernorate(e.target.value as any)} className="w-full p-2.5 ps-4 pe-8 border border-neutral-300 rounded-xl bg-white shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                    <option value="الكل">كل المحافظات</option>
                    {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="absolute inset-y-0 left-0 ps-2 flex items-center pointer-events-none"><ChevronDownIcon className="w-5 h-5 text-neutral-400" /></div>
            </div>
            <div className="relative w-full">
                <select value={selectedCraft} onChange={e => setSelectedCraft(e.target.value)} className="w-full p-2.5 ps-4 pe-8 border border-neutral-300 rounded-xl bg-white shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                    <option value="الكل">كل الحرف</option>
                    {availableCrafts.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute inset-y-0 left-0 ps-2 flex items-center pointer-events-none"><ChevronDownIcon className="w-5 h-5 text-neutral-400" /></div>
            </div>
        </div>
      </div>

      <div>
        {renderContent()}
      </div>
      
      {user && (
        <button 
            onClick={() => setIsAdding(true)}
            className="fixed bottom-6 right-1/2 translate-x-1/2 sm:right-6 sm:translate-x-0 bg-brand-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-700 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            aria-label="إضافة حرفي جديد"
        >
            <PlusIcon className="w-8 h-8"/>
        </button>
      )}

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
            <button onClick={() => setDeletingCraftsman(null)} className="px-4 py-2 bg-neutral-200 text-neutral-800 font-semibold rounded-lg hover:bg-neutral-300">إلغاء</button>
            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">حذف</button>
        </div>
      </Modal>

      {ratingCraftsman && <RatingModal craftsman={ratingCraftsman} onRate={handleRateSubmit} onClose={() => setRatingCraftsman(null)} />}
      
      <ImageModal isOpen={!!imageModalUrl} imageUrl={imageModalUrl} onClose={() => setImageModalUrl(null)} />
    </div>
  );
};

export default FeedScreen;