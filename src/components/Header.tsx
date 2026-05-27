/**
 * Header Component
 * 
 * 💡 LEARN CORRELATION (PHP DEVELOPERS):
 * In PHP, you put common headers in `header.php` and load them using `include('header.php')`.
 * In React, we create a Header component that we can import and drop anywhere using `<Header />`!
 */
export function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <a 
          className="navbar-brand fw-bold text-uppercase d-flex align-items-center gap-2" 
          href="#home"
          style={{ letterSpacing: '1px', fontFamily: "'Poppins', sans-serif" }}
        >
          {/* Custom brand SVG target and cap logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="38" height="38" className="d-inline-block align-top">
            <defs>
              <linearGradient id="capGradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="4" strokeDasharray="6,4" />
            <path d="M 50,22 L 82,36 L 50,50 L 18,36 Z" fill="url(#capGradHeader)" />
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
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-start" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#hero">Courses</a></li>
            <li className="nav-item"><a className="nav-link" href="#predictor">Previous Year Papers</a></li>
            <li className="nav-item"><a className="nav-link" href="#consultation">Mock Test</a></li>
            <li className="nav-item"><a className="nav-link" href="#footer">More</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
