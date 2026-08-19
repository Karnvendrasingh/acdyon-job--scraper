import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobCard from './components/JobCard';
import JobModal from './components/JobModal';
import TelemetryModal from './components/TelemetryModal';
import Toast from './components/Toast';
import { AlertCircle, Inbox, RefreshCw, Cpu, Layers } from 'lucide-react';

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
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Jobs & Telemetry from FastAPI backend
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

  // Keyboard shortcut listener ('/' key for quick search focus)
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

  // Sync saved jobs to localStorage
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
      triggerToast("Job application link copied to clipboard!");
    }
  };

  const handleManualSync = () => {
    setIsRefreshing(true);
    triggerToast("Syncing latest job postings from pipeline...");
    fetchData();
  };

  // Filtered & Sorted Jobs computed list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Saved filter
      if (showSavedOnly && !savedJobIds.includes(job.id)) {
        return false;
      }

      // Source filter
      if (selectedSource !== 'all' && job.source !== selectedSource) {
        return false;
      }

      // Remote filter
      if (remoteOnly && job.location && !job.location.toLowerCase().includes('remote') && job.location.trim() !== '') {
        return false;
      }

      // Tag filter
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

      // Search Query filter
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
      
      {/* Background Orbs */}
      <div className="ambient-glow">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="glow-orb-3" />
      </div>

      {/* Navigation Header */}
      <Navbar
        onRefresh={handleManualSync}
        isRefreshing={isRefreshing}
        savedCount={savedJobIds.length}
        showSavedOnly={showSavedOnly}
        setShowSavedOnly={setShowSavedOnly}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        telemetryData={telemetryData}
        totalJobsCount={jobs.length}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        
        {/* Hero & Filter Section */}
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

        {/* Jobs Container Grid */}
        <section style={{ maxWidth: '1200px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
          
          {/* Stale Warning Banner if degraded */}
          {telemetryData.stale && (
            <div style={{
              background: 'rgba(251, 113, 133, 0.12)',
              border: '1px solid rgba(251, 113, 133, 0.3)',
              color: '#fb7185',
              padding: '1rem 1.25rem',
              borderRadius: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              <AlertCircle size={20} />
              <span>Notice: Data ingestion might be delayed. Automatic failover active.</span>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
              gap: '1.25rem'
            }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-pulse" style={{ height: viewMode === 'grid' ? '220px' : '75px' }} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            /* Empty State */
            <div className="glass-panel" style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: '1.25rem',
              maxWidth: '560px',
              margin: '2rem auto'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <Inbox size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
                {showSavedOnly ? 'No Saved Jobs Yet' : 'No Matching Opportunities Found'}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
                {showSavedOnly 
                  ? 'Bookmark job cards by clicking the star icon to save them for quick review.' 
                  : 'Try clearing your search query or adjusting your tag filters to see more results.'}
              </p>
              {(searchQuery || selectedTag || selectedSource !== 'all' || showSavedOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('');
                    setSelectedSource('all');
                    setShowSavedOnly(false);
                  }}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38bdf8',
                    color: '#38bdf8',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.6rem',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            /* Render Job Cards List or Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
              gap: '1.25rem'
            }}>
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
            </div>
          )}

        </section>
      </main>

      {/* Modals & Toasts */}
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

      <Toast message={toastMessage} />

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(7, 9, 14, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} color="#38bdf8" />
              <span>Job Scraper Pipeline</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Resilient Scraping Ingestion Engine • Continuous 30-min crawl loop with automatic failover
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>
            <span style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>FastAPI</span>
            <span style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>Scrapling</span>
            <span style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>APScheduler</span>
            <span style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>SQLModel</span>
            <span style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>React + Vite</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
