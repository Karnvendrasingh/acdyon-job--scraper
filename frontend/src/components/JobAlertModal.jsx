import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Mail, CheckCircle2, Sparkles } from 'lucide-react';

export default function JobAlertModal({ isOpen, onClose, defaultTag, onTriggerToast }) {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onTriggerToast(`Job alert set up for ${email}!`);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1800);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            background: '#0A0E1A',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.2)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <Bell size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#F8FAFC' }}>
                  Create Custom Job Alert
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  Get real-time email alerts when matching listings drop
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94A3B8',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '0.4rem' }}>
                Job Alert Active!
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
                We'll deliver top verified opportunities to <strong style={{ color: '#3B82F6' }}>{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '0.4rem' }}>
                  Target Keyword / Category:
                </label>
                <div style={{
                  padding: '0.65rem 0.9rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '0.6rem',
                  color: '#3B82F6',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Sparkles size={15} />
                  <span>{defaultTag ? `#${defaultTag}` : 'All Remote Postings'}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '0.4rem' }}>
                  Your Email Address:
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 0.9rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '0.6rem'
                }}>
                  <Mail size={18} color="#64748B" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@company.com"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#F8FAFC',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '0.4rem' }}>
                  Notification Frequency:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setFrequency('instant')}
                    style={{
                      background: frequency === 'instant' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${frequency === 'instant' ? '#3B82F6' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: frequency === 'instant' ? '#3B82F6' : '#94A3B8',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Instant Sync
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('daily')}
                    style={{
                      background: frequency === 'daily' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${frequency === 'daily' ? '#3B82F6' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: frequency === 'daily' ? '#3B82F6' : '#94A3B8',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    📅 Daily Digest
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="shimmer-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '0.65rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)'
                }}
              >
                {isSubmitting ? 'Creating Alert...' : 'Subscribe to Free Job Alerts'}
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
