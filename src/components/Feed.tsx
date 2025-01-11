import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Feed() {
  const { threads, users, currentUser, addThread } = useStore();
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim() || !currentUser) return;
    
    addThread({
      id: String(Date.now()),
      userId: currentUser.id,
      content: newPost,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    });
    
    setNewPost('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="w-full bg-gray-700 text-white rounded-lg p-4 mb-4 resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none"
          rows={3}
        />
        <button
          onClick={handlePost}
          className="flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Post</span>
        </button>
      </div>

      {threads.map((thread) => {
        const author = users.find((u) => u.id === thread.userId);
        
        return (
          <div key={thread.id} className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={author?.avatar}
                alt={author?.name}
                className="w-12 h-12 rounded-full border-2 border-pink-500"
              />
              <div>
                <h3 className="font-medium text-white">{author?.name}</h3>
                <p className="text-sm text-gray-400">{author?.title} at {author?.company}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <p className="text-white mb-4">{thread.content}</p>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <button className="flex items-center space-x-2 hover:text-pink-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span>{thread.likes}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-pink-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{thread.comments.length}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-pink-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}