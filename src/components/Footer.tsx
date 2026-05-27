interface FooterProps {
  onOpenConsultation: () => void;
}

/**
 * Footer Component
 * 
 * 💡 LEARN CORRELATION (PHP DEVELOPERS):
 * Standard global footer files in PHP (`footer.php`) are translated into React components!
 * We can pass interactions (like opening the consultation slide-up drawer) 
 * via component properties called "Props". It works just like passing values 
 * into a PHP helper function!
 */
export function Footer({ onOpenConsultation }: FooterProps) {
  return (
    <footer id="footer">
      <div className="container mt-5 text-center">
        {/* Floating Consultation Toggle Trigger */}
        <button id="consultToggleBtn" className="consult-toggle-btn" onClick={onOpenConsultation}>
          <img src="assets/images/customer-service.gif" alt="Consult GIF" />
          <span>Free Consultation</span>
        </button>

        {/* Logo */}
        <div className="footer-logo mb-3 d-flex justify-content-center">
          <div 
            className="footer-logo-text fw-bold text-uppercase d-flex align-items-center gap-2"
            style={{ letterSpacing: '1px', fontFamily: "'Poppins', sans-serif" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="38" height="38" className="d-inline-block align-top">
              <defs>
                <linearGradient id="capGradFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="4" strokeDasharray="6,4" />
              <path d="M 50,22 L 82,36 L 50,50 L 18,36 Z" fill="url(#capGradFooter)" />
              <path d="M 34,45 L 34,54 C 34,60 66,60 66,54 L 66,45" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <path d="M 50,36 L 68,46 L 70,58" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <circle cx="70" cy="60" r="3" fill="#fbbf24" />
              <path d="M 30,75 L 45,62 L 60,68 L 75,48" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 70,48 L 75,48 L 75,53" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
              <circle cx="75" cy="48" r="3" fill="#ffffff" />
            </svg>
            <span className="d-flex flex-column lh-1 align-items-start">
              <span style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                CAT <span className="text-warning">CALL</span>
              </span>
              <span className="text-secondary" style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '2px' }}>
                PREDICTOR
              </span>
            </span>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-secondary small">
          © 2026 <strong>Sayista Yazdani</strong>. All Rights Reserved.
        </p>

        {/* Social Links */}
        <div className="social-links mt-3">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
