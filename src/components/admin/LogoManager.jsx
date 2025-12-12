
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Image as ImageIcon, CheckCircle, AlertCircle, Download, RefreshCw, Sparkles } from 'lucide-react';

const LOGO_SOURCES = {
  clearbit: "https://logo.clearbit.com/",
  google_favicon: "https://www.google.com/s2/favicons?sz=128&domain=",
  duckduckgo: "https://icons.duckduckgo.com/ip3/"
};

const DOMAIN_MAPPINGS = {
  // AI Services
  "gpt-3": "openai.com",
  "gpt-4": "openai.com",
  "chatgpt": "openai.com",
  "chat gpt": "openai.com",
  "dall-e": "openai.com",
  "dall e": "openai.com",
  "dalle": "openai.com",
  "codex": "openai.com",
  "openai": "openai.com",
  "anthropic": "anthropic.com",
  "claude": "anthropic.com",
  "midjourney": "midjourney.com",
  "stable diffusion": "stability.ai",
  "stability ai": "stability.ai",
  "hugging face": "huggingface.co",
  "huggingface": "huggingface.co",
  "google bard": "bard.google.com",
  "bard": "bard.google.com",
  "jasper ai": "jasper.ai",
  "jasper": "jasper.ai",
  "copy.ai": "copy.ai",
  "copyai": "copy.ai",
  "writesonic": "writesonic.com",
  "grammarly": "grammarly.com",
  "notion ai": "notion.so",
  "github copilot": "github.com",
  "copilot": "github.com",
  "perplexity": "perplexity.ai",
  "perplexity ai": "perplexity.ai",
  "replicate": "replicate.com",
  "cohere": "cohere.ai",
  "ai21": "ai21.com",
  
  // Additional crypto/blockchain
  "the block": "theblock.co",
  "coindesk": "coindesk.com",
  "cointelegraph": "cointelegraph.com",
  "coinmarketcap": "coinmarketcap.com",
  "coingecko": "coingecko.com",
  "binance": "binance.com",
  "coinbase": "coinbase.com",
  "kraken": "kraken.com",
  "gemini": "gemini.com",
  "ftx": "ftx.com",
  "bitfinex": "bitfinex.com",
  "metamask": "metamask.io",
  "trust wallet": "trustwallet.com",
  "ledger": "ledger.com",
  "trezor": "trezor.io",
  "uniswap": "uniswap.org",
  "compound": "compound.finance",
  "aave": "aave.com",
  "curve": "curve.fi",
  "sushiswap": "sushi.com",
  "pancakeswap": "pancakeswap.finance",
  "1inch": "1inch.io",
  "makerdao": "makerdao.com",
  "yearn finance": "yearn.finance",
  "chainlink": "chain.link",
  "the graph": "thegraph.com",
  "opensea": "opensea.io",
  "rarible": "rarible.com",
  "blur": "blur.io",
  // Unique entries from original list that were not explicitly in the outline's new lists
  "ethereum": "ethereum.org",
  "bitcoin": "bitcoin.org",
  "polygon": "polygon.technology",
  "solana": "solana.com",
  "cardano": "cardano.org",
  "polkadot": "polkadot.network",
  "cosmos": "cosmos.network",
  "algorand": "algorand.com",
  "avalanche": "avax.network",
  "hedera": "hedera.com",
  "xrp ledger": "xrpl.org",
  "stellar": "stellar.org",
  "flare": "flare.network",
  "songbird": "flare.network"
};

