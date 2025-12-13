/**
 * Sample Data Population Script for Crypto AI Central
 *
 * This script populates your Base44 database with sample listings, blog posts, and rewards
 *
 * Usage:
 * 1. Make sure you have @base44/sdk installed
 * 2. Update the appId in base44Client.js if needed
 * 3. Run: node populate-sample-data.js
 */

import { createClient } from '@base44/sdk';

const base44 = createClient({
  appId: "68fe45804ca7930042918cc0",
  requiresAuth: false
});

// Sample listings across all categories
const sampleListings = [
  // AI Trading Bots
  {
    name: "3Commas",
    category: "AI Trading Bots",
    type: "Trading Bot",
    description: "Automated crypto trading platform with smart trading bots, portfolio management, and algorithmic trading strategies.",
    website: "https://3commas.io",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    sponsored: false,
    tier: "featured",
    pricing: "Free - $99/month",
    risk: "Medium",
    kyc_required: "Yes",
    tags: ["Trading", "Automation", "DeFi"]
  },
  {
    name: "Cryptohopper",
    category: "AI Trading Bots",
    type: "Trading Bot",
    description: "Cloud-based crypto trading bot with AI-powered strategies, backtesting, and social trading features.",
    website: "https://cryptohopper.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "$19 - $99/month",
    risk: "Medium",
    kyc_required: "No"
  },

  // Crypto Wallets
  {
    name: "MetaMask",
    category: "Crypto Wallets",
    type: "Browser Wallet",
    description: "Leading browser extension and mobile wallet for Ethereum and EVM-compatible chains. Secure, user-friendly, and widely supported.",
    website: "https://metamask.io",
    chain: "Ethereum",
    status: "approved",
    featured: true,
    sponsored: true,
    tier: "sponsored",
    pricing: "Free",
    risk: "Low",
    kyc_required: "No",
    tags: ["Wallet", "Browser", "Mobile"]
  },
  {
    name: "Ledger",
    category: "Crypto Wallets",
    type: "Hardware Wallet",
    description: "Premium hardware wallet providing cold storage security for your crypto assets. Supports 5000+ coins and tokens.",
    website: "https://ledger.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "$79 - $279",
    risk: "Low",
    kyc_required: "No"
  },
  {
    name: "Trust Wallet",
    category: "Crypto Wallets",
    type: "Mobile Wallet",
    description: "Multi-chain mobile wallet with built-in DApp browser, staking, and NFT support. Official wallet of Binance.",
    website: "https://trustwallet.com",
    chain: "Multi-Chain",
    status: "approved",
    tier: "basic",
    pricing: "Free",
    risk: "Low",
    kyc_required: "No"
  },

  // DeFi Protocols
  {
    name: "Uniswap",
    category: "DeFi Protocols",
    type: "DEX",
    description: "Leading decentralized exchange protocol on Ethereum. Swap tokens, provide liquidity, and earn fees.",
    website: "https://uniswap.org",
    chain: "Ethereum",
    status: "approved",
    featured: true,
    sponsored: true,
    tier: "sponsored",
    pricing: "Free (+ gas fees)",
    risk: "Medium",
    kyc_required: "No",
    tags: ["DEX", "DeFi", "AMM"]
  },
  {
    name: "Aave",
    category: "DeFi Protocols",
    type: "Lending",
    description: "Decentralized lending and borrowing protocol. Earn interest on deposits and borrow against your crypto collateral.",
    website: "https://aave.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Free (+ gas fees)",
    risk: "Medium",
    kyc_required: "No"
  },
  {
    name: "Curve Finance",
    category: "DeFi Protocols",
    type: "DEX",
    description: "Stablecoin-focused DEX with low slippage and high efficiency for stablecoin swaps.",
    website: "https://curve.fi",
    chain: "Ethereum",
    status: "approved",
    tier: "basic",
    pricing: "Free (+ gas fees)",
    risk: "Medium",
    kyc_required: "No"
  },

  // Exchanges
  {
    name: "Binance",
    category: "Exchanges",
    type: "CEX",
    description: "World's largest cryptocurrency exchange by trading volume. Spot, futures, margin trading, and more.",
    website: "https://binance.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "0.1% trading fee",
    risk: "Low",
    kyc_required: "Yes"
  },
  {
    name: "Coinbase",
    category: "Exchanges",
    type: "CEX",
    description: "User-friendly US-based cryptocurrency exchange. Buy, sell, and store crypto with insurance protection.",
    website: "https://coinbase.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Variable fees",
    risk: "Low",
    kyc_required: "Yes"
  },

  // Portfolio Trackers
  {
    name: "CoinGecko",
    category: "Portfolio Trackers",
    type: "Analytics",
    description: "Comprehensive crypto market data, portfolio tracking, and price alerts. Track 10,000+ cryptocurrencies.",
    website: "https://coingecko.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Free - $49/month",
    risk: "Low",
    kyc_required: "No"
  },
  {
    name: "DeBank",
    category: "Portfolio Trackers",
    type: "DeFi Tracker",
    description: "Real-time DeFi portfolio tracker. Monitor all your DeFi positions across multiple chains in one place.",
    website: "https://debank.com",
    chain: "Multi-Chain",
    status: "approved",
    tier: "basic",
    pricing: "Free",
    risk: "Low",
    kyc_required: "No"
  },

  // On-Chain Analytics
  {
    name: "Dune Analytics",
    category: "On-Chain Analytics",
    type: "Analytics",
    description: "Community-powered crypto analytics platform. Query blockchain data and create custom dashboards.",
    website: "https://dune.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Free - $399/month",
    risk: "Low",
    kyc_required: "No"
  },
  {
    name: "Nansen",
    category: "On-Chain Analytics",
    type: "Analytics",
    description: "Professional-grade blockchain analytics with wallet labels, smart money tracking, and market insights.",
    website: "https://nansen.ai",
    chain: "Multi-Chain",
    status: "approved",
    tier: "basic",
    pricing: "$150 - $1,500/month",
    risk: "Low",
    kyc_required: "Yes"
  },

  // Staking Platforms
  {
    name: "Lido",
    category: "Staking Platforms",
    type: "Liquid Staking",
    description: "Leading liquid staking protocol. Stake ETH and receive stETH while maintaining liquidity.",
    website: "https://lido.fi",
    chain: "Ethereum",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "10% fee on staking rewards",
    risk: "Medium",
    kyc_required: "No"
  },

  // Smart Contract Platforms
  {
    name: "Ethereum",
    category: "Smart Contract Platforms",
    type: "Layer 1",
    description: "Leading smart contract platform and ecosystem for decentralized applications and DeFi protocols.",
    website: "https://ethereum.org",
    chain: "Ethereum",
    status: "approved",
    featured: true,
    sponsored: true,
    tier: "sponsored",
    pricing: "Variable gas fees",
    risk: "Low",
    kyc_required: "No"
  },
  {
    name: "Solana",
    category: "Smart Contract Platforms",
    type: "Layer 1",
    description: "High-performance blockchain with fast transactions and low fees. Growing DeFi and NFT ecosystem.",
    website: "https://solana.com",
    chain: "Solana",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "~$0.00025 per transaction",
    risk: "Medium",
    kyc_required: "No"
  },

  // Layer 2 Scaling Solutions
  {
    name: "Arbitrum",
    category: "Layer 2 Scaling Solutions",
    type: "Optimistic Rollup",
    description: "Ethereum Layer 2 scaling solution with high throughput and low fees. Full EVM compatibility.",
    website: "https://arbitrum.io",
    chain: "Ethereum",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Low gas fees",
    risk: "Medium",
    kyc_required: "No"
  },
  {
    name: "Optimism",
    category: "Layer 2 Scaling Solutions",
    type: "Optimistic Rollup",
    description: "Ethereum Layer 2 rollup designed to scale Ethereum while maintaining security and decentralization.",
    website: "https://optimism.io",
    chain: "Ethereum",
    status: "approved",
    tier: "basic",
    pricing: "Low gas fees",
    risk: "Medium",
    kyc_required: "No"
  },

  // Oracles
  {
    name: "Chainlink",
    category: "Oracles",
    type: "Oracle Network",
    description: "Decentralized oracle network providing real-world data to smart contracts. Industry-leading solution.",
    website: "https://chain.link",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Pay per use",
    risk: "Low",
    kyc_required: "No"
  },

  // Cross-Chain Bridges
  {
    name: "Wormhole",
    category: "Cross-Chain Bridges",
    type: "Bridge",
    description: "Multi-chain bridge connecting major blockchains. Transfer assets and data across 20+ chains.",
    website: "https://wormhole.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Bridge fees vary",
    risk: "Medium",
    kyc_required: "No"
  },

  // Crypto Cards
  {
    name: "Crypto.com Card",
    category: "Crypto Cards",
    type: "Debit Card",
    description: "Metal Visa card with up to 5% crypto cashback. Spend crypto anywhere Visa is accepted.",
    website: "https://crypto.com/cards",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Free - $399 stake",
    risk: "Low",
    kyc_required: "Yes"
  },

  // Smart Contract Auditors
  {
    name: "CertiK",
    category: "Smart Contract Auditors",
    type: "Security",
    description: "Leading blockchain security firm providing smart contract audits and security assessments.",
    website: "https://certik.com",
    chain: "Multi-Chain",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "Custom pricing",
    risk: "Low",
    kyc_required: "Yes"
  },

  // AI Content Tools
  {
    name: "Jasper AI",
    category: "AI Content Tools",
    type: "Content Generation",
    description: "AI-powered content creation tool for marketing copy, blog posts, and social media content.",
    website: "https://jasper.ai",
    chain: "-",
    status: "approved",
    featured: true,
    tier: "featured",
    pricing: "$39 - $125/month",
    risk: "Low",
    kyc_required: "No"
  }
];

