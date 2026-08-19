import React from 'react';
import { CheckCircle, Info } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.75rem',
      right: '1.75rem',
      zIndex: 200,
      background: '#0f172a',
      border: '1px solid #38bdf8',
      color: '#f8fafc',
      padding: '0.75rem 1.25rem',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <CheckCircle size={18} color="#38bdf8" />
      <span>{message}</span>
    </div>
  );
}
