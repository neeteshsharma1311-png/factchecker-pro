import { motion } from "framer-motion";
import { Shield, AlertTriangle, XCircle, CheckCircle, Download, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/lib/pdfExport";

export interface AnalysisResult {
  classification: string;
  confidence: number;
  riskLevel: "safe" | "suspicious" | "danger";
  explanation: string;
  details?: Record<string, string>;
}

const riskConfig = {
  safe: { icon: CheckCircle, color: "text-safe", bg: "bg-safe/10", border: "border-safe/30", label: "Safe", barColor: "bg-safe" },
  suspicious: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Suspicious", barColor: "bg-warning" },
  danger: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", border: "border-danger/30", label: "High Risk", barColor: "bg-danger" },
};

interface Props {
  result: AnalysisResult;
  scanType?: string;
  inputPreview?: string;
}

const ResultDisplay = ({ result, scanType, inputPreview }: Props) => {
  const config = riskConfig[result.riskLevel];
  const Icon = config.icon;

  const handleExportPDF = () => {
    generatePDF(result, scanType || "Unknown", inputPreview || "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-6 space-y-4 scan-line`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Icon className={`${config.color} h-10 w-10`} />
          </motion.div>
          <div>
            <h3 className={`text-xl font-bold font-display ${config.color}`}>{result.classification}</h3>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{config.label}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1.5 text-xs border-border">
          <Download className="h-3.5 w-3.5" /> PDF
        </Button>
      </div>

      {/* Confidence */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confidence Score</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`font-mono font-bold text-lg ${config.color}`}
          >
            {result.confidence}%
          </motion.span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className={`h-full rounded-full ${config.barColor}`}
          />
        </div>
      </div>

      {/* Analysis */}
      <div className="rounded-lg bg-background/50 p-4 neon-border">
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-mono uppercase tracking-wider text-xs">Analysis Report</span>
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
      </div>

      {/* Details */}
      {result.details && Object.keys(result.details).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" /> Detailed Findings
          </h4>
          <div className="rounded-lg bg-background/30 divide-y divide-border/50">
            {Object.entries(result.details).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 px-4 py-2.5 text-sm">
                <span className="text-muted-foreground font-medium">{key}</span>
                <span className="font-mono text-foreground text-xs sm:text-sm sm:text-right max-w-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResultDisplay;
