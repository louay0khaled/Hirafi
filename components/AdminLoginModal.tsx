import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface AdminLoginModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await onSubmit(password);
    if (!result.success) {
      setError(result.error || 'كلمة المرور غير صحيحة.');
      setPassword('');
    }
    // No need to call onClose here, the parent component does it on success.
    setIsLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">تسجيل دخول المدير</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-4">
           <p className="text-sm text-gray-600 mb-3">
            لأسباب أمنية، تم ربط حساب المدير بنظام المصادقة. استخدم كلمة المرور التي قمت بتعيينها في Supabase.
          </p>
          <label className="block mb-2">
            كلمة المرور:
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
          </label>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-brand-700 text-white py-2 rounded-md hover:bg-brand-800 disabled:bg-brand-900">
            {isLoading ? 'جارٍ الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;