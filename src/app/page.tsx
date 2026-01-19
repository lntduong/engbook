'use client';

import { useSession } from 'next-auth/react';
import { FeatureCard } from '@/components/dashboard/FeatureCard';
import { DailyWord } from '@/components/dashboard/DailyWord';
import {
  BookA,
  BookOpen,
  GraduationCap,
  NotebookPen,
  Dumbbell,
  Youtube,
  Layers,
  Languages,
  Headphones,
  FileQuestion
} from 'lucide-react';

export default function Dashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Learner';

  const features = [
    {
      icon: BookA,
      title: "Vocabulary",
      description: "Manage your personal dictionary. Track words, IPA, and meanings.",
      href: "/vocab",
      color: "text-blue-600",
      gradient: "linear-gradient(135deg, #EFF6FF 0%, #BFDBFE 100%)",
    },
    {
      icon: BookOpen,
      title: "Reading",
      description: "Generate AI stories & quizzes to boost comprehension.",
      href: "/reading",
      color: "text-pink-600",
      gradient: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)",
    },
    {
      icon: Headphones,
      title: "Listening",
      description: "Practice listening with audio lessons and transcripts.",
      href: "/listening",
      color: "text-cyan-600",
      gradient: "linear-gradient(135deg, #ECFEFF 0%, #A5F3FC 100%)",
    },
    // {
    //   icon: GraduationCap,
    //   title: "Grammar",
    //   description: "Master English grammar rules with structured lessons and examples.",
    //   href: "/grammar",
    //   color: "text-purple-600",
    //   gradient: "linear-gradient(135deg, #FAF5FF 0%, #E9D5FF 100%)",
    // },
    {
      icon: Youtube,
      title: "Pronunciation",
      description: "Improve your speaking with YouGlish video examples.",
      href: "/youglish", // Assuming this route exists based on history
      color: "text-red-600",
      gradient: "linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)",
    },
    {
      icon: Layers,
      title: "Flashcards",
      description: "Review your vocabulary with interactive flashcards.",
      href: "/flashcard", // As per history
      color: "text-indigo-600",
      gradient: "linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 100%)",
    },
    {
      icon: NotebookPen,
      title: "Notes",
      description: "Your personal notebook for free-text study notes.",
      href: "/notes",
      color: "text-yellow-600",
      gradient: "linear-gradient(135deg, #FEFCE8 0%, #FEF08A 100%)",
    },
    {
      icon: Dumbbell,
      title: "Exercises",
      description: "Practice what you've learned with quizzes and matching games.",
      href: "/exercises",
      color: "text-green-600",
      gradient: "linear-gradient(135deg, #F0FDF4 0%, #BBF7D0 100%)",
    },
    {
      icon: Languages,
      title: "Translator",
      description: "Quickly translate words and sentences between languages.",
      href: "/translate",
      color: "text-orange-600",
      gradient: "linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)",
    },
    {
      icon: FileQuestion,
      title: "Exams",
      description: "Test your knowledge with real exam questions and time limits.",
      href: "/exams",
      color: "text-rose-600",
      gradient: "linear-gradient(135deg, #FAF5FF 0%, #E9D5FF 100%)",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
            Hi, {userName}! Ready to learn something new today?
          </p>
        </div>

        {/* Daily Vocabulary Section */}
        <DailyWord />

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              color={feature.color}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
