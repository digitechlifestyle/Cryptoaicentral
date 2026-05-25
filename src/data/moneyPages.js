export const moneyPageComparisons = [
  {
    slug: "best-crypto-wallets",
    title: "Best Crypto Wallets for Beginners",
    category: "Wallets",
    intro: "Compare wallet types by custody, security, beginner-friendliness and best use case. This page is designed for affiliate monetisation once approved wallet partners are added.",
    items: [
      { name: "Hardware wallet", bestFor: "Long-term storage", risk: "Low online exposure", cost: "Paid device", notes: "Best for larger balances and long-term holdings." },
      { name: "Mobile wallet", bestFor: "Everyday use", risk: "Device security matters", cost: "Usually free", notes: "Useful for small balances and simple transfers." },
      { name: "Browser wallet", bestFor: "DeFi and Web3 apps", risk: "Phishing and approvals", cost: "Usually free", notes: "Convenient but needs careful permission management." }
    ]
  },
  {
    slug: "best-crypto-exchanges",
    title: "Best Crypto Exchanges for Beginners",
    category: "Exchanges",
    intro: "Compare exchange types by fees, custody, supported assets, user experience and compliance. Affiliate links can be added after partner review.",
    items: [
      { name: "Centralized exchange", bestFor: "Bank transfers and beginners", risk: "Custody and platform risk", cost: "Trading and withdrawal fees", notes: "Simple onboarding but users should withdraw long-term holdings when appropriate." },
      { name: "Decentralized exchange", bestFor: "Wallet-based swaps", risk: "Smart contract and slippage risk", cost: "Gas and liquidity fees", notes: "More control but less beginner-friendly." },
      { name: "Broker app", bestFor: "Simple buying", risk: "Limited control/features", cost: "Spread or service fees", notes: "Easy for first purchases but compare fees carefully." }
    ]
  },
  {
    slug: "best-ai-crypto-tools-comparison",
    title: "Best AI Crypto Tools to Research and Monitor the Market",
    category: "AI Tools",
    intro: "Compare AI-supported research, portfolio and automation tools. The goal is to help readers use AI as support, not as guaranteed-profit software.",
    items: [
      { name: "AI research assistant", bestFor: "Summaries and education", risk: "Hallucinated output", cost: "Free or subscription", notes: "Useful when it cites sources and shows uncertainty." },
      { name: "AI portfolio monitor", bestFor: "Risk and allocation tracking", risk: "Data privacy", cost: "Subscription or freemium", notes: "Prefer read-only API keys and wallet-only viewing." },
      { name: "AI trading bot", bestFor: "Automation experiments", risk: "Losses and API key misuse", cost: "Subscription or performance fee", notes: "Use paper trading and strict limits first." }
    ]
  },
  {
    slug: "best-crypto-tax-tools",
    title: "Best Crypto Tax Tools and Record-Keeping Options",
    category: "Tax",
    intro: "Compare crypto tax tools, CSV exports and professional advice routes. This page can become a high-intent affiliate page for tax software partners.",
    items: [
      { name: "Crypto tax software", bestFor: "High transaction volume", risk: "Incorrect imports", cost: "Annual subscription", notes: "Useful for exchanges, wallets, DeFi and NFT records." },
      { name: "Spreadsheet records", bestFor: "Simple portfolios", risk: "Manual errors", cost: "Free", notes: "Works for low activity but becomes hard at scale." },
      { name: "Tax professional", bestFor: "Complex or high-value activity", risk: "Cost and crypto knowledge varies", cost: "Professional fee", notes: "Important for business, DeFi, token launches or large gains." }
    ]
  }
];

export function getMoneyPageBySlug(slug) {
  return moneyPageComparisons.find((page) => page.slug === slug);
}
