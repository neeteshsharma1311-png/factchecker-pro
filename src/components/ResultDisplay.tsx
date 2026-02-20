import { motion } from "framer-motion";
import { Shield, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface AnalysisResult {
  classification: string;
  confidence: number;
  riskLevel: "safe" | "suspicious" | "danger";
  explanation: string;
  details?: Record<string, string>;
}

const riskConfig = {
  safe: { icon: CheckCircle, color: "text-safe", bg: "bg-safe/10", border: "border-safe/30", label: "Safe" },
  suspicious: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Suspicious" },
  danger: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", border: "border-danger/30", label: "High Risk" },
};

const ResultDisplay = ({ result }: { result: AnalysisResult }) => {
  const config = riskConfig[result.riskLevel];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-6 space-y-4`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`${config.color} h-8 w-8`} />
        <div>
          <h3 className={`text-lg font-bold ${config.color}`}>{result.classification}</h3>
          <p className="text-sm text-muted-foreground">{config.label}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confidence Score</span>
          <span className={`font-mono font-bold ${config.color}`}>{result.confidence}%</span>
        </div>
        <Progress value={result.confidence} className="h-2" />
      </div>

      <div className="rounded-lg bg-background/50 p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" /> Analysis
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
      </div>

      {result.details && Object.keys(result.details).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Details</h4>
          {Object.entries(result.details).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm border-b border-border/50 pb-1">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-mono text-foreground">{value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ResultDisplay;
