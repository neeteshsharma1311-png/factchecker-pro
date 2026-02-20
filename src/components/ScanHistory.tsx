import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Newspaper, ImageIcon, Mail, Link2, MessageSquareWarning, CheckCircle, AlertTriangle, XCircle, Trash2 } from "lucide-react";
import { fetchScanHistory } from "@/lib/analyzeContent";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const typeIcons: Record<string, any> = {
  news: Newspaper,
  image: ImageIcon,
  email: Mail,
  url: Link2,
  message: MessageSquareWarning,
};

const riskIcons: Record<string, { icon: any; color: string }> = {
  safe: { icon: CheckCircle, color: "text-safe" },
  suspicious: { icon: AlertTriangle, color: "text-warning" },
  danger: { icon: XCircle, color: "text-danger" },
};

const ScanHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchScanHistory();
      setHistory(data || []);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const clearHistory = async () => {
    const { error } = await supabase.from("scan_history").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) toast.error("Failed to clear history");
    else { setHistory([]); toast.success("History cleared"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <span className="font-display">Scan History</span>
        </h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-danger flex items-center gap-1 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No scans yet. Run your first analysis!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {history.map((item, i) => {
            const TypeIcon = typeIcons[item.scan_type] || Newspaper;
            const risk = riskIcons[item.risk_level] || riskIcons.safe;
            const RiskIcon = risk.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
              >
                <TypeIcon className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.input_preview || item.classification}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {format(new Date(item.created_at), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-mono text-muted-foreground">{item.confidence}%</span>
                  <RiskIcon className={`h-4 w-4 ${risk.color}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScanHistory;
