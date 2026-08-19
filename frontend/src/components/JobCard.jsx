import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, ExternalLink, Bookmark, Share2, Clock, CheckCircle2, Shield } from 'lucide-react';

function getCompanyAvatarGradient(name = 'Company') {
  const colors = [
    'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
    'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

function getRegionBadge(location = '') {
  const loc = location.toLowerCase();
  if (loc.includes('usa') || loc.includes('united states') || loc.includes('us')) return { flag: '🇺🇸', label: 'USA Remote' };
  if (loc.includes('europe') || loc.includes('eu') || loc.includes('uk') || loc.includes('germany')) return { flag: '🇪🇺', label: 'Europe Remote' };
  if (loc.includes('latam') || loc.includes('brazil') || loc.includes('remoto')) return { flag: '🇦🇸', label: 'LATAM Remote' };
  if (loc.includes('asia') || loc.includes('india') || loc.includes('apac')) return { flag: '🌏', label: 'APAC Remote' };
  return { flag: '🌐', label: location || 'Global Remote' };
}

function getTagStyle(tag = '') {
  const t = tag.toLowerCase();
  if (t.includes('senior') || t.includes('ai') || t.includes('lead') || t.includes('exec')) {
    return { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', color: '#F59E0B' };
  }
  if (t.includes('python') || t.includes('golang') || t.includes('react') || t.includes('dev')) {
    return { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', color: '#3B82F6' };
  }
  return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.09)', color: '#CBD5E1' };
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
  const region = getRegionBadge(job.location);

  if (viewMode === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card"
        style={{
          padding: '1rem 1.35rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
          {/* Avatar with Verified Badge */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: avatarGradient,
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}>
              {companyInitial}
            </div>
            <CheckCircle2 size={15} color="#10B981" style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#0A0E1A', borderRadius: '50%' }} />
          </div>

          {/* Details */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 
              onClick={() => onOpenModal(job)}
              style={{
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#F8FAFC',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '0.2rem'
              }}
            >
              {job.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.825rem', color: '#94A3B8', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '600', color: '#CBD5E1' }}>{job.company}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>{region.flag}</span>
                <span>{region.label}</span>
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} color="#64748B" />
                {formatRelativeTime(job.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => onToggleSave(job.id)}
            style={{
              background: isSaved ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isSaved ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)'}`,
              color: isSaved ? '#8B5CF6' : '#64748B',
              padding: '0.5rem',
              borderRadius: '0.55rem',
              cursor: 'pointer'
            }}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <Bookmark size={16} fill={isSaved ? '#8B5CF6' : 'none'} />
          </button>

          <button
            onClick={() => onShareJob(job)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              padding: '0.5rem',
              borderRadius: '0.55rem',
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
            className="shimmer-btn"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              color: '#FFFFFF',
              padding: '0.5rem 1.1rem',
              borderRadius: '0.55rem',
              fontSize: '0.825rem',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
            }}
          >
            <span>Apply</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </motion.div>
    );
  }

  // Grid View Mode
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        {/* Top Header: Company Avatar + Region Flag + Actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: avatarGradient,
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)'
              }}>
                {companyInitial}
              </div>
              <CheckCircle2 size={16} color="#10B981" style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#0A0E1A', borderRadius: '50%' }} />
            </div>

            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={14} color="#94A3B8" />
                <span>{job.company}</span>
              </div>
              <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                <span>{region.flag}</span>
                <span>{region.label}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => onToggleSave(job.id)}
              style={{
                background: isSaved ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isSaved ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)'}`,
                color: isSaved ? '#8B5CF6' : '#64748B',
                padding: '0.45rem',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
            >
              <Bookmark size={15} fill={isSaved ? '#8B5CF6' : 'none'} />
            </button>

            <button
              onClick={() => onShareJob(job)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94A3B8',
                padding: '0.45rem',
                borderRadius: '0.5rem',
                cursor: 'pointer'
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
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#F8FAFC',
            lineHeight: 1.35,
            marginBottom: '1rem',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
        >
          {job.title}
        </h3>

        {/* Tag Badges with Dynamic Color Coding */}
        {tagsList.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.35rem' }}>
            {tagsList.slice(0, 5).map((t, idx) => {
              const tagStyle = getTagStyle(t);
              return (
                <span
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); onSelectTag(t); }}
                  style={{
                    background: tagStyle.bg,
                    border: `1px solid ${tagStyle.border}`,
                    color: tagStyle.color,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.725rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.775rem',
        color: '#64748B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '0.35rem',
            background: job.source === 'remoteok' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(139, 92, 246, 0.12)',
            color: job.source === 'remoteok' ? '#3B82F6' : '#C4B5FD',
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
          className="shimmer-btn"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            color: '#FFFFFF',
            padding: '0.5rem 1.1rem',
            borderRadius: '0.6rem',
            fontSize: '0.825rem',
            fontWeight: '700',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
          }}
        >
          <span>Apply Now</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </motion.div>
  );
}
