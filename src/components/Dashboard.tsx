import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fetchScanHistory } from "@/lib/analyzeContent";

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, safe: 0, suspicious: 0, danger: 0 });
  const [typeCounts, setTypeCounts] = useState<{ type: string; count: number }[]>([]);

  useEffect(() => {
    fetchScanHistory(500).then((data) => {
      if (!data) return;
      const s = { total: data.length, safe: 0, suspicious: 0, danger: 0 };
      const types: Record<string, number> = {};
      data.forEach((d: any) => {
        if (d.risk_level === "safe") s.safe++;
        else if (d.risk_level === "suspicious") s.suspicious++;
        else s.danger++;
        types[d.scan_type] = (types[d.scan_type] || 0) + 1;
      });
      setStats(s);
      setTypeCounts(Object.entries(types).map(([type, count]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), count })));
    });
  }, []);

  const pieData = [
    { name: "Safe", value: stats.safe || 1, color: "hsl(142, 71%, 45%)" },
    { name: "Suspicious", value: stats.suspicious || 0, color: "hsl(38, 92%, 50%)" },
    { name: "Danger", value: stats.danger || 0, color: "hsl(0, 72%, 51%)" },
  ];

  const rate = stats.total > 0 ? (((stats.suspicious + stats.danger) / stats.total) * 100).toFixed(1) : "0";

  const statCards = [
    { label: "Total Scans", value: stats.total.toString(), icon: Activity, color: "text-primary" },
    { label: "Threats Found", value: (stats.suspicious + stats.danger).toString(), icon: AlertTriangle, color: "text-warning" },
    { label: "Safe Content", value: stats.safe.toString(), icon: CheckCircle, color: "text-safe" },
    { label: "Threat Rate", value: `${rate}%`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Activity className="h-6 w-6 text-primary" />
        <span className="font-display">Analytics Dashboard</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-card neon-border">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <s.icon className={`h-8 w-8 ${s.color}`} />
                <span className="text-2xl font-bold font-mono text-foreground">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card neon-border">
          <CardHeader><CardTitle className="text-sm text-foreground font-display">Risk Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(220,16%,18%)", borderRadius: 8, color: "hsl(210,40%,94%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="flex justify-center gap-4 pb-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-card neon-border">
          <CardHeader><CardTitle className="text-sm text-foreground font-display">Scans by Type</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={typeCounts.length ? typeCounts : [{ type: "None", count: 0 }]}>
                <XAxis dataKey="type" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(220,16%,18%)", borderRadius: 8, color: "hsl(210,40%,94%)" }} />
                <Bar dataKey="count" fill="hsl(199,89%,48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
