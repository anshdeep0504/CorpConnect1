import React from 'react';
import { useStore } from '../store/useStore';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface Props {
  onChatSelect: (userId: string) => void;
}

export function SkillMatching({ onChatSelect }: Props) {
  const { users, currentUser } = useStore();

  const matchedUsers = users.filter((user) => 
    user.id !== currentUser?.id &&
    user.skills.some((skill) => currentUser?.skills.includes(skill))
  );

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-pink-500 mb-4">Skill Matches</h2>
      <div className="space-y-4">
        {matchedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-pink-500"
              />
              <div>
                <h3 className="font-medium text-white">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.skills
                    .filter((skill) => currentUser?.skills.includes(skill))
                    .map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-pink-500/20 rounded-full text-gray-400 hover:text-pink-500 transition-colors">
                <ThumbsUp className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-pink-500/20 rounded-full text-gray-400 hover:text-pink-500 transition-colors">
                <ThumbsDown className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onChatSelect(user.id)}
                className="p-2 hover:bg-pink-500/20 rounded-full text-gray-400 hover:text-pink-500 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}