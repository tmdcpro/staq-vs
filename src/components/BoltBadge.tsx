import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function BoltBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-4 left-4 z-40"
    >
      <motion.a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium group"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeInOut",
            repeatDelay: 3 
          }}
        >
          <Zap className="h-4 w-4" />
        </motion.div>
        <span>Made with Bolt</span>
        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </motion.a>
    </motion.div>
  );
}