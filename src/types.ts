export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  title: string;
  company: string;
  skills: string[];
  points: number;
  avatar: string;
}

export interface Thread {
  id: string;
  userId: string;
  content: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  context?: {
    participants?: string[];
  };
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  modules: LearningModule[];
}

export interface LearningModule {
  id: string;
  title: string;
  content: string;
  points: number;
  completed: boolean;
}