import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult } from "@/components/ResultDisplay";

export type DetectionType = "news" | "image" | "email" | "url" | "message";

interface AnalyzePayload {
  type: DetectionType;
  content: string;
  headline?: string;
  imageBase64?: string;
}

export async function analyzeContent(payload: AnalyzePayload): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze", {
    body: payload,
  });

  if (error) throw new Error(error.message || "Analysis failed");
  const result = data as AnalysisResult;

  // Save to history
  const inputPreview = payload.headline
    ? `${payload.headline} — ${(payload.content || "").slice(0, 100)}`
    : payload.type === "image"
    ? "[Image uploaded]"
    : (payload.content || "").slice(0, 150);

  await supabase.from("scan_history").insert({
    scan_type: payload.type,
    input_preview: inputPreview,
    classification: result.classification,
    confidence: result.confidence,
    risk_level: result.riskLevel,
    explanation: result.explanation,
    details: result.details || {},
  });

  return result;
}

export async function fetchScanHistory(limit = 50) {
  const { data, error } = await supabase
    .from("scan_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
