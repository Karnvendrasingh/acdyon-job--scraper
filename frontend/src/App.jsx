import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobCard from './components/JobCard';
import JobModal from './components/JobModal';
import TelemetryModal from './components/TelemetryModal';
import JobAlertModal from './components/JobAlertModal';
import Toast from './components/Toast';
import { AlertCircle, Inbox, RefreshCw, Cpu, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [telemetryData, setTelemetryData] = useState({ stale: false, sources: {}, recent_runs: [] });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem('scrapling_saved_jobs');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  
  const [activeJobModal, setActiveJobModal] = useState(null);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const fetchData = async () => {
    try {
      const [jobsRes, telemetryRes] = await Promise.all([
        fetch('/jobs'),
        fetch('/ingest/status')
      ]);

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.data || []);
      }

      if (telemetryRes.ok) {
        const telemetryJson = await telemetryRes.json();
        setTelemetryData(telemetryJson);
      }
    } catch (err) {
      console.error("Error connecting to Job Scraper backend:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Page Visibility API listener: pause animations when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      document.body.classList.toggle('tab-hidden', document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Mouse Parallax tilt for background grid mesh
  useEffect(() => {
    const handleMouseMove = (e) => {
      const grid = document.querySelector('.grid-texture');
      if (grid) {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 12;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 12;
        grid.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // '/' Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scrapling_saved_jobs', JSON.stringify(savedJobIds));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [savedJobIds]);

  const toggleSaveJob = (jobId) => {
    setSavedJobIds((prev) => {
      if (prev.includes(jobId)) {
        triggerToast("Removed job from saved bookmarks");
        return prev.filter(id => id !== jobId);
      } else {
        triggerToast("Saved job to bookmarks");
        return [...prev, jobId];
      }
    });
  };

  const handleShareJob = (job) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(job.apply_url);
      triggerToast("Application link copied to clipboard!");
    }
  };

  const handleManualSync = () => {
    setIsRefreshing(true);
    triggerToast("Syncing pipeline & refreshing opportunities...");
    fetchData();
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (showSavedOnly && !savedJobIds.includes(job.id)) {
        return false;
      }
      if (selectedSource !== 'all' && job.source !== selectedSource) {
        return false;
      }
      if (remoteOnly && job.location && !job.location.toLowerCase().includes('remote') && job.location.trim() !== '') {
        return false;
      }
      if (selectedTag) {
        let tagStr = '';
        if (job.tags) {
          try {
            const parsed = typeof job.tags === 'string' ? JSON.parse(job.tags) : job.tags;
            tagStr = Array.isArray(parsed) ? parsed.join(' ').toLowerCase() : '';
          } catch(e) {}
        }
        const matchTitle = job.title.toLowerCase().includes(selectedTag.toLowerCase());
        if (!tagStr.includes(selectedTag.toLowerCase()) && !matchTitle) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = job.title.toLowerCase().includes(query);
        const companyMatch = job.company.toLowerCase().includes(query);
        const locationMatch = (job.location || '').toLowerCase().includes(query);
        let tagsMatch = false;
        if (job.tags) {
          tagsMatch = job.tags.toLowerCase().includes(query);
        }
        if (!titleMatch && !companyMatch && !locationMatch && !tagsMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      } else if (sortBy === 'source') {
        return a.source.localeCompare(b.source);
      }
      return 0;
    });
  }, [jobs, searchQuery, selectedTag, selectedSource, remoteOnly, sortBy, showSavedOnly, savedJobIds]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Floating Aurora Light Orbs Ambient Canvas */}
      <div className="ambient-canvas">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
        <div className="aurora-orb-3" />
        <div className="aurora-orb-4" />
      </div>
      <div className="grid-texture" />

      {/* Navbar Header */}
      <Navbar
        onRefresh={handleManualSync}
        isRefreshing={isRefreshing}
        savedCount={savedJobIds.length}
        showSavedOnly={showSavedOnly}
        setShowSavedOnly={setShowSavedOnly}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenAlerts={() => setIsAlertModalOpen(true)}
        telemetryData={telemetryData}
        totalJobsCount={jobs.length}
      />

      {/* Main Container */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          remoteOnly={remoteOnly}
          setRemoteOnly={setRemoteOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalJobsCount={filteredJobs.length}
          showSavedOnly={showSavedOnly}
        />

        {/* Live Opportunities List/Grid */}
        <section style={{ maxWidth: '1240px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
          
          {/* Degraded Pipeline Alert */}
          {telemetryData.stale && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#F43F5E',
                padding: '1rem 1.25rem',
                borderRadius: '0.85rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              <AlertCircle size={20} />
              <span>Notice: Data ingestion pipeline is degraded. Auto-failover router active.</span>
            </motion.div>
          )}

          {/* Skeleton Shimmer Loading State */}
          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
              gap: '1.35rem'
            }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-shimmer" style={{ height: viewMode === 'grid' ? '230px' : '78px' }} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            /* Empty State with Floating Motion */
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card"
              style={{
                padding: '4.5rem 2rem',
                textAlign: 'center',
                borderRadius: '1.25rem',
                maxWidth: '560px',
                margin: '2rem auto'
              }}
            >
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <Inbox size={34} />
              </motion.div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#F8FAFC', marginBottom: '0.5rem' }}>
                {showSavedOnly ? 'No Saved Jobs Yet' : 'No Matching Opportunities Found'}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                {showSavedOnly 
                  ? 'Bookmark job cards by clicking the star icon to save them for instant access.' 
                  : 'Try clearing your search terms or adjusting skill tag filters to explore available postings.'}
              </p>
              {(searchQuery || selectedTag || selectedSource !== 'all' || showSavedOnly) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('');
                    setSelectedSource('all');
                    setShowSavedOnly(false);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid #3B82F6',
                    color: '#3B82F6',
                    padding: '0.65rem 1.35rem',
                    borderRadius: '0.65rem',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Reset All Filters
                </motion.button>
              )}
            </motion.div>
          ) : (
            /* Animated Cards Container */
            <motion.div 
              layout
              style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
                gap: '1.35rem'
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    viewMode={viewMode}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={toggleSaveJob}
                    onSelectTag={(t) => setSelectedTag(t)}
                    onOpenModal={(j) => setActiveJobModal(j)}
                    onShareJob={handleShareJob}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </section>
      </main>

      {/* Modals & Toast Notifications */}
      <JobModal
        job={activeJobModal}
        onClose={() => setActiveJobModal(null)}
        isSaved={activeJobModal ? savedJobIds.includes(activeJobModal.id) : false}
        onToggleSave={toggleSaveJob}
        onShareJob={handleShareJob}
      />

      <TelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        telemetryData={telemetryData}
        onManualSync={handleManualSync}
        isRefreshing={isRefreshing}
      />

      <JobAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        defaultTag={selectedTag}
        onTriggerToast={triggerToast}
      />

      <Toast message={toastMessage} />

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(10, 14, 26, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#F8FAFC', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={18} color="#3B82F6" />
              <span>Job Scraper Engine</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#64748B' }}>
              Resilient Ingestion Engine • Continuous 30-min crawl loop with automatic failover circuit breaker
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>
            <span style={{ padding: '0.35rem 0.7rem', borderRadius: '0.45rem', background: 'rgba(255, 255, 255, 0.04)', color: '#94A3B8' }}>FastAPI</span>
            <span style={{ padding: '0.35rem 0.7rem', borderRadius: '0.45rem', background: 'rgba(255, 255, 255, 0.04)', color: '#94A3B8' }}>Scrapling</span>
            <span style={{ padding: '0.35rem 0.7rem', borderRadius: '0.45rem', background: 'rgba(255, 255, 255, 0.04)', color: '#94A3B8' }}>Schema.org JSON-LD</span>
            <span style={{ padding: '0.35rem 0.7rem', borderRadius: '0.45rem', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>React + Vite</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
