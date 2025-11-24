import "./About.css";

/**
 * About Component
 * Displays information about ChainCheck - what it is and why it exists
 */
function About() {
  return (
    <div className="about-page">
      <div className="about-content">
        <h1>About ChainCheck</h1>
        
        <section className="about-hero">
          <p className="about-intro">
            ChainCheck is a blockchain-based product authenticity verification system that empowers consumers to verify product authenticity instantly using QR codes and the Polygon blockchain.
          </p>
        </section>

        <section>
          <h2>Our Mission</h2>
          <p>
            Counterfeit products cost the global economy over <strong>$500 billion annually</strong>. Consumers have no reliable way to verify product authenticity, and brands lose revenue to fake goods. Traditional verification methods are easily compromised and lack transparency.
          </p>
          <p>
            ChainCheck was created to solve this problem by providing a transparent, immutable, and decentralized verification system that cannot be tampered with or falsified.
          </p>
        </section>

        <section>
          <h2>How It Works</h2>
          <div className="about-steps">
            <div className="about-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Manufacturers Register Products</h3>
                <p>Manufacturers register their products on the Polygon blockchain with unique batch IDs and serial numbers.</p>
              </div>
            </div>
            <div className="about-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Products Get QR Codes</h3>
                <p>Each product receives a unique QR code containing its batch ID and serial number.</p>
              </div>
            </div>
            <div className="about-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Consumers Verify Instantly</h3>
                <p>Consumers scan the QR code using any web browser to verify authenticity on-chain in real-time.</p>
              </div>
            </div>
            <div className="about-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Blockchain Records Everything</h3>
                <p>All verifications are permanently recorded on the blockchain - first scan = Authentic, second scan = Possible Counterfeit.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>Why Blockchain?</h2>
          <div className="about-features">
            <div className="feature-item">
              <h3>Immutable Records</h3>
              <p>Verification data cannot be altered or deleted, ensuring trust and transparency.</p>
            </div>
            <div className="feature-item">
              <h3>Decentralized</h3>
              <p>No single point of failure. Distributed across Polygon network, making it resilient and trustworthy.</p>
            </div>
            <div className="feature-item">
              <h3>Low Cost</h3>
              <p>Minimal transaction fees (typically less than $0.01), making it accessible for everyone.</p>
            </div>
            <div className="feature-item">
              <h3>Transparent</h3>
              <p>All verification records are publicly verifiable on the blockchain, allowing anyone to audit.</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Key Features</h2>
          <ul className="about-features-list">
            <li><strong>No App Required:</strong> Works entirely in your web browser - no downloads or installations needed</li>
            <li><strong>Mobile-First:</strong> Optimized for mobile devices, perfect for scanning QR codes on products</li>
            <li><strong>Real-Time Verification:</strong> Instant results with blockchain confirmation</li>
            <li><strong>Open Source:</strong> Transparent and auditable codebase available on GitHub</li>
            <li><strong>Free to Use:</strong> ChainCheck is free - you only pay minimal blockchain gas fees</li>
            <li><strong>Privacy-Focused:</strong> No personal information required - just your wallet address</li>
          </ul>
        </section>

        <section>
          <h2>Our Values</h2>
          <div className="about-values">
            <div className="value-item">
              <h3>Transparency</h3>
              <p>Complete transparency. Our code is open source, and all verifications are publicly verifiable.</p>
            </div>
            <div className="value-item">
              <h3>Accessibility</h3>
              <p>Making product verification accessible to everyone, regardless of technical expertise.</p>
            </div>
            <div className="value-item">
              <h3>Trust</h3>
              <p>Leveraging blockchain technology to create an unbreakable chain of trust between manufacturers and consumers.</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>Continuously improving our platform to provide the best possible verification experience.</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Technology</h2>
          <p>
            ChainCheck is built on modern web technologies and blockchain infrastructure:
          </p>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Smart Contracts</h3>
              <ul>
                <li>Solidity 0.8.20</li>
                <li>Hardhat Development Framework</li>
                <li>Polygon Network</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React 18 with TypeScript</li>
                <li>Vite Build Tool</li>
                <li>Ethers.js for Blockchain</li>
                <li>HTML5 QR Code Scanner</li>
              </ul>
            </div>
            <div className="tech-category">
              <h3>Infrastructure</h3>
              <ul>
                <li>Vercel Hosting</li>
                <li>Polygon Mainnet</li>
                <li>IPFS (for metadata storage)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>Get Involved</h2>
          <p>
            ChainCheck is an open-source project, and we welcome contributions from the community. Whether you're a developer, designer, or just passionate about fighting counterfeits, there's a place for you.
          </p>
          <div className="about-cta">
            <a 
              href="https://github.com/CodeAndCoffeeGuy/Chaincheck" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View on GitHub
            </a>
            <a 
              href="#verify"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "";
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn btn-secondary"
            >
              Start Verifying Products
            </a>
          </div>
        </section>

        <section className="about-footer">
          <p>
            <strong>ChainCheck</strong> - Building trust, one verification at a time.
          </p>
          <p className="about-tagline">
            Powered by blockchain technology. Built for consumers. Designed for trust.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;

