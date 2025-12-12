import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function BulkListingImport() {
  const [csvData, setCsvData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleImport = async () => {
    if (!csvData.trim()) {
      alert("Please paste CSV data");
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      // Parse CSV
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const listings = [];
      let successCount = 0;
      let failCount = 0;
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const listing = {};
        
        headers.forEach((header, index) => {
          listing[header] = values[index];
        });

        try {
          await base44.entities.DirectoryListing.create({
            ...listing,
            status: 'approved'
          });
          successCount++;
        } catch (error) {
          failCount++;
          errors.push(`Line ${i + 1}: ${error.message}`);
        }
      }

      setResult({
        success: successCount,
        failed: failCount,
        errors: errors.slice(0, 10) // Show first 10 errors
      });

    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import. Check CSV format.");
    }

    setIsImporting(false);
  };

  const exampleCSV = `name,category,type,description,website,chain,chain_type,pricing,risk,kyc_required
Uniswap,Exchanges,Decentralized Exchange,Leading DEX on Ethereum,https://uniswap.org,Ethereum,L1,Free/Protocol fees,Medium,No
Aave,DeFi Protocols,Lending,DeFi lending protocol,https://aave.com,Ethereum,L1,Protocol fees,Medium,No`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-green-600" />
          Bulk Import Listings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>CSV Format:</strong> Include headers in first row. Required fields: name, category, type, description, website, chain, chain_type, pricing, risk, kyc_required
          </AlertDescription>
        </Alert>

        <div>
          <label className="text-sm font-medium mb-2 block">Example CSV Format:</label>
          <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
            {exampleCSV}
          </pre>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Paste CSV Data:</label>
          <Textarea
            placeholder="Paste your CSV data here..."
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            rows={10}
            className="font-mono text-xs"
          />
        </div>

        <Button 
          onClick={handleImport}
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Import Listings
            </>
          )}
        </Button>

        {result && (
          <Alert className={result.failed === 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}>
            {result.failed === 0 ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">
                  ✅ Successfully imported: {result.success} listings
                </p>
                {result.failed > 0 && (
                  <div>
                    <p className="font-semibold text-orange-800">
                      ❌ Failed: {result.failed} listings
                    </p>
                    {result.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Errors:</p>
                        <ul className="text-xs space-y-1 mt-1">
                          {result.errors.map((error, i) => (
                            <li key={i} className="text-orange-700">{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}