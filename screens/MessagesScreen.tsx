
import React from 'react';
import Header from '../components/Header';
import { MessageIcon } from '../components/Icons';

const MessagesScreen: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto">
      <Header title="الرسائل" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-gray-500">
        <MessageIcon className="w-24 h-24 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold">قريباً</h2>
        <p className="mt-2 text-center">ميزة الرسائل قيد التطوير حالياً.</p>
      </div>
    </div>
  );
};

export default MessagesScreen;
