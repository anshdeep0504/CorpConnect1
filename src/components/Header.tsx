import React from 'react';
import { Bell, MessageSquare, BookOpen, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const { currentUser, logout } = useStore();

  return (
    <header className="bg-gray-800 fixed top-0 left-0 right-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-pink-500">CorpConnect</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-300 hover:text-pink-500 transition-colors">
            <Bell className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-300 hover:text-pink-500 transition-colors">
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-300 hover:text-pink-500 transition-colors">
            <BookOpen className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full border-2 border-pink-500"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{currentUser?.name}</p>
              <p className="text-xs text-pink-500">{currentUser?.points} points</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-gray-700 rounded-full text-gray-300 hover:text-pink-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}