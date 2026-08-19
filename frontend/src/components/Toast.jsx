import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 200,
            background: '#0A0E1A',
            border: '1px solid #3B82F6',
            color: '#F8FAFC',
            padding: '0.85rem 1.35rem',
            borderRadius: '0.85rem',
            boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          <CheckCircle2 size={20} color="#3B82F6" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
