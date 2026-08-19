import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, RefreshCw, Bookmark, Activity, ShieldCheck, Check } from 'lucide-react';
import CountUp from './CountUp';

export default function Navbar({ 
  onRefresh, 
  isRefreshing, 
  savedCount, 
  showSavedOnly, 
  setShowSavedOnly,
  onOpenTelemetry,
  telemetryData,
  totalJobsCount
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  const isHealthy = !telemetryData?.stale;
  const sourcesCount = Object.keys(telemetryData?.sources || {}).length || 2;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSyncClick = () => {
    onRefresh();
    setSyncedSuccess(false);
  };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(10, 14, 26, 0.92)' : 'rgba(10, 14, 26, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isScrolled ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
        padding: isScrolled ? '0.75rem 1.5rem' : '1.1rem 1.5rem',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        
        {/* Brand Logo & Tagline */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
          onClick={() => setShowSavedOnly(false)}
        >
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25))',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3B82F6',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
          }}>
            <Radar size={24} style={{ animation: 'spin 14s linear infinite' }} />
            <div className="pulse-emerald-ring" style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              zIndex: 2
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: '1.35rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Job Scraper
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '800',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                letterSpacing: '0.5px'
              }}>
                PRO v2.0
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>
              Resilient Scraping Ingestion Engine
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Live Pipeline Status Badge */}
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenTelemetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              background: isHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              color: isHealthy ? '#10B981' : '#F43F5E',
              padding: '0.45rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: isHealthy ? '0 0 12px rgba(16, 185, 129, 0.15)' : 'none'
            }}
            title="View live scraping telemetry & pipeline audit logs"
          >
            <div className="pulse-emerald-ring" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isHealthy ? '#10B981' : '#F43F5E',
              zIndex: 2
            }} />
            <span>{isHealthy ? 'Pipeline Operational' : 'Degraded (Stale)'}</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#94A3B8',
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
              fontSize: '0.7rem'
            }}>
              {sourcesCount} Sources
            </span>
          </motion.button>

          {/* Bookmarked Jobs */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: showSavedOnly ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${showSavedOnly ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)'}`,
              color: showSavedOnly ? '#C4B5FD' : '#94A3B8',
              padding: '0.45rem 0.9rem',
              borderRadius: '0.65rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={15} fill={showSavedOnly ? '#C4B5FD' : 'none'} />
            <span>Saved</span>
            {savedCount > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                color: '#FFF',
                borderRadius: '999px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: '800'
              }}>
                {savedCount}
              </span>
            )}
          </motion.button>

          {/* Sync Pipeline Button with Spin / Check Morph */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSyncClick}
            disabled={isRefreshing}
            className="shimmer-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.5rem 1.1rem',
              borderRadius: '0.65rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)',
              opacity: isRefreshing ? 0.8 : 1
            }}
          >
            {syncedSuccess ? (
              <Check size={16} color="#FFF" />
            ) : (
              <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            )}
            <span>{isRefreshing ? 'Syncing...' : 'Sync Pipeline'}</span>
          </motion.button>

        </div>
      </div>
    </motion.header>
  );
}
