import React from 'react';
import { Search, Filter, Globe, Sparkles, LayoutGrid, List, SlidersHorizontal, CheckCircle2, ArrowUpDown } from 'lucide-react';

const POPULAR_TAGS = [
  { label: 'All Jobs', val: '' },
  { label: '💻 Dev', val: 'dev' },
  { label: '⚡ Senior', val: 'senior' },
  { label: '🐍 Python', val: 'python' },
  { label: '🐹 Golang', val: 'golang' },
  { label: '⚛️ React', val: 'react' },
  { label: '🤖 AI / ML', val: 'ai' },
  { label: '☁️ Cloud', val: 'aws' },
  { label: '💼 Executive', val: 'exec' },
  { label: '📈 Marketing', val: 'marketing' }
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
  return (
    <section style={{
      maxWidth: '1200px',
      margin: '2rem auto 1.5rem',
      padding: '0 1.5rem',
    }}>
      {/* Main Title & Subtitle */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          color: '#38bdf8',
          fontSize: '0.8rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} />
          <span>Automated Scrapling Ingestion • Adaptive Failover Engine</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          fontWeight: '800',
          letterSpacing: '-1px',
          lineHeight: 1.15,
          marginBottom: '1rem'
        }}>
          Find Global <span className="gradient-text-cyan">Remote Opportunities</span> In Real-Time
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '1.05rem',
          maxWidth: '680px',
          margin: '0 auto',
          fontWeight: '400'
        }}>
          Continuously indexed from public remote job APIs using Scrapling adaptive selectors, rate-throttling, and automatic fallbacks.
        </p>
      </div>

      {/* Big Glass Search Bar */}
      <div className="glass-panel" style={{
        padding: '0.6rem 0.8rem 0.6rem 1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '780px',
        margin: '0 auto 1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '1rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <Search size={22} color="#38bdf8" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by job title, company, skills or keyword..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontSize: '1rem',
            fontFamily: 'inherit',
            fontWeight: '500'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        )}
        <div className="mono-font" style={{
          background: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#64748b',
          fontSize: '0.75rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <span>Press</span>
          <kbd style={{ background: '#1e293b', color: '#cbd5e1', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>/</kbd>
        </div>
      </div>

      {/* Tag Filter Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '1.75rem'
      }}>
        {POPULAR_TAGS.map((tag) => {
          const isActive = selectedTag === tag.val;
          return (
            <button
              key={tag.label}
              onClick={() => setSelectedTag(isActive && tag.val !== '' ? '' : tag.val)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25))' : 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                color: isActive ? '#38bdf8' : '#94a3b8',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.825rem',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar Controls Bar */}
      <div className="glass-panel" style={{
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderRadius: '0.85rem',
        background: 'rgba(15, 23, 42, 0.5)'
      }}>
        {/* Left Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc' }}>
            {showSavedOnly ? 'Saved Jobs' : 'Live Postings'}
          </span>
          <span style={{
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            fontWeight: '800',
            fontSize: '0.8rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            {totalJobsCount} {totalJobsCount === 1 ? 'job' : 'jobs'}
          </span>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {/* Source Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={15} color="#94a3b8" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                fontSize: '0.825rem',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Sources</option>
              <option value="remoteok">RemoteOK</option>
              <option value="arbeitnow">Arbeitnow</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={15} color="#94a3b8" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
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

          {/* Remote Toggle Switch */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.825rem',
            color: '#cbd5e1',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              style={{ accentColor: '#38bdf8', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>Remote Only</span>
          </label>

          {/* View Mode Toggle (Grid vs List) */}
          <div style={{
            display: 'flex',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '0.15rem'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#38bdf8' : 'transparent',
                color: viewMode === 'grid' ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: '0.35rem',
                padding: '0.25rem 0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#38bdf8' : 'transparent',
                color: viewMode === 'list' ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: '0.35rem',
                padding: '0.25rem 0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
