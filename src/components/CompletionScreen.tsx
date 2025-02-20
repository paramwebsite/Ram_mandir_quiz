import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';

interface CompletionScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  score,
  totalQuestions,
  onRestart,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-6xl mb-8 text-yellow-500"
      >
        <Trophy />
      </motion.div>

      <h1 className="text-4xl font-bold mb-4 text-center">
        Congratulations!
      </h1>

      <p className="text-xl mb-8 text-center">
        You have completed the Ram Mandir Construction Quiz!
      </p>

      <div className="text-2xl mb-12 text-center">
        Score: <span className="text-orange-500 font-bold">{score}</span> / {totalQuestions}
      </div>

      <motion.button
        onClick={onRestart}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCw size={20} />
        Play Again
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-gray-400 max-w-md"
      >
        <p>
          The Ram Mandir stands as a symbol of faith and unity. Thank you for learning about its historic journey.
        </p>
      </motion.div>
    </motion.div>
  );
};