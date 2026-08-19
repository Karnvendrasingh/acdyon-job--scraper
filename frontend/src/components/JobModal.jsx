import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, ExternalLink, Bookmark, Share2, Calendar, ShieldCheck, Hash, Code2 } from 'lucide-react';

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

  // Schema.org JobPosting JSON-LD for Google for Jobs
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": `Verified remote job opportunity for ${job.title} at ${job.company}. Indexed via ${job.source} ingestion engine.`,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": String(job.id)
    },
    "datePosted": new Date(job.created_at).toISOString(),
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Remote",
        "addressCountry": "Global"
      }
    },
    "jobLocationType": "TELECOMMUTE",
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "WORLDWIDE"
    },
    "directApply": true,
    "url": job.apply_url
  };

  useEffect(() => {
    // Dynamically inject schema.org JSON-LD into document head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'google-job-posting-jsonld';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('google-job-posting-jsonld');
      if (existing) existing.remove();
    };
  }, [job]);

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
            maxWidth: '680px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '2rem',
            background: '#0A0E1A',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3B82F6',
                padding: '0.25rem 0.65rem',
                borderRadius: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: '0.6rem'
              }}>
                <ShieldCheck size={14} />
                <span>Verified Ingestion via {job.source}</span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F8FAFC', lineHeight: 1.25 }}>
                {job.title}
              </h2>
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

          {/* Quick Meta Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            padding: '1.1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '0.85rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#CBD5E1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={16} color="#3B82F6" />
              <span>Company: <strong style={{ color: '#F8FAFC' }}>{job.company}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#8B5CF6" />
              <span>Location: <strong style={{ color: '#F8FAFC' }}>{job.location || 'Remote Global'}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#94A3B8" />
              <span>Indexed: <strong>{new Date(job.created_at).toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Skill Taxonomy */}
          {tagsList.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.825rem', textTransform: 'uppercase', color: '#64748B', fontWeight: '700', marginBottom: '0.65rem' }}>
                Required Skills & Taxonomy
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tagsList.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      color: '#3B82F6',
                      padding: '0.35rem 0.8rem',
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

          {/* Google for Jobs Structured Data Indicator */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
            fontSize: '0.775rem',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Code2 size={16} color="#10B981" />
            <span>Google for Jobs Structured Data (`JobPosting` schema.org) Active for this Listing</span>
          </div>

          {/* Deduplication Hash */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            borderRadius: '0.6rem',
            marginBottom: '2rem',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', color: '#94A3B8', fontWeight: '600' }}>
              <Hash size={13} color="#3B82F6" />
              <span>Infallible SHA-256 Content Hash:</span>
            </div>
            <code className="mono-font" style={{ color: '#3B82F6', wordBreak: 'break-all' }}>
              {job.content_hash}
            </code>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onToggleSave(job.id)}
                style={{
                  background: isSaved ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${isSaved ? '#8B5CF6' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: isSaved ? '#C4B5FD' : '#E2E8F0',
                  padding: '0.6rem 1rem',
                  borderRadius: '0.65rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Bookmark size={16} fill={isSaved ? '#C4B5FD' : 'none'} />
                <span>{isSaved ? 'Bookmarked' : 'Save Job'}</span>
              </button>

              <button
                onClick={() => onShareJob(job)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#E2E8F0',
                  padding: '0.6rem 1rem',
                  borderRadius: '0.65rem',
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
              className="shimmer-btn"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                color: '#FFFFFF',
                padding: '0.7rem 1.6rem',
                borderRadius: '0.65rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 18px rgba(59, 130, 246, 0.4)'
              }}
            >
              <span>Apply on {job.company} Portal</span>
              <ExternalLink size={16} />
            </a>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
