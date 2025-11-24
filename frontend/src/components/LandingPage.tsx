import "./LandingPage.css";

interface LandingPageProps {
  onStartVerifying?: () => void;
}

/**
 * Landing Page Component
 * Minimalistic, professional design with all essential details
 */
function LandingPage({ onStartVerifying }: LandingPageProps) {
  const scrollToVerify = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Trigger verify tab
    if (window.location.hash !== "#verify") {
      window.location.hash = "verify";
    }
    // Call onStartVerifying if provided (to connect wallet)
    if (onStartVerifying) {
      onStartVerifying();
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Verify Product <span className="hero-accent">Authenticity</span> with Blockchain
          </h1>
          <p className="hero-subtitle">
            Instant, immutable verification powered by Polygon blockchain. 
            Scan QR codes to verify products in seconds.
          </p>
          <div className="hero-cta">
            <button onClick={scrollToVerify} className="btn btn-primary btn-hero">
              Start Verifying
            </button>
            <a 
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "about";
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn btn-secondary btn-hero"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Manufacturers Register</h3>
              <p>Products are registered on Polygon blockchain with unique batch IDs and serial numbers</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>QR Code Generation</h3>
              <p>Each product receives a unique QR code containing its verification data</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Scan & Verify</h3>
              <p>Consumers scan the QR code to instantly verify authenticity on-chain</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Blockchain Record</h3>
              <p>All verifications are permanently recorded - first scan = Authentic, subsequent = Warning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">$500B+</div>
            <div className="stat-label">Lost to Counterfeits Annually</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">&lt;$0.01</div>
            <div className="stat-label">Per Verification Cost</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">100%</div>
            <div className="stat-label">Blockchain Verified</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Apps to Download</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="cta-content">
          <h2>Ready to Verify Products?</h2>
          <p>Connect your wallet and start verifying product authenticity in seconds</p>
          <button onClick={scrollToVerify} className="btn btn-primary btn-large">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

