interface CounsellingBannerProps {
  onOpenMentorship: () => void;
}

export function CounsellingBanner({ onOpenMentorship }: CounsellingBannerProps) {
  return (
    <div 
      className="counselling-banner-card card mb-5 border-0 shadow-lg text-white" 
      style={styles.bannerCard}
    >
      <div className="card-body p-4 p-md-5 position-relative overflow-hidden">
        {/* Subtle decorative background bubbles */}
        <div style={styles.bubble1} className="d-none d-md-block"></div>
        <div style={styles.bubble2} className="d-none d-md-block"></div>

        <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8 mb-4 mb-lg-0">
            <span 
              className="badge bg-white text-warning mb-3 px-3 py-2 rounded-pill fw-bold uppercase shadow-sm"
              style={{ letterSpacing: '1px', fontSize: '0.75rem', color: '#b45309 !important' }}
            >
              <i className="fas fa-certificate me-1"></i> Premium Add-On (Free for CAT 2025 Aspirants)
            </span>
            <h3 
              className="fw-bold mb-2" 
              style={{ fontFamily: "'Poppins', sans-serif', Georgia", fontSize: '1.75rem', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              Book 1-on-1 Profile Mentorship with Experts
            </h3>
            <p className="mb-0 text-white-50" style={{ fontSize: '0.95rem', opacity: 0.9 }}>
              Get an exclusive 15-minute complete profile audit, sectional strategy benchmarks, and customizable WAT-PI interview coaching directly with IIM alumni. We will sync all your score inputs!
            </p>
          </div>
          
          <div className="col-lg-4 text-lg-end">
            <button 
              type="button" 
              className="btn btn-light rounded-pill px-4 py-3 fw-bold text-dark border-0 shadow-md animate-pulse"
              onClick={onOpenMentorship}
              style={styles.button}
            >
              <i className="fab fa-whatsapp me-2 text-success" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}></i>
              Book Free Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bannerCard: {
    background: 'linear-gradient(135deg, #d97706 0%, #92400e 50%, #78350f 100%)',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 10px 30px -5px rgba(217, 119, 6, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    background: '#ffffff',
    color: '#78350f',
    fontSize: '1rem',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease'
  },
  bubble1: {
    position: 'absolute' as const,
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'rgba(251, 191, 36, 0.12)',
    top: '-30px',
    right: '10%',
    zIndex: 1
  },
  bubble2: {
    position: 'absolute' as const,
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'rgba(251, 191, 36, 0.08)',
    bottom: '-80px',
    right: '-40px',
    zIndex: 1
  }
};
