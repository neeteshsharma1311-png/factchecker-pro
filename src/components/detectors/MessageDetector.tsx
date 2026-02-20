import { useState } from "react";
import { MessageSquareWarning, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ResultDisplay, { type AnalysisResult } from "@/components/ResultDisplay";
import { analyzeContent } from "@/lib/analyzeContent";
import { toast } from "sonner";

const MessageDetector = () => {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!msg.trim()) { toast.error("Please paste a message."); return; }
    setLoading(true); setResult(null);
    try {
      const res = await analyzeContent({ type: "message", content: msg });
      setResult(res);
    } catch (e: any) { toast.error(e.message || "Analysis failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <MessageSquareWarning className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Scam Message Detector</h2>
      </div>
      <p className="text-sm text-muted-foreground">Paste WhatsApp, SMS, or social media messages to detect OTP fraud, bank scams, job scams, and emotional manipulation.</p>
      <Textarea placeholder="Paste suspicious message here..." value={msg} onChange={(e) => setMsg(e.target.value)} rows={6} className="bg-secondary border-border" />
      <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
        {loading ? "Analyzing..." : <><Send className="h-4 w-4" /> Detect Scam</>}
      </Button>
      {result && <ResultDisplay result={result} scanType="Scam Message" inputPreview={msg.slice(0, 100)} />}
    </div>
  );
};

export default MessageDetector;
