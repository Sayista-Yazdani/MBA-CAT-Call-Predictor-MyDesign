import { useEffect, useState } from 'react';

export function Splash() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 450);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 750);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div id="splash-screen" className={fade ? 'hide-splash' : ''}>
      <div className="splash-content">
        <div
          className="splash-logo-text mb-3 d-flex flex-column align-items-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80" className="mb-3">
            <defs>
              <linearGradient id="capGradSplash" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="4" strokeDasharray="6,4" />
            <path d="M 50,22 L 82,36 L 50,50 L 18,36 Z" fill="url(#capGradSplash)" />
            <path d="M 34,45 L 34,54 C 34,60 66,60 66,54 L 66,45" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <path d="M 50,36 L 68,46 L 70,58" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <circle cx="70" cy="60" r="3" fill="#fbbf24" />
            <path d="M 30,75 L 45,62 L 60,68 L 75,48" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 70,48 L 75,48 L 75,53" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            <circle cx="75" cy="48" r="3" fill="#ffffff" />
          </svg>
          <div className="lh-sm text-center">
            <span style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              CAT <span className="text-warning">CALL</span>
            </span>
            <div className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '4px' }}>
              PREDICTOR
            </div>
          </div>
        </div>
        <p className="brandpara">Preparing your MBA journey...</p>
        <div className="loader"></div>
      </div>
    </div>
  );
}