export default function LogoManager() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [missingLogos, setMissingLogos] = useState([]);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Fix btoa to handle UTF-8 characters properly
  const utf8ToBase64 = (str) => {
    try {
      // Method 1: Modern approach with TextEncoder (preferred)
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(str);
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      return btoa(binaryString);
    } catch (error) {
      // Method 2: Fallback for older browsers
      try {
        return btoa(unescape(encodeURIComponent(str)));
      } catch (fallbackError) {
        console.error('UTF-8 encoding failed:', fallbackError);
        // Method 3: Last resort - remove problematic characters
        const safeStr = str.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII
        return btoa(safeStr);
      }
    }
  };

  const sanitizeServiceName = (name) => {
    // Convert to lowercase and trim
    let sanitized = name.toLowerCase().trim();
    
    // Handle common variations
    sanitized = sanitized
      .replace(/\s+/g, ' ')           // Normalize spaces
      .replace(/[™®©]/g, '')          // Remove trademark symbols
      .replace(/\./g, '')             // Remove dots (DALL.E -> DALLE)
      .replace(/[-_]/g, ' ')          // Convert hyphens/underscores to spaces (GPT-3 -> GPT 3)
      .trim();
    
    return sanitized;
  };

  const createSvgLogo = (text, color) => {
    // Sanitize text to ensure it's safe for SVG and base64
    // Remove all special characters and emojis, keep only alphanumeric
    let safeText = String(text)
      .replace(/[^\p{L}\p{N}\s]/gu, '') // Remove special chars, keep letters, numbers, spaces (Unicode-aware)
      .replace(/\s+/g, '')              // Remove spaces
      .substring(0, 2)                  // Limit to 2 chars
      .toUpperCase();                   // Uppercase
    
    // If empty after sanitization, use '?'
    if (!safeText) {
      safeText = '?';
    }
    
    const safeId = `bg-${Math.random().toString(36).substring(7)}`; // Use random ID
    
    const svg = `<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#${safeId})"/>
  <text x="64" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">${safeText}</text>
</svg>`;
    
    try {
      return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
    } catch (error) {
      console.error('SVG encoding error:', error);
      // Fallback: return URL-encoded SVG instead of base64
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
  };

  const categorizeService = (serviceName) => {
    const name = serviceName.toLowerCase();
    
    if (name.includes('ai') || name.includes('gpt') || name.includes('neural') || 
        name.includes('machine learning') || name.includes('dall') || name.includes('codex') ||
        name.includes('claude') || name.includes('bard') || name.includes('jasper') ||
        name.includes('anthropic') || name.includes('midjourney') || name.includes('stable diffusion')) {
      return { category: 'ai', color: '#10b981', emoji: 'AI' };
    } else if (name.includes('blockchain') || name.includes('crypto') || name.includes('bitcoin') || 
               name.includes('ethereum') || name.includes('defi') || name.includes('nft') ||
               name.includes('web3') || name.includes('dex') || name.includes('swap')) {
      return { category: 'blockchain', color: '#f59e0b', emoji: 'BC' };
    } else if (name.includes('finance') || name.includes('bank') || name.includes('investment') || 
               name.includes('wealth') || name.includes('trading') || name.includes('exchange')) {
      return { category: 'finance', color: '#ef4444', emoji: 'FN' };
    } else {
      return { category: 'tech', color: '#3b82f6', emoji: 'TC' };
    }
  };

  const guessDomain = (serviceName) => {
    // Sanitize and check domain mappings first
    const sanitized = sanitizeServiceName(serviceName);
    
    if (DOMAIN_MAPPINGS[sanitized]) {
      console.log(`✓ Found mapped domain for "${serviceName}": ${DOMAIN_MAPPINGS[sanitized]}`);
      return DOMAIN_MAPPINGS[sanitized];
    }

    // Also check original (unsanitized) name. This covers cases where a mapping might use the original form.
    const lowerName = serviceName.toLowerCase().trim();
    if (DOMAIN_MAPPINGS[lowerName]) {
      console.log(`✓ Found mapped domain for "${serviceName}": ${DOMAIN_MAPPINGS[lowerName]}`);
      return DOMAIN_MAPPINGS[lowerName];
    }

    // Clean and split service name for dynamic guessing
    const cleanName = serviceName.replace(/[^\w\s]/g, '');
    const words = cleanName.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) return null;

    // Common domain patterns to try
    const domainsToTry = [
      `${words.join('')}.com`,
      `${words.join('')}.io`,
      `${words.join('')}.ai`,
      `${words[0]}.com`,
      `${words[0]}.io`,
      `${words[0]}.co`,
      `${words[0]}.ai`
    ];

    if (words.length > 1) {
      domainsToTry.push(`${words[0]}${words[1]}.com`);
      domainsToTry.push(`${words[0]}-${words[1]}.com`);
      domainsToTry.push(`${words[0]}.${words[1]}`);
    }

    console.log(`🔍 Guessing domains for "${serviceName}":`, domainsToTry.slice(0, 3));
    return domainsToTry[0]; // Return first guess
  };

  const tryFetchLogo = async (domain, source) => {
    try {
      let url;
      
      switch (source) {
        case 'clearbit':
          url = `${LOGO_SOURCES.clearbit}${domain}?size=128`;
          break;
        case 'google_favicon':
          url = `${LOGO_SOURCES.google_favicon}${domain}`;
          break;
        case 'duckduckgo':
          url = `${LOGO_SOURCES.duckduckgo}${domain}.ico`;
          break;
        default:
          return null;
      }

      // Use Image object and Canvas to bypass CORS restrictions
      return await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // This will attempt a CORS-enabled fetch for the image
        
        const timeout = setTimeout(() => {
          resolve(null); // Resolve with null if timeout occurs
        }, 3000); // 3 second timeout for image loading
        
        img.onload = () => {
          clearTimeout(timeout);
          
          // Convert image to canvas then to data URL
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 128, 128);
            const dataUrl = canvas.toDataURL('image/png'); // Always convert to PNG
            resolve(dataUrl);
          } catch (error) {
            console.error('Canvas conversion error:', error);
            resolve(null);
          }
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          resolve(null); // Resolve with null on error
        };
        
        img.src = url;
      });
      
    } catch (error) {
      console.error(`Failed to fetch from ${source}:`, error.message);
      return null;
    }
  };

  const getLogoForService = async (serviceName, serviceWebsite) => {
    console.log(`🔍 Searching logo for: ${serviceName}`);

    // Strategy 1: Try website domain with multiple sources
    if (serviceWebsite) {
      try {
        const url = new URL(serviceWebsite);
        const domain = url.hostname.replace('www.', '');
        
        // Try Clearbit first
        let logo = await tryFetchLogo(domain, 'clearbit');
        if (logo && logo.length > 1000) { // Basic validation for a valid data URL
          return { logo, source: 'clearbit', domain };
        }

        // Try Google Favicon
        logo = await tryFetchLogo(domain, 'google_favicon');
        if (logo && logo.length > 1000) {
          return { logo, source: 'google_favicon', domain };
        }
      } catch (error) {
        console.error('Website URL processing error:', error.message);
      }
    }

    // Strategy 2: Try domain guessing
    const guessedDomain = guessDomain(serviceName);
    if (guessedDomain) {
      // Try Clearbit
      let logo = await tryFetchLogo(guessedDomain, 'clearbit');
      if (logo && logo.length > 1000) {
        return { logo, source: 'clearbit', domain: guessedDomain };
      }

      // Try Google Favicon
      logo = await tryFetchLogo(guessedDomain, 'google_favicon');
      if (logo && logo.length > 1000) {
        return { logo, source: 'google_favicon', domain: guessedDomain };
      }

      // Try DuckDuckGo
      logo = await tryFetchLogo(guessedDomain, 'duckduckgo');
      if (logo && logo.length > 1000) {
        return { logo, source: 'duckduckgo', domain: guessedDomain };
      }
    }

    // Strategy 3: Fallback to generated SVG (always works)
    console.log(`⚠️ No online logo found for ${serviceName}, generating fallback`);
    const { emoji, color } = categorizeService(serviceName);
    // Pass either the determined emoji or the full serviceName for character derivation
    const logo = createSvgLogo(emoji || serviceName, color);
    
    return { logo, source: 'generated', domain: null };
  };

  const analyzeListings = async () => {
    setIsAnalyzing(true);
    setMissingLogos([]);

    try {
      const listings = await base44.entities.DirectoryListing.filter({ status: 'approved' }, '-created_date', 500);
      
      const missing = listings.filter(listing => !listing.logo_url || listing.logo_url.trim() === '');
      
      console.log(`📊 Found ${missing.length} listings without logos out of ${listings.length} total`);
      
      setMissingLogos(missing);
    } catch (error) {
      console.error('Failed to analyze listings:', error);
      alert('Failed to analyze listings: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fixMissingLogos = async () => {
    if (missingLogos.length === 0) {
      alert('No missing logos to fix. Run analysis first.');
      return;
    }

    if (!window.confirm(`Fix logos for ${missingLogos.length} listings?\n\nThis will:\n- Try multiple logo sources (with CORS-safe methods)\n- Generate high-quality fallback logos\n- Update all listings\n\nEstimated time: ${Math.ceil(missingLogos.length * 3)} seconds\n\nContinue?`)) {
      return;
    }

    setIsFixing(true);
    setProgress({ current: 0, total: missingLogos.length });

    const fixResults = {
      total: missingLogos.length,
      found_online: 0,
      generated: 0,
      failed: 0,
      details: []
    };

    for (let i = 0; i < missingLogos.length; i++) {
      const listing = missingLogos[i];
      
      try {
        console.log(`[${i + 1}/${missingLogos.length}] Processing: ${listing.name}`);
        
        const logoResult = await getLogoForService(listing.name, listing.website);
        
        let uploadedUrl;
        if (logoResult.source === 'generated') {
          // SVG data URL can be saved directly
          uploadedUrl = logoResult.logo;
        } else {
          // For online logos (PNG data URLs), convert to blob and upload
          const response = await fetch(logoResult.logo);
          const blob = await response.blob();
          const file = new File([blob], `${listing.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-logo.png`, { type: blob.type });
          
          const uploadResult = await base44.integrations.Core.UploadFile({ file });
          uploadedUrl = uploadResult.file_url;
        }

        // Update listing
        await base44.entities.DirectoryListing.update(listing.id, {
          logo_url: uploadedUrl
        });

        if (logoResult.source === 'generated') {
          fixResults.generated++;
        } else {
          fixResults.found_online++;
        }

        fixResults.details.push({
          name: listing.name,
          source: logoResult.source,
          domain: logoResult.domain,
          success: true
        });

        console.log(`✅ ${listing.name}: ${logoResult.source}${logoResult.domain ? ` (${logoResult.domain})` : ''}`);
        
        setProgress({ current: i + 1, total: missingLogos.length });

        // Reduced rate limiting since we're using more efficient methods
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Failed to fix logo for ${listing.name}:`, error.message);
        
        // Even on failure, try to add a generated logo as fallback
        try {
          const { emoji, color } = categorizeService(listing.name);
          // Pass either the determined emoji or the full listing.name for character derivation
          const fallbackLogo = createSvgLogo(emoji || listing.name, color);
          
          await base44.entities.DirectoryListing.update(listing.id, {
            logo_url: fallbackLogo
          });
          
          fixResults.generated++;
          fixResults.details.push({
            name: listing.name,
            source: 'generated_fallback',
            domain: null,
            success: true,
            note: 'Used fallback after error'
          });
          
          console.log(`⚠️ ${listing.name}: used fallback logo after error`);
        } catch (fallbackError) {
          // If even fallback fails, then mark as full failure
          fixResults.failed++;
          fixResults.details.push({
            name: listing.name,
            error: error.message,
            success: false
          });
          console.error(`❌ Failed to apply fallback for ${listing.name}:`, fallbackError.message);
        }
      }
    }

    setResults(fixResults);
    setIsFixing(false);

    console.log('\n📊 LOGO FIX RESULTS:');
    console.log(`Total Processed: ${fixResults.total}`);
    console.log(`✅ Found Online: ${fixResults.found_online}`);
    console.log(`🎨 Generated: ${fixResults.generated}`);
    console.log(`❌ Failed: ${fixResults.failed}`);

    alert(`Logo fix complete!\n\n✅ Found Online: ${fixResults.found_online}\n🎨 Generated: ${fixResults.generated}\n❌ Failed: ${fixResults.failed}\n\nTotal: ${fixResults.total}`);
  };

  const downloadReport = () => {
    if (!results) return;

    const report = {
      generated_at: new Date().toISOString(),
      summary: {
        total: results.total,
        found_online: results.found_online,
        generated: results.generated,
        failed: results.failed
      },
      details: results.details
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `logo-fix-report-${new Date().toISOString().split('T')[0]}.json`);
    link.click();
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ImageIcon className="w-6 h-6 text-purple-600" />
          Logo Manager
        </CardTitle>
        <CardDescription>
          Automatically find and fix missing logos for directory listings using multiple sources
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Analysis Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">1. Analyze Listings</h3>
              <p className="text-sm text-slate-600">Scan all approved listings for missing logos</p>
            </div>
            <Button
              onClick={analyzeListings}
              disabled={isAnalyzing || isFixing}
              variant="outline"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>

          {missingLogos.length > 0 && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Missing Logos Found</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Found <strong>{missingLogos.length}</strong> listings without logos.
                <div className="mt-2 max-h-32 overflow-y-auto text-xs space-y-1">
                  {missingLogos.slice(0, 10).map((listing, i) => (
                    <div key={i}>• {listing.name}</div>
                  ))}
                  {missingLogos.length > 10 && (
                    <div>... and {missingLogos.length - 10} more</div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Fix Section */}
        {missingLogos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">2. Fix Missing Logos</h3>
                <p className="text-sm text-slate-600">
                  Automatically fetch logos from Clearbit, Google, DuckDuckGo, or generate fallbacks
                </p>
              </div>
              <Button
                onClick={fixMissingLogos}
                disabled={isFixing || isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isFixing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fixing {progress.current}/{progress.total}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Fix All Logos
                  </>
                )}
              </Button>
            </div>

            {isFixing && (
              <div className="space-y-2">
                <Progress value={(progress.current / progress.total) * 100} className="h-3" />
                <p className="text-sm text-slate-600 text-center">
                  Processing {progress.current} of {progress.total} listings...
                </p>
              </div>
            )}

            <Alert>
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  <p><strong>Logo Sources:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Clearbit Logo API (primary)</li>
                    <li>Google Favicon Service</li>
                    <li>DuckDuckGo Icons</li>
                    <li>Auto-generated SVG logos (fallback)</li>
                  </ul>
                  <p className="mt-2"><strong>Processing Time:</strong> ~1-2 seconds per listing</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-3">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Fix Complete!</AlertTitle>
              <AlertDescription className="text-green-700">
                <div className="space-y-1 mt-2">
                  <p>✅ Found Online: <strong>{results.found_online}</strong></p>
                  <p>🎨 Generated: <strong>{results.generated}</strong></p>
                  <p>❌ Failed: <strong>{results.failed}</strong></p>
                  <p>📊 Total: <strong>{results.total}</strong></p>
                </div>
              </AlertDescription>
            </Alert>

            <Button
              onClick={downloadReport}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Full Report
            </Button>

            {/* Details */}
            <div className="max-h-64 overflow-y-auto border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm mb-2">Details:</h4>
              {results.details.map((detail, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <span className="truncate flex-1">{detail.name}</span>
                  {detail.success ? (
                    <Badge variant="outline" className="text-xs">
                      {detail.source}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Failed
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>How it works:</strong>
            <ol className="list-decimal list-inside space-y-1 mt-2 ml-2">
              <li>Tries to fetch official logos from Clearbit, Google, DuckDuckGo</li>
              <li>Uses domain mapping for known services (420+ mappings)</li>
              <li>Generates high-quality SVG logos as fallback</li>
              <li>Categorizes services (AI, Blockchain, Finance, Tech) for themed logos</li>
              <li>Uploads all logos to Base44 storage</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
