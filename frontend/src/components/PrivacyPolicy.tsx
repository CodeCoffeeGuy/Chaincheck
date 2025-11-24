import "./PrivacyPolicy.css";

/**
 * Privacy Policy Component
 * Displays the privacy policy for ChainCheck
 */
function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 15, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            ChainCheck is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-based product verification service at chaincheck.io.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <p>When you use ChainCheck, we may collect:</p>
          <ul>
            <li>Wallet addresses (public blockchain addresses)</li>
            <li>Product verification data (batch IDs, serial numbers)</li>
            <li>Transaction hashes and blockchain data</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>We may automatically collect:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>IP address (anonymized)</li>
            <li>Usage patterns and interactions with our service</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our verification service</li>
            <li>Process product verifications on the blockchain</li>
            <li>Improve our service and user experience</li>
            <li>Ensure security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Blockchain and Public Data</h2>
          <p>
            ChainCheck operates on the Polygon blockchain, which is a public, decentralized network. When you verify a product:
          </p>
          <ul>
            <li>Verification transactions are recorded on the public blockchain</li>
            <li>Transaction data, including wallet addresses, is publicly visible</li>
            <li>This data cannot be deleted or modified due to blockchain immutability</li>
            <li>We do not control or have the ability to remove blockchain data</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your information. However, please note:
          </p>
          <ul>
            <li>Blockchain data is stored on a decentralized network, not on our servers</li>
            <li>We do not store your private keys or sensitive wallet information</li>
            <li>All blockchain interactions are handled by your wallet (e.g., MetaMask)</li>
            <li>We use industry-standard security practices for our frontend application</li>
          </ul>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>We may use third-party services that have their own privacy policies:</p>
          <ul>
            <li><strong>MetaMask/Wallet Providers:</strong> Your wallet provider handles all private key management</li>
            <li><strong>Polygon Network:</strong> Blockchain network provider</li>
            <li><strong>Vercel:</strong> Hosting and deployment platform</li>
          </ul>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul>
            <li>Right to access your data</li>
            <li>Right to rectification</li>
            <li>Right to erasure (note: blockchain data cannot be deleted)</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
          <p>To exercise these rights, please contact us at the information provided below.</p>
        </section>

        <section>
          <h2>8. Cookies and Tracking</h2>
          <p>
            ChainCheck currently uses minimal tracking. We may use essential cookies for functionality. We do not use advertising cookies or third-party tracking without your consent.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <ul>
            <li>GitHub: <a href="https://github.com/CodeAndCoffeeGuy/Chaincheck" target="_blank" rel="noopener noreferrer">https://github.com/CodeAndCoffeeGuy/Chaincheck</a></li>
            <li>Website: <a href="https://chaincheck.io">https://chaincheck.io</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;

