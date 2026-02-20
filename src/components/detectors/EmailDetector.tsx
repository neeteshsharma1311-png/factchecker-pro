import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ResultDisplay, { type AnalysisResult } from "@/components/ResultDisplay";
import { analyzeContent } from "@/lib/analyzeContent";
import { toast } from "sonner";

const EmailDetector = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!email.trim()) { toast.error("Please paste email content."); return; }
    setLoading(true); setResult(null);
    try {
      const res = await analyzeContent({ type: "email", content: email });
      setResult(res);
    } catch (e: any) { toast.error(e.message || "Analysis failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Mail className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Phishing Email Detection</h2>
      </div>
      <p className="text-sm text-muted-foreground">Paste email content to detect phishing attempts, spoofed senders, urgency language, and social engineering patterns.</p>
      <Textarea placeholder="Paste full email content here..." value={email} onChange={(e) => setEmail(e.target.value)} rows={8} className="bg-secondary border-border" />
      <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
        {loading ? "Analyzing..." : <><Send className="h-4 w-4" /> Scan Email</>}
      </Button>
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default EmailDetector;
