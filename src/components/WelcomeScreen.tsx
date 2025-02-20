import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1707333731097-57ba5329a115?q=80&w=1920")',
      }}
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-4xl md:text-6xl font-bold text-center mb-8"
      >
        Ram Mandir Construction Quiz
      </motion.h1>
      
      <motion.div 
        className="text-center mb-12 max-w-2xl px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-lg mb-4">
          Test your knowledge about the historic Ram Mandir construction and watch the temple come alive with each correct answer!
        </p>
        <p className="text-md opacity-90">
          You have 1 minute per question. Answer correctly to unlock and light up a new section of the temple.
        </p>
      </motion.div>

      <motion.button
        onClick={onStart}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full flex items-center gap-2 text-xl font-semibold transition-all transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play size={24} />
        Tap to Begin
      </motion.button>
    </motion.div>
  );
};