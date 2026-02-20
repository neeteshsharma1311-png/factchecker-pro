import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  news: `You are a misinformation detection expert. Analyze the given news headline and article for fake news indicators. Check for: emotional manipulation, clickbait patterns, source credibility issues, logical fallacies, unverified claims, sensationalism, and bias. Return a JSON object with these exact fields:
  - classification: one of "Fake", "Likely Fake", "Unverified", "Likely Real", "Real"
  - confidence: number 0-100
  - riskLevel: one of "safe", "suspicious", "danger"
  - explanation: detailed analysis (2-3 sentences)
  - details: object with keys like "Emotional Bias", "Clickbait Score", "Source Credibility", "Factual Consistency"`,

  image: `You are a digital forensics expert specializing in image authenticity. Based on the description of an uploaded image, analyze for: deepfake patterns, AI generation artifacts (DALL-E, Midjourney, Stable Diffusion signatures), inconsistent lighting/shadows, facial asymmetry issues, metadata anomalies, and pixel-level inconsistencies. Return a JSON object with:
  - classification: one of "Authentic", "Likely Authentic", "Suspicious", "AI Generated", "Manipulated"
  - confidence: number 0-100
  - riskLevel: one of "safe", "suspicious", "danger"
  - explanation: technical analysis (2-3 sentences)
  - details: object with keys like "AI Generation Probability", "Manipulation Artifacts", "Metadata Status", "Consistency Score"`,

  email: `You are a cybersecurity expert specializing in phishing detection. Analyze the email content for: urgency/fear tactics, suspicious sender patterns, grammar anomalies, social engineering techniques, spoofed domains, malicious intent indicators, and credential harvesting attempts. Return a JSON object with:
  - classification: one of "Safe", "Suspicious", "Phishing Attempt", "Confirmed Phishing"
  - confidence: number 0-100
  - riskLevel: one of "safe", "suspicious", "danger"
  - explanation: detailed analysis (2-3 sentences)
  - details: object with keys like "Urgency Level", "Social Engineering", "Domain Trust", "Grammar Quality"`,

  url: `You are a URL security analyst. Analyze the given URL for: typosquatting, suspicious TLD, random character patterns, HTTPS usage, known phishing domain patterns, URL shortener abuse, homoglyph attacks, and suspicious query parameters. Return a JSON object with:
  - classification: one of "Safe", "Suspicious", "High Risk Phishing", "Known Malicious"
  - confidence: number 0-100
  - riskLevel: one of "safe", "suspicious", "danger"
  - explanation: detailed analysis (2-3 sentences)
  - details: object with keys like "Domain Trust", "HTTPS Status", "Typosquatting Risk", "URL Pattern"`,

  message: `You are a scam detection specialist. Analyze the message for: OTP fraud patterns, bank impersonation, job scam indicators, lottery/prize scams, emotional manipulation, fake urgency, fake authority claims, and money extraction tactics. Return a JSON object with:
  - classification: one of "Legitimate", "Suspicious", "Likely Scam", "Confirmed Scam"
  - confidence: number 0-100
  - riskLevel: one of "safe", "suspicious", "danger"
  - explanation: detailed analysis (2-3 sentences)
  - details: object with keys like "Scam Type", "Manipulation Level", "Urgency Tactics", "Authority Spoofing"`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, content, headline, imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = systemPrompts[type];
    if (!systemPrompt) throw new Error("Invalid detection type");

    let userMessage = "";
    if (type === "news") {
      userMessage = `Headline: ${headline || "N/A"}\n\nArticle: ${content || "N/A"}`;
    } else if (type === "image") {
      userMessage = imageBase64
        ? "An image has been uploaded for analysis. Please analyze it for deepfake and AI generation indicators based on what you can observe."
        : "No image provided.";
    } else {
      userMessage = content;
    }

    const messages: any[] = [
      { role: "system", content: systemPrompt + "\n\nIMPORTANT: Return ONLY the raw JSON object. No markdown, no code fences, no extra text." },
      { role: "user", content: userMessage },
    ];

    // For image analysis, include the image if available
    if (type === "image" && imageBase64) {
      messages[1] = {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image for deepfake, AI generation, and manipulation indicators." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response, stripping any markdown fences
    let cleaned = rawContent.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
