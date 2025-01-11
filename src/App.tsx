import React, { useState } from 'react';
import { useStore } from './store/useStore';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { SkillMatching } from './components/SkillMatching';
import { Learning } from './components/Learning';
import { Chat } from './components/Chat';

function App() {
  const currentUser = useStore((state) => state.currentUser);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {selectedChat ? (
          <Chat recipientId={selectedChat} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Feed />
            </div>
            
            <div className="space-y-6">
              <SkillMatching onChatSelect={setSelectedChat} />
              <Learning />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;