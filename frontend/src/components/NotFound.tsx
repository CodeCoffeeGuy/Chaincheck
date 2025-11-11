import "./NotFound.css";

/**
 * 404 Not Found Component
 * Displays when a page is not found
 */
function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" stroke="#FF6B35" strokeWidth="3" strokeDasharray="8 8" opacity="0.3"/>
            <path d="M40 40L80 80M80 40L40 80" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <a href="/" className="btn btn-primary" onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            Go to Home
          </a>
          <a href="#verify" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            Start Verifying
          </a>
        </div>
        <div className="not-found-links">
          <p>You might be looking for:</p>
          <ul>
            <li><a href="#verify" onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.scrollTo({ top: 0, behavior: "smooth" }); }}>Verify Product</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); window.location.hash = "about"; window.scrollTo({ top: 0, behavior: "smooth" }); }}>About</a></li>
            <li><a href="#faq" onClick={(e) => { e.preventDefault(); window.location.hash = "faq"; window.scrollTo({ top: 0, behavior: "smooth" }); }}>FAQ</a></li>
            <li><a href="#privacy" onClick={(e) => { e.preventDefault(); window.location.hash = "privacy"; window.scrollTo({ top: 0, behavior: "smooth" }); }}>Privacy Policy</a></li>
            <li><a href="#terms" onClick={(e) => { e.preventDefault(); window.location.hash = "terms"; window.scrollTo({ top: 0, behavior: "smooth" }); }}>Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

