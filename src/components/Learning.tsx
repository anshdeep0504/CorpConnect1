import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { BookOpen, Award, Brain, Play } from 'lucide-react';
import axios from 'axios';

export function Learning() {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const { learningPaths, currentUser, updateUserPoints } = useStore();

  const getAIRecommendation = async () => {
    if (!question.trim()) return;

    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBJDn1kU8IaegIZA-AOvgwOvHQk1uoGyp8",
        {
          contents: [
            {
              parts: [{ text: `Based on my skills (${currentUser?.skills.join(', ')}), ${question}` }],
            },
          ],
        }
      );
      setAiResponse(res.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      setAiResponse('Unable to get AI recommendation at this time.');
    }
  };

  const completeModule = (modulePoints: number) => {
    if (currentUser) {
      updateUserPoints(currentUser.id, modulePoints);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-semibold text-pink-500">AI Learning Assistant</h2>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about learning recommendations..."
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <button
            onClick={getAIRecommendation}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Brain className="w-5 h-5" />
            <span>Get AI Recommendation</span>
          </button>
          {aiResponse && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white">
              {aiResponse}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-semibold text-pink-500">Learning Paths</h2>
        </div>
        <div className="space-y-4">
          {learningPaths.map((path) => (
            <div key={path.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
              <h3 className="font-medium text-lg text-white">{path.title}</h3>
              <p className="text-gray-400 mb-2">{path.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {path.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                {path.modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded">
                    <span className="text-white">{module.title}</span>
                    {module.completed ? (
                      <Award className="w-5 h-5 text-pink-500" />
                    ) : (
                      <button
                        onClick={() => completeModule(module.points)}
                        className="flex items-center space-x-2 text-sm bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}