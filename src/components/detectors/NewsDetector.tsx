import { useState } from "react";
import { Newspaper, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ResultDisplay, { type AnalysisResult } from "@/components/ResultDisplay";
import { analyzeContent } from "@/lib/analyzeContent";
import { toast } from "sonner";

const NewsDetector = () => {
  const [headline, setHeadline] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!headline.trim() && !article.trim()) {
      toast.error("Please enter a headline or article text.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeContent({ type: "news", content: article, headline });
      setResult(res);
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Newspaper className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Fake News Detection</h2>
      </div>
      <p className="text-sm text-muted-foreground">Paste a news headline and/or article body to check for misinformation, emotional bias, and fake content patterns.</p>
      <Input
        placeholder="Enter news headline..."
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        className="bg-secondary border-border"
      />
      <Textarea
        placeholder="Paste article content here..."
        value={article}
        onChange={(e) => setArticle(e.target.value)}
        rows={6}
        className="bg-secondary border-border"
      />
      <Button onClick={handleAnalyze} disabled={loading} className="gap-2">
        {loading ? "Analyzing..." : <><Send className="h-4 w-4" /> Analyze Article</>}
      </Button>
      {result && <ResultDisplay result={result} scanType="Fake News" inputPreview={headline || article.slice(0, 100)} />}
    </div>
  );
};

export default NewsDetector;
