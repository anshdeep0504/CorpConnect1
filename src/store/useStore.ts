import { create } from 'zustand';
import { User, Thread, Message, LearningPath } from '../types';

interface Store {
  currentUser: User | null;
  users: User[];
  threads: Thread[];
  messages: Message[];
  learningPaths: LearningPath[];
  setCurrentUser: (user: User) => void;
  addThread: (thread: Thread) => void;
  addMessage: (message: Message) => void;
  updateUserPoints: (userId: string, points: number) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    email: "aarav.sharma@techcorp.in",
    password: "password123",
    title: "Senior Software Engineer",
    company: "TechCorp India",
    skills: ["React", "Node.js", "Python"],
    points: 450,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@innovatech.in",
    password: "password123",
    title: "Product Manager",
    company: "InnovaTech Solutions",
    skills: ["Product Strategy", "Agile", "UX Design"],
    points: 380,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    id: "3",
    name: "Vikram Malhotra",
    email: "vikram.m@datatech.in",
    password: "password123",
    title: "Data Scientist",
    company: "DataTech Analytics",
    skills: ["Python", "Machine Learning", "Data Visualization"],
    points: 420,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  }
];

const sampleThreads: Thread[] = [
  {
    id: "1",
    userId: "1",
    content: "Just completed a fascinating project using React and Node.js. Anyone interested in discussing modern web architecture?",
    likes: 15,
    comments: [],
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "2",
    userId: "2",
    content: "Looking for team members with UX Design experience for an upcoming project. Great opportunity to work on an innovative product!",
    likes: 8,
    comments: [],
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

const sampleLearningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Full Stack Development",
    description: "Master modern web development with React, Node.js, and related technologies",
    skills: ["React", "Node.js", "TypeScript"],
    modules: [
      {
        id: "1",
        title: "React Fundamentals",
        content: "Learn the basics of React including components, props, and state",
        points: 100,
        completed: false
      },
      {
        id: "2",
        title: "Node.js Backend Development",
        content: "Build scalable backend services with Node.js",
        points: 150,
        completed: false
      }
    ]
  },
  {
    id: "2",
    title: "Data Science Essentials",
    description: "Learn fundamental concepts of data science and machine learning",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    modules: [
      {
        id: "3",
        title: "Python for Data Science",
        content: "Master Python libraries for data analysis",
        points: 120,
        completed: false
      }
    ]
  }
];

export const useStore = create<Store>((set) => ({
  currentUser: null,
  users: sampleUsers,
  threads: sampleThreads,
  messages: [],
  learningPaths: sampleLearningPaths,
  setCurrentUser: (user) => set({ currentUser: user }),
  addThread: (thread) => set((state) => ({ threads: [thread, ...state.threads] })),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateUserPoints: (userId, points) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, points: user.points + points } : user
      ),
      currentUser: state.currentUser?.id === userId
        ? { ...state.currentUser, points: state.currentUser.points + points }
        : state.currentUser
    })),
  login: async (email, password) => {
    const user = sampleUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ currentUser: user });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  register: async (userData) => {
    const newUser: User = {
      id: String(sampleUsers.length + 1),
      name: userData.name || '',
      email: userData.email || '',
      password: userData.password || '',
      title: userData.title || '',
      company: userData.company || '',
      skills: userData.skills || [],
      points: 0,
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=150&h=150&fit=crop`
    };
    set((state) => ({ users: [...state.users, newUser], currentUser: newUser }));
  },
  logout: () => set({ currentUser: null })
}));