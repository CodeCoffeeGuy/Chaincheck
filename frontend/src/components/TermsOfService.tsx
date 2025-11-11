import "./TermsOfService.css";

/**
 * Terms of Service Component
 * Displays the terms of service for ChainCheck
 */
function TermsOfService() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: November 11, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using ChainCheck ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            ChainCheck is a blockchain-based product authenticity verification system that allows users to verify products using QR codes and the Polygon blockchain network. The Service is provided "as is" without warranties of any kind.
          </p>
        </section>

        <section>
          <h2>3. Eligibility</h2>
          <p>You must:</p>
          <ul>
            <li>Be at least 18 years old</li>
            <li>Have the legal capacity to enter into these terms</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Have a compatible cryptocurrency wallet (e.g., MetaMask)</li>
          </ul>
        </section>

        <section>
          <h2>4. Blockchain Transactions</h2>
          <h3>4.1 Network Fees</h3>
          <p>
            All blockchain transactions require network fees (gas fees) paid in MATIC on the Polygon network. These fees are paid directly to the network, not to ChainCheck. We do not control or set these fees.
          </p>

          <h3>4.2 Transaction Irreversibility</h3>
          <p>
            Blockchain transactions are irreversible. Once a verification is recorded on the blockchain, it cannot be undone. Please verify all information before submitting transactions.
          </p>

          <h3>4.3 Wallet Responsibility</h3>
          <p>
            You are solely responsible for the security of your cryptocurrency wallet and private keys. ChainCheck does not have access to your wallet or private keys and cannot recover lost funds or access.
          </p>
        </section>

        <section>
          <h2>5. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to manipulate or falsify verification data</li>
            <li>Not use the Service to verify counterfeit or illegal products</li>
            <li>Maintain the security of your wallet and credentials</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Not interfere with or disrupt the Service</li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            ChainCheck is open source software licensed under the MIT License. You may use, modify, and distribute the code in accordance with the license terms. The ChainCheck name and logo are trademarks of the project.
          </p>
        </section>

        <section>
          <h2>7. Disclaimers</h2>
          <h3>7.1 No Warranty</h3>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>

          <h3>7.2 Verification Accuracy</h3>
          <p>
            While ChainCheck provides a verification system, we do not guarantee the accuracy of product information or the authenticity of products. Verification results are based on blockchain data and should be used as one factor in determining product authenticity.
          </p>

          <h3>7.3 Blockchain Network</h3>
          <p>
            We do not control the Polygon blockchain network and are not responsible for network outages, congestion, or failures. Blockchain transactions may be delayed or fail due to network conditions.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHAINCHECK AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
          </p>
        </section>

        <section>
          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless ChainCheck, its contributors, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2>10. Modifications to Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We are not liable to you or any third party for any modification, suspension, or discontinuation.
          </p>
        </section>

        <section>
          <h2>11. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will notify you of any material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us:
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

export default TermsOfService;

