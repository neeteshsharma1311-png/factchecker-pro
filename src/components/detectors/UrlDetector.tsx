import { useState } from "react";
import { Link2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResultDisplay, { type AnalysisResult } from "@/components/ResultDisplay";
import { analyzeContent } from "@/lib/analyzeContent";
import { toast } from "sonner";

const UrlDetector = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) { toast.error("Please enter a URL."); return; }
    setLoading(true); setResult(null);
    try {
      const res = await analyzeContent({ type: "url", content: url });
      setResult(res);
    } catch (e: any) { toast.error(e.message || "Analysis failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">URL / Link Scanner</h2>
      </div>
      <p className="text-sm text-muted-foreground">Paste a suspicious URL to check for typosquatting, phishing domains, and malicious patterns.</p>
      <Input placeholder="https://example.com..." value={url} onChange={(e) => setUrl(e.target.value)} className="bg-secondary border-border font-mono" />
      <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
        {loading ? "Scanning..." : <><Send className="h-4 w-4" /> Scan URL</>}
      </Button>
      {result && <ResultDisplay result={result} scanType="URL Scanner" inputPreview={url} />}
    </div>
  );
};

export default UrlDetector;
