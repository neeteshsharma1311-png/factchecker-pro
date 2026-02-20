import { useState, useRef } from "react";
import { ImageIcon, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultDisplay, { type AnalysisResult } from "@/components/ResultDisplay";
import { analyzeContent } from "@/lib/analyzeContent";
import { toast } from "sonner";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ImageDetector = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE) { toast.error("File must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!base64) { toast.error("Please upload an image first."); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeContent({ type: "image", content: "", imageBase64: base64 });
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
        <ImageIcon className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Fake Image Detection</h2>
      </div>
      <p className="text-sm text-muted-foreground">Upload an image to detect deepfakes, AI-generated content, and manipulation artifacts.</p>

      <div
        onClick={() => fileRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-secondary/50 flex flex-col items-center justify-center p-10 gap-3"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload image (max 5MB)</span>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <Button onClick={handleAnalyze} disabled={loading || !base64} className="gap-2">
        {loading ? "Analyzing..." : <><Send className="h-4 w-4" /> Analyze Image</>}
      </Button>
      {result && <ResultDisplay result={result} scanType="Image Analysis" inputPreview="[Uploaded Image]" />}
    </div>
  );
};

export default ImageDetector;