// Sample blog posts
const sampleBlogPosts = [
  {
    title: "Getting Started with DeFi: A Beginner's Guide",
    slug: "getting-started-with-defi",
    excerpt: "Learn the fundamentals of Decentralized Finance and how to safely navigate the DeFi ecosystem.",
    content: `
# Getting Started with DeFi: A Beginner's Guide

Decentralized Finance (DeFi) has revolutionized the way we interact with financial services. Built on blockchain technology, DeFi offers an open, permissionless alternative to traditional finance.

## What is DeFi?

DeFi refers to financial services built on blockchain networks, primarily Ethereum. These services operate without traditional intermediaries like banks, brokers, or exchanges.

## Key Concepts

### 1. Smart Contracts
Smart contracts are self-executing programs that run on the blockchain. They automatically execute transactions when predefined conditions are met.

### 2. Decentralized Exchanges (DEXs)
Trade cryptocurrencies directly from your wallet without a centralized intermediary. Popular DEXs include Uniswap, SushiSwap, and PancakeSwap.

### 3. Lending and Borrowing
Earn interest by lending your crypto or borrow against your holdings. Platforms like Aave and Compound make this possible.

## Getting Started

1. **Get a Wallet**: Start with MetaMask or Trust Wallet
2. **Buy Some Crypto**: Purchase ETH or other tokens
3. **Research Protocols**: Understand risks before investing
4. **Start Small**: Test with small amounts first

## Safety Tips

- Never share your seed phrase
- Use hardware wallets for large amounts
- Research protocols thoroughly
- Be aware of impermanent loss
- Watch out for scams and rug pulls

DeFi offers incredible opportunities, but it comes with risks. Always do your own research (DYOR) and never invest more than you can afford to lose.
    `,
    category: "Guides",
    published: true,
    author: "Crypto AI Central Team",
    reading_time: 8,
    featured_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop"
  },
  {
    title: "Top 10 AI Trading Bots in 2024",
    slug: "top-ai-trading-bots-2024",
    excerpt: "Discover the best AI-powered trading bots for cryptocurrency trading in 2024.",
    content: `
# Top 10 AI Trading Bots in 2024

Automated trading bots are becoming essential tools for crypto traders. Here are the top performers in 2024.

## 1. 3Commas
Leading platform with smart trading, portfolio management, and DCA bots. Excellent for beginners and pros alike.

## 2. Cryptohopper
Cloud-based solution with AI strategies, backtesting, and social trading features.

## 3. TradeSanta
User-friendly interface with long/short strategies and technical indicator support.

## Key Features to Look For
- Multiple exchange support
- Backtesting capabilities
- Risk management tools
- 24/7 automation
- Community support

Remember, no bot guarantees profits. Always start with small amounts and test thoroughly before scaling up.
    `,
    category: "Reviews",
    published: true,
    author: "Crypto AI Central Team",
    reading_time: 6,
    featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop"
  },
  {
    title: "Security Best Practices for Crypto Investors",
    slug: "crypto-security-best-practices",
    excerpt: "Essential security measures every cryptocurrency investor should implement.",
    content: `
# Security Best Practices for Crypto Investors

Protecting your crypto assets is paramount. Follow these essential security practices.

## Hardware Wallets
Use hardware wallets (Ledger, Trezor) for long-term holdings. They provide the highest level of security by keeping your private keys offline.

## Two-Factor Authentication (2FA)
Enable 2FA on all exchange accounts and services. Use authenticator apps, not SMS.

## Seed Phrase Security
- Never share your seed phrase
- Store it offline in multiple secure locations
- Never store it digitally or in the cloud
- Consider metal backup solutions

## Common Scams to Avoid
1. Phishing websites and emails
2. Fake support representatives
3. Too-good-to-be-true investment schemes
4. Fake airdrops requiring deposits
5. Impersonators on social media

## Safe Practices
- Verify website URLs carefully
- Don't click suspicious links
- Research projects thoroughly
- Use bookmark trusted sites
- Keep software updated

Your security is your responsibility in crypto. Stay vigilant!
    `,
    category: "Security",
    published: true,
    author: "Crypto AI Central Team",
    reading_time: 7,
    featured_image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&h=630&fit=crop"
  },
  {
    title: "Understanding Ethereum Layer 2 Solutions",
    slug: "ethereum-layer-2-solutions",
    excerpt: "Learn how Layer 2 solutions are scaling Ethereum and reducing gas fees.",
    content: `
# Understanding Ethereum Layer 2 Solutions

Ethereum's Layer 2 scaling solutions are transforming the network's capabilities.

## What are Layer 2s?

Layer 2 solutions process transactions off the main Ethereum chain (Layer 1) while inheriting its security guarantees.

## Popular L2 Solutions

### Arbitrum
Optimistic rollup with full EVM compatibility and low fees.

### Optimism
Another optimistic rollup focused on simplicity and compatibility.

### zkSync
Zero-knowledge rollup offering enhanced privacy and scaling.

### Polygon
Sidechain solution with its own consensus mechanism.

## Benefits
- Lower transaction costs
- Faster confirmation times
- Same security as Ethereum L1
- Growing ecosystem

## How to Use L2s
1. Bridge assets from L1 to L2
2. Use L2-native dApps
3. Enjoy lower fees
4. Bridge back when needed

Layer 2 is the future of Ethereum scaling!
    `,
    category: "Technology",
    published: true,
    author: "Crypto AI Central Team",
    reading_time: 5,
    featured_image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&h=630&fit=crop"
  },
  {
    title: "NFT Investing: Trends and Strategies for 2024",
    slug: "nft-investing-strategies-2024",
    excerpt: "Navigate the NFT market with these proven strategies and insights.",
    content: `
# NFT Investing: Trends and Strategies for 2024

The NFT market has evolved significantly. Here's how to approach it in 2024.

## Current Market Trends
- Utility-focused NFTs gaining traction
- Gaming and metaverse integration
- Real-world asset tokenization
- AI-generated art projects

## Investment Strategies

### 1. Research Communities
Strong communities drive NFT value. Look for engaged, authentic communities.

### 2. Utility Over Hype
Focus on NFTs with real utility: gaming items, memberships, access rights.

### 3. Blue Chip Collections
Established collections like BAYC, CryptoPunks maintain value better.

### 4. Emerging Artists
Support talented artists early in their journey.

## Risk Management
- Only invest what you can afford to lose
- Diversify across different projects
- Understand marketplace fees
- Be aware of wash trading
- Check project roadmaps

## Tools and Platforms
- OpenSea, Blur for trading
- Rarity.tools for rarity checking
- NFTBank for portfolio tracking
- Twitter for community insights

The NFT space rewards research and patience!
    `,
    category: "NFTs",
    published: true,
    author: "Crypto AI Central Team",
    reading_time: 6,
    featured_image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=1200&h=630&fit=crop"
  }
];

