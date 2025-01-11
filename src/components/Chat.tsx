import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { MessageSquare, Send, Brain } from 'lucide-react';
import axios from 'axios';

export function Chat({ recipientId }: { recipientId: string }) {
  const [message, setMessage] = useState('');
  const [isUsingAI, setIsUsingAI] = useState(false);
  const { currentUser, users, messages, addMessage } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recipient = users.find(u => u.id === recipientId);

  const chatMessages = messages.filter(
    m => (m.senderId === currentUser?.id && m.receiverId === recipientId) ||
         (m.senderId === recipientId && m.receiverId === currentUser?.id) ||
         (m.senderId === 'ai' && m.receiverId === 'both' && 
          (m.context?.participants?.includes(currentUser?.id) && 
           m.context?.participants?.includes(recipientId)))
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    if (isUsingAI) {
      try {
        // Send user's message first
        addMessage({
          id: String(Date.now()),
          senderId: currentUser.id,
          receiverId: recipientId,
          content: message,
          createdAt: new Date().toISOString()
        });

        // Get AI response
        const res = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBJDn1kU8IaegIZA-AOvgwOvHQk1uoGyp8",
          {
            contents: [{ parts: [{ text: message }] }],
          }
        );
        
        const aiResponse = res.data.candidates[0].content.parts[0].text;
        
        // Add AI response with context about participants
        addMessage({
          id: String(Date.now() + 1),
          senderId: 'ai',
          receiverId: 'both',
          content: aiResponse,
          createdAt: new Date().toISOString(),
          context: {
            participants: [currentUser.id, recipientId]
          }
        });
      } catch (error) {
        console.error('AI error:', error);
        addMessage({
          id: String(Date.now() + 1),
          senderId: 'ai',
          receiverId: 'both',
          content: 'Sorry, I encountered an error. Please try again.',
          createdAt: new Date().toISOString(),
          context: {
            participants: [currentUser.id, recipientId]
          }
        });
      }
    } else {
      addMessage({
        id: String(Date.now()),
        senderId: currentUser.id,
        receiverId: recipientId,
        content: message,
        createdAt: new Date().toISOString()
      });
    }

    setMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-gray-900">
      <div className="flex items-center p-4 border-b border-gray-800">
        <img
          src={recipient?.avatar}
          alt={recipient?.name}
          className="w-10 h-10 rounded-full border-2 border-pink-500"
        />
        <div className="ml-3">
          <h3 className="font-medium text-pink-500">{recipient?.name}</h3>
          <p className="text-sm text-gray-400">{recipient?.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => {
          const isSender = msg.senderId === currentUser?.id;
          const isAI = msg.senderId === 'ai';
          
          return (
            <div
              key={msg.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isAI ? 'bg-purple-900 text-white' :
                  isSender ? 'bg-pink-600 text-white' : 'bg-gray-800 text-white'
                }`}
              >
                {isAI && (
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-purple-800">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsUsingAI(!isUsingAI)}
            className={`p-2 rounded-full ${
              isUsingAI ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
            } hover:bg-purple-700 transition-colors`}
            title={isUsingAI ? 'Disable AI Assistant' : 'Enable AI Assistant'}
          >
            <Brain className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isUsingAI ? "Ask AI Assistant..." : "Type a message..."}
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}