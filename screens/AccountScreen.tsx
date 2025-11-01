
import React from 'react';
import Header from '../components/Header';
import { UserIcon } from '../components/Icons';

const AccountScreen: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto">
      <Header title="حسابي" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-gray-500">
        <UserIcon className="w-24 h-24 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold">قريباً</h2>
        <p className="mt-2 text-center">ميزات الحساب الشخصي ستكون متاحة قريباً.</p>
      </div>
    </div>
  );
};

export default AccountScreen;
