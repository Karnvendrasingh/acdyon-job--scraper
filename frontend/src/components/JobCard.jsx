import React from 'react';
import { Building2, MapPin, ExternalLink, Bookmark, Share2, Clock, Check } from 'lucide-react';

function getCompanyAvatarGradient(name = 'Company') {
  const colors = [
    'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
    'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
    'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Recently';
  const diffMs = new Date() - new Date(dateStr);
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function JobCard({ 
  job, 
  viewMode, 
  isSaved, 
  onToggleSave, 
  onSelectTag, 
  onOpenModal,
  onShareJob 
}) {
  let tagsList = [];
  if (job.tags) {
    try {
      tagsList = typeof job.tags === 'string' ? JSON.parse(job.tags) : job.tags;
    } catch (e) {
      tagsList = [];
    }
  }

  const avatarGradient = getCompanyAvatarGradient(job.company);
  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : 'J';

  if (viewMode === 'list') {
    return (
      <div 
        className="glass-panel glass-panel-hover"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '0.75rem',
          borderRadius: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
          {/* Avatar */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: avatarGradient,
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}>
            {companyInitial}
          </div>

          {/* Details */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 
              onClick={() => onOpenModal(job)}
              style={{
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#f8fafc',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '0.2rem'
              }}
              className="job-title-hover"
            >
              {job.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: '#94a3b8' }}>
              <span style={{ fontWeight: '600', color: '#cbd5e1' }}>{job.company}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={13} color="#38bdf8" />
                {job.location || 'Remote'}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} />
                {formatRelativeTime(job.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => onToggleSave(job.id)}
            style={{
              background: isSaved ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isSaved ? '#818cf8' : 'rgba(255, 255, 255, 0.1)'}`,
              color: isSaved ? '#818cf8' : '#64748b',
              padding: '0.45rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <Bookmark size={16} fill={isSaved ? '#818cf8' : 'none'} />
          </button>

          <button
            onClick={() => onShareJob(job)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              padding: '0.45rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
            title="Share Job"
          >
            <Share2 size={16} />
          </button>

          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
              color: '#0f172a',
              padding: '0.45rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.825rem',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Apply</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    );
  }

  // Grid View Mode
  return (
    <div 
      className="glass-panel glass-panel-hover"
      style={{
        padding: '1.35rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '1rem',
        position: 'relative',
        height: '100%'
      }}
    >
      {/* Top Company Info & Bookmark */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: avatarGradient,
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
            }}>
              {companyInitial}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={13} color="#94a3b8" />
                <span>{job.company}</span>
              </div>
              <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                <MapPin size={12} color="#38bdf8" />
                <span>{job.location || 'Remote'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => onToggleSave(job.id)}
              style={{
                background: isSaved ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isSaved ? '#818cf8' : 'rgba(255, 255, 255, 0.1)'}`,
                color: isSaved ? '#818cf8' : '#64748b',
                padding: '0.45rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
            >
              <Bookmark size={16} fill={isSaved ? '#818cf8' : 'none'} />
            </button>

            <button
              onClick={() => onShareJob(job)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                padding: '0.45rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Share Job"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Job Title */}
        <h3 
          onClick={() => onOpenModal(job)}
          style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: '#f8fafc',
            lineHeight: 1.35,
            marginBottom: '0.85rem',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          className="job-title-hover"
        >
          {job.title}
        </h3>

        {/* Tags Container */}
        {tagsList.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {tagsList.slice(0, 5).map((t, idx) => (
              <span
                key={idx}
                onClick={(e) => { e.stopPropagation(); onSelectTag(t); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  color: '#cbd5e1',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.725rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Apply Button */}
      <div style={{
        paddingTop: '0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.775rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            padding: '0.15rem 0.45rem',
            borderRadius: '0.3rem',
            background: job.source === 'remoteok' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(168, 85, 247, 0.12)',
            color: job.source === 'remoteok' ? '#38bdf8' : '#c084fc',
            fontWeight: '700',
            textTransform: 'uppercase',
            fontSize: '0.65rem'
          }}>
            {job.source}
          </span>
          <span>•</span>
          <span>{formatRelativeTime(job.created_at)}</span>
        </div>

        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
            color: '#0f172a',
            padding: '0.45rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.825rem',
            fontWeight: '700',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Apply Now</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
