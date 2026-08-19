import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Server, CheckCircle2, AlertTriangle, Clock, Cpu, RefreshCw } from 'lucide-react';

export default function TelemetryModal({ isOpen, onClose, telemetryData, onManualSync, isRefreshing }) {
  if (!isOpen) return null;

  const sources = telemetryData?.sources || {};
  const recentRuns = telemetryData?.recent_runs || [];

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
            maxWidth: '780px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '2rem',
            background: '#0A0E1A',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <Activity size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#F8FAFC' }}>
                  Ingestion Engine Telemetry
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#94A3B8' }}>
                  Real-time circuit breaker health metrics & automated rate throttle logs
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

          {/* Source Health Tracker Grid */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '0.825rem', textTransform: 'uppercase', color: '#64748B', fontWeight: '700', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={14} color="#3B82F6" />
              <span>Crawler Health Tracker</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {Object.entries(sources).map(([name, info]) => {
                const isHealthy = info.state === 'healthy';
                return (
                  <div 
                    key={name}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                      borderRadius: '0.9rem',
                      padding: '1.1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#F8FAFC', textTransform: 'capitalize' }}>
                        {name} API
                      </span>

                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: isHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: isHealthy ? '#10B981' : '#F43F5E',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.725rem',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}>
                        {isHealthy ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                        {info.state}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.825rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Consecutive Failures:</span>
                        <strong style={{ color: info.consecutive_failures > 0 ? '#F43F5E' : '#10B981' }}>
                          {info.consecutive_failures}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Consecutive Successes:</span>
                        <strong style={{ color: '#CBD5E1' }}>{info.consecutive_successes}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Last Successful Sync:</span>
                        <strong style={{ color: '#CBD5E1' }}>
                          {info.last_success ? new Date(info.last_success).toLocaleTimeString() : 'Never'}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ingestion Runs Audit Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '0.825rem', textTransform: 'uppercase', color: '#64748B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="#8B5CF6" />
                <span>Recent Ingestion Cycle Audit Logs</span>
              </h3>

              <button
                onClick={onManualSync}
                disabled={isRefreshing}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#3B82F6',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '0.45rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <RefreshCw size={12} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                <span>Trigger Sync</span>
              </button>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '0.85rem',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94A3B8', textAlign: 'left' }}>
                    <th style={{ padding: '0.7rem 1rem' }}>Time</th>
                    <th style={{ padding: '0.7rem 1rem' }}>Source</th>
                    <th style={{ padding: '0.7rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.7rem 1rem' }}>Duration</th>
                    <th style={{ padding: '0.7rem 1rem' }}>Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRuns.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '1.25rem', textAlign: 'center', color: '#64748B' }}>
                        No recent runs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentRuns.map((run) => (
                      <tr key={run.id} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', color: '#E2E8F0' }}>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          {new Date(run.created_at).toLocaleTimeString()}
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: '600' }}>
                          {run.source}
                        </td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span style={{
                            color: run.status === 'success' ? '#10B981' : '#F43F5E',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            fontSize: '0.7rem'
                          }}>
                            {run.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 1rem' }} className="mono-font">
                          {run.duration_seconds ? `${run.duration_seconds.toFixed(2)}s` : 'N/A'}
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: '700', color: '#3B82F6' }}>
                          +{run.item_count} jobs
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Banner */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '0.7rem',
            fontSize: '0.8rem',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Cpu size={18} color="#3B82F6" />
            <span>
              Engine executes via APScheduler 30-min loop with Scrapling anti-fingerprint fetchers and automatic failover.
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