// Sample rewards
const sampleRewards = [
  {
    reward_name: "$10 Amazon Gift Card",
    reward_description: "Redeem your points for a $10 Amazon gift card delivered via email",
    reward_value: "$10",
    points_required: 1000,
    active: true
  },
  {
    reward_name: "$25 Amazon Gift Card",
    reward_description: "Redeem your points for a $25 Amazon gift card delivered via email",
    reward_value: "$25",
    points_required: 2500,
    active: true
  },
  {
    reward_name: "$50 Crypto Voucher",
    reward_description: "Get $50 worth of cryptocurrency voucher redeemable on major exchanges",
    reward_value: "$50",
    points_required: 5000,
    active: true
  },
  {
    reward_name: "Premium Membership (1 Month)",
    reward_description: "One month of ad-free browsing and exclusive content access",
    reward_value: "Premium",
    points_required: 750,
    active: true
  },
  {
    reward_name: "Featured Listing Boost",
    reward_description: "Feature your project listing for 7 days on the homepage",
    reward_value: "7 days",
    points_required: 3000,
    active: true
  },
  {
    reward_name: "$100 Amazon Gift Card",
    reward_description: "Redeem your points for a $100 Amazon gift card delivered via email",
    reward_value: "$100",
    points_required: 10000,
    active: true
  }
];

