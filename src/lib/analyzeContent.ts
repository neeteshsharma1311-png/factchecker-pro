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
  return data as AnalysisResult;
}
