'use client';

import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';

export function Header() {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/movies" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Film className="h-8 w-8 text-red-600" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            MovieSearch
          </span>
        </Link>
        
        <ThemeToggle />
      </div>
    </motion.header>
  );
}