// Main population function
async function populateData() {
  console.log('🚀 Starting data population...\n');

  // Populate Listings
  console.log('📝 Creating Directory Listings...');
  let listingsCreated = 0;
  for (const listing of sampleListings) {
    try {
      await base44.entities.DirectoryListing.create(listing);
      console.log(`  ✅ Created: ${listing.name} (${listing.category})`);
      listingsCreated++;
    } catch (error) {
      console.error(`  ❌ Failed to create ${listing.name}:`, error.message);
    }
  }
  console.log(`\n✨ Created ${listingsCreated}/${sampleListings.length} listings\n`);

  // Populate Blog Posts
  console.log('📰 Creating Blog Posts...');
  let postsCreated = 0;
  for (const post of sampleBlogPosts) {
    try {
      await base44.entities.BlogPost.create(post);
      console.log(`  ✅ Created: ${post.title}`);
      postsCreated++;
    } catch (error) {
      console.error(`  ❌ Failed to create ${post.title}:`, error.message);
    }
  }
  console.log(`\n✨ Created ${postsCreated}/${sampleBlogPosts.length} blog posts\n`);

  // Populate Rewards
  console.log('🎁 Creating Rewards...');
  let rewardsCreated = 0;
  for (const reward of sampleRewards) {
    try {
      await base44.entities.PointsReward.create(reward);
      console.log(`  ✅ Created: ${reward.reward_name} (${reward.points_required} points)`);
      rewardsCreated++;
    } catch (error) {
      console.error(`  ❌ Failed to create ${reward.reward_name}:`, error.message);
    }
  }
  console.log(`\n✨ Created ${rewardsCreated}/${sampleRewards.length} rewards\n`);

  // Summary
  console.log('🎉 Data Population Complete!\n');
  console.log('Summary:');
  console.log(`  - ${listingsCreated} Directory Listings`);
  console.log(`  - ${postsCreated} Blog Posts`);
  console.log(`  - ${rewardsCreated} Rewards`);
  console.log('\n✅ Your site should now display content!');
  console.log('🌐 Visit your site to see the populated data\n');
}

// Run the population
populateData().catch(error => {
  console.error('❌ Population failed:', error);
  process.exit(1);
});
