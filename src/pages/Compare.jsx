import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DirectoryListing } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, X, CheckCircle, XCircle, Minus, 
  ExternalLink, Shield, DollarSign, Zap 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ComparePage() {
  const [listings, setListings] = useState([]);
  const [selectedListings, setSelectedListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadListings();
    
    // Check URL params for comparison IDs
    const urlParams = new URLSearchParams(window.location.search);
    const compareIds = urlParams.get('ids');
    if (compareIds) {
      const ids = compareIds.split(',');
      loadComparisonFromIds(ids);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadListings = async () => {
    try {
      const data = await DirectoryListing.filter({ status: 'approved' }, "-created_date", 500);
      setListings(data);
    } catch (error) {
      console.error("Failed to load listings:", error);
    }
  };

  const loadComparisonFromIds = async (ids) => {
    try {
      const loadedListings = await Promise.all(
        ids.map(id => DirectoryListing.filter({ id }).then(r => r[0]))
      );
      setSelectedListings(loadedListings.filter(Boolean));
    } catch (error) {
      console.error("Failed to load comparison:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = listings.filter(listing =>
        listing.name.toLowerCase().includes(query.toLowerCase()) ||
        listing.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addToComparison = (listing) => {
    if (selectedListings.length >= 4) {
      toast({ title: "Maximum 4 items can be compared", variant: "destructive" });
      return;
    }
    if (selectedListings.find(l => l.id === listing.id)) {
      toast({ title: "Already added to comparison" });
      return;
    }
    setSelectedListings([...selectedListings, listing]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeFromComparison = (listingId) => {
    setSelectedListings(selectedListings.filter(l => l.id !== listingId));
  };

  const saveComparison = async () => {
    if (!user) {
      toast({ title: "Please login to save comparisons", variant: "destructive" });
      return;
    }

    try {
      await base44.entities.Comparison.create({
        title: `${selectedListings.map(l => l.name).join(' vs ')}`,
        listing_ids: selectedListings.map(l => l.id),
        user_email: user.email,
        public: true
      });
      toast({ title: "Comparison saved!" });
    } catch (error) {
      console.error("Failed to save comparison:", error);
      toast({ title: "Failed to save comparison", variant: "destructive" });
    }
  };

  const shareComparison = () => {
    const ids = selectedListings.map(l => l.id).join(',');
    const url = `${window.location.origin}${window.location.pathname}?ids=${ids}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Comparison link copied to clipboard!" });
  };

  const comparisonFeatures = [
    { key: "category", label: "Category", icon: Shield },
    { key: "type", label: "Type", icon: Zap },
    { key: "chain", label: "Blockchain", icon: Shield },
    { key: "pricing", label: "Pricing", icon: DollarSign },
    { key: "kyc_required", label: "KYC Required", icon: Shield },
    { key: "risk", label: "Risk Level", icon: Shield },
    { key: "audit_completed", label: "Audited", icon: CheckCircle },
    { key: "kyc_verified", label: "KYC Verified", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Compare Projects
          </h1>
          <p className="text-xl text-slate-600">
            Side-by-side comparison of features, pricing, and specifications
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search projects to compare..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-auto z-10">
                  {searchResults.map(listing => (
                    <button
                      key={listing.id}
                      onClick={() => addToComparison(listing)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3"
                    >
                      {listing.logo_url && (
                        <img src={listing.logo_url} alt={listing.name} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <div className="font-semibold">{listing.name}</div>
                        <div className="text-sm text-slate-600">{listing.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedListings.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {selectedListings.map(listing => (
                  <Badge key={listing.id} variant="secondary" className="px-3 py-2">
                    {listing.name}
                    <button
                      onClick={() => removeFromComparison(listing.id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedListings.length >= 2 ? (
          <>
            <div className="mb-4 flex gap-2">
              <Button onClick={saveComparison} disabled={!user}>
                Save Comparison
              </Button>
              <Button onClick={shareComparison} variant="outline">
                Share Comparison
              </Button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedListings.length}, 1fr)` }}>
                  {/* Header Row */}
                  <div className="bg-white rounded-lg p-4 font-semibold">Features</div>
                  {selectedListings.map(listing => (
                    <Card key={listing.id}>
                      <CardContent className="pt-6 text-center">
                        {listing.logo_url && (
                          <img 
                            src={listing.logo_url} 
                            alt={listing.name}
                            className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                          />
                        )}
                        <h3 className="font-bold text-lg mb-2">{listing.name}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                          {listing.description}
                        </p>
                        <a
                          href={listing.affiliate_link || listing.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center justify-center gap-1"
                        >
                          Visit Site
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Feature Rows */}
                  {comparisonFeatures.map((feature) => (
                    <React.Fragment key={feature.key}>
                      <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-2">
                        <feature.icon className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-sm">{feature.label}</span>
                      </div>
                      {selectedListings.map(listing => (
                        <Card key={`${listing.id}-${feature.key}`}>
                          <CardContent className="pt-6 text-center">
                            {typeof listing[feature.key] === 'boolean' ? (
                              listing[feature.key] ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                              )
                            ) : listing[feature.key] ? (
                              <span className="text-sm">{listing[feature.key]}</span>
                            ) : (
                              <Minus className="w-6 h-6 text-slate-300 mx-auto" />
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Tags Row */}
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center">
                    <span className="font-medium text-sm">Tags</span>
                  </div>
                  {selectedListings.map(listing => (
                    <Card key={`${listing.id}-tags`}>
                      <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {listing.tags?.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Plus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Comparing</h3>
              <p className="text-slate-600 mb-6">
                Search and add at least 2 projects to start comparing
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}