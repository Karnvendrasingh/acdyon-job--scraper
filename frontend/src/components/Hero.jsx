import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Globe2, ShieldCheck, Zap } from 'lucide-react';
import CountUp from './CountUp';

const SEARCH_TERMS = [
  "React Remote",
  "Golang Senior",
  "Python AI Engine",
  "Staff Architect",
  "Full Stack Lead"
];

const POPULAR_TAGS = [
  { label: '⚡ All Jobs', val: '' },
  { label: '💻 Dev', val: 'dev' },
  { label: '🔥 Senior', val: 'senior' },
  { label: '🐍 Python', val: 'python' },
  { label: '🐹 Golang', val: 'golang' },
  { label: '⚛️ React', val: 'react' },
  { label: '🤖 AI / ML', val: 'ai' },
  { label: '☁️ Cloud', val: 'aws' },
  { label: '💼 Executive', val: 'exec' }
];

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  selectedSource,
  setSelectedSource,
  remoteOnly,
  setRemoteOnly,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalJobsCount,
  showSavedOnly
}) {
  const [typedText, setTypedText] = useState('');
  const [termIndex, setTermIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Typewriter effect logic: type -> pause -> backspace -> next term
  useEffect(() => {
    const currentTerm = SEARCH_TERMS[termIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && typedText === currentTerm) {
      speed = 2200; // Pause at end of word
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setTermIndex((prev) => (prev + 1) % SEARCH_TERMS.length);
      speed = 400;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && typedText !== currentTerm) {
        setTypedText(currentTerm.slice(0, typedText.length + 1));
      } else if (isDeleting && typedText !== '') {
        setTypedText(currentTerm.slice(0, typedText.length - 1));
      } else if (!isDeleting && typedText === currentTerm) {
        setIsDeleting(true);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, termIndex]);

  // Framer Motion word reveal variants
  const wordContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const wordItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section style={{ position: 'relative', maxWidth: '1240px', margin: '2rem auto 1.5rem', padding: '0 1.5rem' }}>
      
      {/* Scanline Sweep Diagonal Light Beam */}
      <div className="scanline-sweep" />

      {/* Upward Floating Hero Data Packet Particles */}
      <div className="hero-particle" style={{ left: '15%', bottom: '10%', animationDelay: '0s' }} />
      <div className="hero-particle" style={{ left: '45%', bottom: '5%', animationDelay: '2.5s' }} />
      <div className="hero-particle" style={{ left: '80%', bottom: '15%', animationDelay: '4.8s' }} />

      {/* Hero Headline & Subtitle */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 3 }}>
        
        {/* Top Pill Badge */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'inline-block', marginBottom: '1.25rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.95rem',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#3B82F6',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            <Sparkles size={14} />
            <span>Automated Ingestion Engine • Scrapling Adaptive Selectors</span>
          </div>
        </motion.div>

        {/* Staggered Headline Reveal */}
        <motion.h1 
          variants={wordContainerVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: '800',
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: '#F8FAFC',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <motion.span variants={wordItemVariants}>Find</motion.span>
          <motion.span variants={wordItemVariants}>Verified</motion.span>
          <motion.span variants={wordItemVariants} className="gradient-text-blue-violet">
            Remote Opportunities
          </motion.span>
          <motion.span variants={wordItemVariants}>In</motion.span>
          <motion.span variants={wordItemVariants}>Real-Time</motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            color: '#94A3B8',
            fontSize: '1.1rem',
            maxWidth: '680px',
            margin: '0 auto 1.75rem',
            fontWeight: '400',
            lineHeight: 1.6
          }}
        >
          Indexed directly from verified public remote job platforms using anti-fingerprint fetchers, dynamic throttling, and zero-downtime failovers.
        </motion.p>

        {/* Live Social Proof Count-Up Stats Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '0.55rem 1.25rem',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.825rem',
            color: '#94A3B8',
            fontWeight: '500'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: '#3B82F6', fontWeight: '800' }}>
              <CountUp end={12400} duration={1200} />+
            </span>
            <span>Jobs Indexed</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Globe2 size={14} color="#8B5CF6" />
            <span style={{ color: '#F8FAFC', fontWeight: '700' }}>
              <CountUp end={80} duration={1200} />+ Countries
            </span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: '#10B981', fontWeight: '700' }}>
              Updated Every <CountUp end={15} duration={1200} /> min
            </span>
          </div>
        </motion.div>

      </div>

      {/* Animated Search Bar with Typewriter Placeholder & Focus Glow */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{
          position: 'relative',
          maxWidth: '780px',
          margin: '0 auto 1.75rem',
          borderRadius: '1.1rem',
          padding: '2px',
          background: isSearchFocused 
            ? 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' 
            : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isSearchFocused 
            ? '0 0 30px rgba(59, 130, 246, 0.4)' 
            : '0 10px 30px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 3
        }}
      >
        <div 
          className="glass-card"
          style={{
            padding: '0.75rem 1rem 0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            borderRadius: '1rem',
            background: '#0A0E1A'
          }}
        >
          <Search size={22} color={isSearchFocused ? '#3B82F6' : '#64748B'} />
          
          <div style={{ position: 'relative', flex: 1, height: '26px', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F8FAFC',
                fontSize: '1rem',
                fontFamily: 'inherit',
                fontWeight: '500',
                position: 'relative',
                zIndex: 2
              }}
            />

            {!searchQuery && (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: '#64748B',
                  fontSize: '0.975rem',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 1
                }}
              >
                Search '{typedText}<span style={{ opacity: 0.7 }}>|</span>'
              </span>
            )}
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94A3B8',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ✕
            </button>
          )}

          <div className="mono-font" style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#64748B',
            fontSize: '0.75rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span>Press</span>
            <kbd style={{ background: '#1E293B', color: '#CBD5E1', padding: '0.05rem 0.35rem', borderRadius: '0.25rem' }}>/</kbd>
          </div>
        </div>
      </motion.div>

      {/* Filter Tag Pills with Shared Layout Highlight (layoutId) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 3
        }}
      >
        {POPULAR_TAGS.map((tag) => {
          const isActive = selectedTag === tag.val;
          return (
            <motion.button
              key={tag.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(isActive && tag.val !== '' ? '' : tag.val)}
              style={{
                position: 'relative',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.825rem',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                    zIndex: -1
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{tag.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Toolbar Controls */}
      <div className="glass-card" style={{
        padding: '0.85rem 1.35rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderRadius: '0.9rem',
        position: 'relative',
        zIndex: 3
      }}>
        {/* Left Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F8FAFC' }}>
            {showSavedOnly ? 'Saved Bookmarks' : 'Live Opportunities'}
          </span>
          <span style={{
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#3B82F6',
            fontWeight: '800',
            fontSize: '0.825rem',
            padding: '0.2rem 0.7rem',
            borderRadius: '999px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <CountUp end={totalJobsCount} duration={800} /> jobs
          </span>
        </div>

        {/* Right Filter Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Source Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={14} color="#94A3B8" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#E2E8F0',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                fontSize: '0.825rem',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Sources</option>
              <option value="remoteok">RemoteOK API</option>
              <option value="arbeitnow">Arbeitnow API</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={14} color="#94A3B8" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#E2E8F0',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                fontSize: '0.825rem',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="company">Company (A-Z)</option>
              <option value="source">Source</option>
            </select>
          </div>

          {/* Remote Only Toggle */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.825rem',
            color: '#CBD5E1',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              style={{ accentColor: '#3B82F6', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>Remote Only</span>
          </label>

          {/* View Mode Toggle (Grid vs List) */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '0.15rem'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#3B82F6' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                borderRadius: '0.35rem',
                padding: '0.25rem 0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#3B82F6' : 'transparent',
                color: viewMode === 'list' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                borderRadius: '0.35rem',
                padding: '0.25rem 0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
