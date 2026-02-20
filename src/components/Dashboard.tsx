import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pieData = [
  { name: "Safe", value: 42, color: "hsl(142, 71%, 45%)" },
  { name: "Suspicious", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "Fraudulent", value: 18, color: "hsl(0, 72%, 51%)" },
];

const barData = [
  { type: "Phishing", count: 34 },
  { type: "Deepfake", count: 21 },
  { type: "Fake News", count: 28 },
  { type: "Scam SMS", count: 15 },
  { type: "Malicious URL", count: 19 },
];

const stats = [
  { label: "Total Scans", value: "88", icon: Activity, color: "text-primary" },
  { label: "Threats Found", value: "46", icon: AlertTriangle, color: "text-warning" },
  { label: "Safe Content", value: "42", icon: CheckCircle, color: "text-safe" },
  { label: "Detection Rate", value: "97.3%", icon: Shield, color: "text-primary" },
];

const Dashboard = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
      <Activity className="h-6 w-6 text-primary" /> Analytics Dashboard
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="bg-card neon-border">
          <CardContent className="p-4 flex flex-col items-center gap-2">
            <s.icon className={`h-8 w-8 ${s.color}`} />
            <span className="text-2xl font-bold font-mono text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-card neon-border">
        <CardHeader><CardTitle className="text-sm text-foreground">Fraud vs Safe Distribution</CardTitle></CardHeader>
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
        <CardHeader><CardTitle className="text-sm text-foreground">Top Threat Types</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
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

export default Dashboard;
