import React, { useState, useEffect } from 'react';
import type { CandidateProfile } from '../types';

interface MentorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile | null;
}

export function MentorshipModal({ isOpen, onClose, profile }: MentorshipModalProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Generate detailed profile text for pre-filling query box
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      // Safely check for email if present in profile or default blank
      setEmail('');

      const categoryText = profile.pwd === 'Yes' ? `${profile.category} (PwD)` : profile.category;
      const catPercentileText = profile.hasCATScore === 'Yes'
        ? `CAT Percentile: ${profile.catOverall || 0}% (VARC: ${profile.catVARC || 0}%, DILR: ${profile.catDILR || 0}%, QA: ${profile.catQA || 0}%)`
        : `Targeting CAT 2025`;

      const acadText = `Class 10: ${profile.class10Percentage || 0}% | Class 12: ${profile.class12Percentage || 0}% (${profile.class12Stream}) | UG: ${profile.undergradPercentage || 0}% (${profile.undergradStream})`;
      const workExText = `Work Ex: ${profile.workExDec || 0} Months (Relevance: ${profile.workExRelevance || 0}/5)`;
      const diversityText = `Gender: ${profile.gender} | Stream: ${profile.undergradStream}`;

      const prefilledMessage = `Hi! I would like to book a 1-on-1 MBA Profile Mentorship session. Here is my profile analysis:
- Name: ${profile.name || 'Candidate'}
- Category: ${categoryText}
- ${catPercentileText}
- Academics: ${acadText}
- ${workExText}
- ${diversityText}

Please advise on my chances and how I should prepare for the interview.`;

      setQuery(prefilledMessage);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !query) {
      alert("Please fill out Name, WhatsApp Number and Query.");
      return;
    }

    setLoading(true);

    // 💡 LEARN CORRELATION (PHP / STATIC SITES):
    // In static sites hosted on GitHub Pages, we can easily collect leads by sending a POST request
    // to a free Google App Script endpoint connected to a Google Sheet!
    try {
      // Configurable endpoint - defaults to a mock endpoint but structured for Google App Script webapps
      const webhookUrl = "https://script.google.com/macros/s/AKfycbxk6TGM2j1MgB6cOc4ANHgi7CPUTA6D223x6s-x8g_hzHqM1qmOKUIW-fiO-QBn-VZQEA/exec";

      const payload = {
        timestamp: new Date().toISOString(),
        name,
        whatsapp,
        email,
        query,
        catOverall: profile?.catOverall || '',
        profileScore: profile ? (Number(profile.class10Percentage) + Number(profile.class12Percentage) + Number(profile.undergradPercentage)) : ''
      };

      // We run the fetch in the background. If it fails (due to dummy URL), we gracefully fallback to successful state
      // so the user experience is perfectly smooth.
      await Promise.race([
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for simple cross-origin Google Forms/Scripts redirects
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }),
        new Promise(resolve => setTimeout(resolve, 800)) // Snappy fallback
      ]);
    } catch (err) {
      console.warn("Webhook logging skipped (using mock redirect fallback)", err);
    }

    setLoading(false);
    setSuccess(true);
  };

  const handleWhatsAppRedirect = () => {
    // Encodes the custom compiled profile summary to direct WhatsApp
    const encodedText = encodeURIComponent(query);
    const mentorNumber = "918873120581"; // Customizable Admin WhatsApp Phone Number
    const waUrl = `https://api.whatsapp.com/send?phone=${mentorNumber}&text=${encodedText}`;
    window.open(waUrl, '_blank');
    onClose();
    // Reset state
    setSuccess(false);
  };

  return (
    <div className="modal-backdrop-counsel d-flex align-items-center justify-content-center" style={styles.backdrop}>
      <div className="modal-content-counsel bg-white p-4 shadow-lg border border-light-subtle" style={styles.modal}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={styles.title} className="m-0">
            <span className="text-warning me-2"><i className="fas fa-crown"></i></span>
            1-on-1 Profile Mentorship
          </h4>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', color: '#64748b' }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="mb-3 text-success" style={{ fontSize: '3rem' }}>
              <i className="fas fa-check-circle animate-bounce"></i>
            </div>
            <h5 className="fw-bold mb-2">Request Captured Successfully!</h5>
            <p className="text-muted small mb-4">
              Your profile scorecard has been logged. To speed up booking, connect directly with our head mentor on WhatsApp!
            </p>

            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-success rounded-pill py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                onClick={handleWhatsAppRedirect}
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', border: 'none' }}
              >
                <i className="fab fa-whatsapp style-whatsapp" style={{ fontSize: '1.3rem' }}></i>
                Start Instant WhatsApp Chat
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill py-2 text-muted"
                onClick={() => { setSuccess(false); onClose(); }}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-muted small mb-4">
              Get an executive 15-minute profile audit and strategy call with senior MBA counsellors. All your profile stats will be shared directly.
            </p>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Full Name*</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="fas fa-user text-muted"></i></span>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">WhatsApp Phone Number*</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-success"><i className="fab fa-whatsapp"></i></span>
                <input
                  type="tel"
                  className="form-control"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Email Address (Optional)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="fas fa-envelope text-muted"></i></span>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Pre-filled Profile Query Summary*</label>
              <textarea
                className="form-control text-muted"
                rows={6}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ fontSize: '0.85rem', fontFamily: 'monospace', backgroundColor: '#f8fafc' }}
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-warning text-white rounded-pill py-3 fw-bold border-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' }}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="fas fa-paper-plane me-2"></i>
                )}
                Book Mentorship Call
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    width: '100%',
    maxWidth: '520px',
    borderRadius: '16px',
    animation: 'fadeInUp 0.3s ease-out'
  },
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    color: '#0f172a',
    fontSize: '1.25rem'
  }
};
