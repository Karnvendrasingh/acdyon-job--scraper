import React from 'react';
import { X, Building2, MapPin, ExternalLink, Bookmark, Share2, Calendar, ShieldCheck, Hash } from 'lucide-react';

export default function JobModal({ job, onClose, isSaved, onToggleSave, onShareJob }) {
  if (!job) return null;

  let tagsList = [];
  if (job.tags) {
    try {
      tagsList = typeof job.tags === 'string' ? JSON.parse(job.tags) : job.tags;
    } catch (e) {
      tagsList = [];
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '0.2rem 0.6rem',
              borderRadius: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              <ShieldCheck size={14} />
              <span>Verified Ingestion via {job.source}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc', lineHeight: 1.25 }}>
              {job.title}
            </h2>
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

        {/* Company & Location Info */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: '#cbd5e1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} color="#38bdf8" />
            <span>Company: <strong>{job.company}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="#38bdf8" />
            <span>Location: <strong>{job.location || 'Remote Global'}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="#94a3b8" />
            <span>Indexed: <strong>{new Date(job.created_at).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Tags */}
        {tagsList.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', marginBottom: '0.6rem' }}>
              Required Skills & Taxonomy
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tagsList.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ingestion Integrity Check hash */}
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', color: '#94a3b8', fontWeight: '600' }}>
            <Hash size={13} />
            <span>Pipeline Content Deduplication Hash:</span>
          </div>
          <code className="mono-font" style={{ color: '#38bdf8', wordBreak: 'break-all' }}>
            {job.content_hash}
          </code>
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onToggleSave(job.id)}
              style={{
                background: isSaved ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${isSaved ? '#818cf8' : 'rgba(255, 255, 255, 0.15)'}`,
                color: isSaved ? '#a5b4fc' : '#e2e8f0',
                padding: '0.6rem 1rem',
                borderRadius: '0.6rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Bookmark size={16} fill={isSaved ? '#a5b4fc' : 'none'} />
              <span>{isSaved ? 'Bookmarked' : 'Save Job'}</span>
            </button>

            <button
              onClick={() => onShareJob(job)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '0.6rem 1rem',
                borderRadius: '0.6rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              color: '#ffffff',
              padding: '0.65rem 1.5rem',
              borderRadius: '0.6rem',
              fontSize: '0.9rem',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
            }}
          >
            <span>Proceed to Official Application</span>
            <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </div>
  );
}
