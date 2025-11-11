import { useState } from "react";
import "./FAQ.css";

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ Component
 * Displays frequently asked questions about ChainCheck
 */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is ChainCheck?",
      answer: "ChainCheck is a blockchain-based product authenticity verification system. It allows consumers to verify if a product is genuine by scanning a QR code, with all verifications recorded immutably on the Polygon blockchain."
    },
    {
      question: "How does ChainCheck work?",
      answer: "Manufacturers register products on the blockchain with unique serial numbers. Each product gets a QR code containing batch ID and serial number. When consumers scan the QR code, ChainCheck verifies the product on-chain. First scan = Authentic, Second scan = Potential Counterfeit."
    },
    {
      question: "Do I need to install an app?",
      answer: "No! ChainCheck works entirely in your web browser. Just visit chaincheck.io on your mobile device or desktop, connect your MetaMask wallet, and start scanning QR codes."
    },
    {
      question: "What wallet do I need?",
      answer: "You need a Web3 wallet like MetaMask. MetaMask is available as a browser extension for desktop and as a mobile app. Make sure your wallet is connected to the Polygon network."
    },
    {
      question: "Does it cost money to verify products?",
      answer: "ChainCheck itself is free to use. However, each blockchain verification requires a small gas fee (paid in MATIC) to the Polygon network. These fees are typically very low (less than $0.01)."
    },
    {
      question: "What happens if I scan a product twice?",
      answer: "The first scan confirms the product is authentic. If you scan the same product again, it will show as 'Possible Counterfeit' because authentic products should only be verified once. This helps detect if someone is trying to resell a verified product."
    },
    {
      question: "Is my data private?",
      answer: "Blockchain transactions are public by nature. Your wallet address and verification transactions are visible on the Polygon blockchain. However, we don't collect personal information like names or emails. See our Privacy Policy for more details."
    },
    {
      question: "Can I use ChainCheck without a wallet?",
      answer: "No, you need a Web3 wallet (like MetaMask) to interact with the blockchain. The wallet is required to sign transactions for product verification."
    },
    {
      question: "What network does ChainCheck use?",
      answer: "ChainCheck uses the Polygon network (Polygon Mainnet), which offers low transaction fees and fast confirmations. Make sure your wallet is connected to Polygon network (Chain ID: 137)."
    },
    {
      question: "How do manufacturers register products?",
      answer: "Manufacturers need to connect their wallet and use the Manufacturer Dashboard. They can register products with batch IDs, serial numbers, and product information. Each registration is recorded on the blockchain."
    },
    {
      question: "Can I see my verification history?",
      answer: "Yes! If you're connected with a wallet, you can view your verification history in the 'Verification History' tab. This shows all products you've verified."
    },
    {
      question: "What if a verification fails?",
      answer: "If a verification fails, it could mean: (1) The product isn't registered on the blockchain, (2) There's a network issue, (3) The QR code is invalid. Check your wallet connection and network, then try again."
    },
    {
      question: "Is ChainCheck open source?",
      answer: "Yes! ChainCheck is completely open source and available on GitHub. You can view the code, contribute, or deploy your own instance. See the footer for the GitHub link."
    },
    {
      question: "How accurate is ChainCheck?",
      answer: "ChainCheck provides accurate verification based on blockchain data. However, it relies on manufacturers properly registering products. Always use verification results as one factor in determining authenticity, along with other indicators."
    },
    {
      question: "Can I use ChainCheck for any product?",
      answer: "ChainCheck can be used for any product that has been registered by a manufacturer on the blockchain. If a product isn't registered, verification will fail. Manufacturers must first register their products."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-content">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-intro">
          Find answers to common questions about ChainCheck and how to use our product verification system.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <svg
                  className="faq-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <p>Still have questions?</p>
          <p>
            Check out our <a href="#privacy" onClick={(e) => { e.preventDefault(); window.location.hash = "privacy"; window.scrollTo({ top: 0, behavior: "smooth" }); }}>Privacy Policy</a> and <a href="#terms" onClick={(e) => { e.preventDefault(); window.location.hash = "terms"; window.scrollTo({ top: 0, behavior: "smooth" }); }}>Terms of Service</a>, or visit our{" "}
            <a href="https://github.com/CodeAndCoffeeGuy/Chaincheck" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;

