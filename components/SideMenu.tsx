import React, { useContext, useState } from 'react';
import { CloseIcon, WhatsappIcon, LogoutIcon, DeleteIcon } from './Icons';
import { AdminContext } from '../context/AdminContext';
import Modal from './Modal';
import { useToast } from '../context/ToastContext';
import { deleteAllStorageFiles } from '../lib/storage';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { isAdmin, logout } = useContext(AdminContext);
  const { showToast } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const whatsappMessage = "مرحباً فريق حرفي، أنا حرفي وأرغب بالانضمام إلى تطبيقكم. هل يمكنني الحصول على مزيد من المعلومات؟";
  const whatsappLink = `https://wa.me/963992705838?text=${encodeURIComponent(whatsappMessage)}`;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleDeleteAllImages = async () => {
    setIsDeleting(true);
    const { success, error } = await deleteAllStorageFiles();
    setIsDeleting(false);
    setShowConfirmModal(false);
    onClose(); // Close side menu
    if (success) {
        showToast('تم حذف جميع الصور بنجاح.');
    } else {
        showToast('حدث خطأ أثناء حذف الصور.');
        console.error(error);
    }
  };


  return (
    <>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-brand-700">القائمة</h2>
          <button onClick={onClose} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            هل أنت حرفي وترغب بالانضمام؟ تواصل معنا لنشر صفحتك.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-lg"
          >
            <WhatsappIcon className="me-2" />
            تواصل عبر واتساب
          </a>
        </div>
        {isAdmin && (
            <>
                <div className="p-4 border-t">
                     <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg"
                    >
                        <LogoutIcon className="me-2" />
                        تسجيل الخروج
                    </button>
                </div>
                <div className="p-4 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">أدوات المدير</h3>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex items-center justify-center w-full bg-gray-100 text-red-600 font-bold py-3 px-4 rounded-lg hover:bg-red-100 transition-colors duration-300"
                  >
                    <DeleteIcon className="me-2" />
                    مسح كل صور التخزين
                  </button>
                </div>
            </>
        )}
      </div>
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="تأكيد الحذف الشامل">
        <div>
            <p>هل أنت متأكد من أنك تريد حذف <strong>جميع</strong> الصور من التخزين؟ يشمل هذا صور الحرفيين الشخصية، صور الغلاف، وكل صور معرض الأعمال.</p>
            <p className="font-bold text-red-600 mt-2">لا يمكن التراجع عن هذا الإجراء الخطير.</p>
            <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setShowConfirmModal(false)} disabled={isDeleting} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">إلغاء</button>
                <button onClick={handleDeleteAllImages} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-900 disabled:cursor-wait">
                    {isDeleting ? 'جارٍ الحذف...' : 'نعم، احذف الكل'}
                </button>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default SideMenu;
