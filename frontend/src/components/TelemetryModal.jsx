import React from 'react';
import { X, Activity, Server, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Cpu, RefreshCw } from 'lucide-react';

export default function TelemetryModal({ isOpen, onClose, telemetryData, onManualSync, isRefreshing }) {
  if (!isOpen) return null;

  const sources = telemetryData?.sources || {};
  const recentRuns = telemetryData?.recent_runs || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}>
              <Activity size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc' }}>
                Pipeline Ingestion Telemetry
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Live health tracking, rate throttle metrics, and failover router logs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
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

        {/* Source Health Cards */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Server size={14} />
            <span>Crawler Health Tracker</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {Object.entries(sources).map(([name, info]) => {
              const isHealthy = info.state === 'healthy';
              return (
                <div 
                  key={name}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: `1px solid ${isHealthy ? 'rgba(52, 211, 153, 0.25)' : 'rgba(251, 113, 133, 0.25)'}`,
                    borderRadius: '0.85rem',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', textTransform: 'capitalize' }}>
                        {name} API
                      </span>
                    </div>

                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: isHealthy ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                      color: isHealthy ? '#34d399' : '#fb7185',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {isHealthy ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {info.state}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Consecutive Failures:</span>
                      <strong style={{ color: info.consecutive_failures > 0 ? '#fb7185' : '#34d399' }}>
                        {info.consecutive_failures}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Consecutive Successes:</span>
                      <strong style={{ color: '#cbd5e1' }}>{info.consecutive_successes}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Last Successful Sync:</span>
                      <strong style={{ color: '#cbd5e1' }}>
                        {info.last_success ? new Date(info.last_success).toLocaleTimeString() : 'Never'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ingestion Runs Audit Log */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} />
              <span>Recent Ingestion Cycle Audit Logs</span>
            </h3>

            <button
              onClick={onManualSync}
              disabled={isRefreshing}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.25rem 0.65rem',
                borderRadius: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <RefreshCw size={12} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              <span>Trigger Sync</span>
            </button>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.75rem',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textIndent: 'initial' }}>
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.6)', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Time</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Source</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Status</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Duration</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Yield</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                      No recent runs recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentRuns.map((run) => (
                    <tr key={run.id} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', color: '#e2e8f0' }}>
                      <td style={{ padding: '0.6rem 0.85rem' }}>
                        {new Date(run.created_at).toLocaleTimeString()}
                      </td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: '600' }}>
                        {run.source}
                      </td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>
                        <span style={{
                          color: run.status === 'success' ? '#34d399' : '#fb7185',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          fontSize: '0.7rem'
                        }}>
                          {run.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0.85rem' }} className="mono-font">
                        {run.duration_seconds ? `${run.duration_seconds.toFixed(2)}s` : 'N/A'}
                      </td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: '700', color: '#38bdf8' }}>
                        +{run.item_count} jobs
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          padding: '0.85rem',
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: '0.6rem',
          fontSize: '0.775rem',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Cpu size={16} color="#38bdf8" />
          <span>
            Pipeline operates via APScheduler loop every 30 mins with automatic failover (threshold: 3 consecutive errors).
          </span>
        </div>

      </div>
    </div>
  );
}
