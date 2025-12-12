import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2 } from "lucide-react";

export default function ListingExporter() {
  const [isExporting, setIsExporting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  const exportListings = async () => {
    setIsExporting(true);
    try {
      let listings = await base44.entities.DirectoryListing.list("-created_date", 10000);
      
      if (filterCategory !== "all") {
        listings = listings.filter(l => l.category === filterCategory);
      }

      const csv = [
        "Name,Category,Type,Description,Website,Chain,Chain Type,Pricing,Risk,KYC Required,Tags,Status,Created Date",
        ...listings.map(l => [
          `"${l.name}"`,
          `"${l.category}"`,
          `"${l.type}"`,
          `"${l.description}"`,
          `"${l.website}"`,
          `"${l.chain}"`,
          `"${l.chain_type}"`,
          `"${l.pricing}"`,
          `"${l.risk}"`,
          `"${l.kyc_required}"`,
          `"${(l.tags || []).join(', ')}"`,
          `"${l.status}"`,
          `"${new Date(l.created_date).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `listings_${filterCategory}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      alert(`✅ Exported ${listings.length} listings!`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to export listings");
    }
    setIsExporting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Export Listings to CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Filter by Category</label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="AI Content Tools">AI Content Tools</SelectItem>
              <SelectItem value="AI Trading Bots">AI Trading Bots</SelectItem>
              <SelectItem value="Crypto Wallets">Crypto Wallets</SelectItem>
              <SelectItem value="DeFi Protocols">DeFi Protocols</SelectItem>
              <SelectItem value="Exchanges">Exchanges</SelectItem>
              <SelectItem value="Portfolio Trackers">Portfolio Trackers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={exportListings}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}