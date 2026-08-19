import React from 'react';
import { Radar, RefreshCw, Bookmark, Activity, ShieldCheck, Zap } from 'lucide-react';

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
  const isHealthy = !telemetryData?.stale;
  const sourcesCount = Object.keys(telemetryData?.sources || {}).length || 2;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.9rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        
        {/* Brand & Radar Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setShowSavedOnly(false)}>
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Radar size={22} className="pulse-icon" style={{ animation: 'spin 12s linear infinite' }} />
            <div className="pulse-green" style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#34d399'
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }} className="gradient-text-cyan">
                JOB SCRAPER
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                padding: '0.15rem 0.45rem',
                borderRadius: '999px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                letterSpacing: '0.5px'
              }}>
                v2.0 LIVE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
              Resilient Scraping Ingestion Engine
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Telemetry Status Badge */}
          <button 
            onClick={onOpenTelemetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isHealthy ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 113, 133, 0.1)',
              border: `1px solid ${isHealthy ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 113, 133, 0.3)'}`,
              color: isHealthy ? '#34d399' : '#fb7185',
              padding: '0.45rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to view live scraping telemetry & pipeline audit logs"
          >
            <Activity size={15} />
            <span>{isHealthy ? 'Pipeline Operational' : 'Degraded (Stale)'}</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.1rem 0.4rem',
              borderRadius: '999px',
              fontSize: '0.7rem'
            }}>
              {sourcesCount} Sources
            </span>
          </button>

          {/* Bookmarks Tab Button */}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: showSavedOnly ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${showSavedOnly ? '#818cf8' : 'rgba(255, 255, 255, 0.1)'}`,
              color: showSavedOnly ? '#a5b4fc' : '#94a3b8',
              padding: '0.45rem 0.85rem',
              borderRadius: '0.6rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Bookmark size={16} fill={showSavedOnly ? '#a5b4fc' : 'none'} />
            <span>Saved</span>
            {savedCount > 0 && (
              <span style={{
                background: '#6366f1',
                color: '#fff',
                borderRadius: '999px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.7rem',
                fontWeight: '700'
              }}>
                {savedCount}
              </span>
            )}
          </button>

          {/* Manual Sync / Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.6rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
              transition: 'all 0.2s ease',
              opacity: isRefreshing ? 0.7 : 1
            }}
          >
            <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Pipeline'}</span>
          </button>

        </div>
      </div>
    </header>
  );
}
