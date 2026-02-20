import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, ImageIcon, Mail, Link2, MessageSquareWarning, BarChart3, History, Shield, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import ShieldLogo from "@/components/ShieldLogo";
import NewsDetector from "@/components/detectors/NewsDetector";
import ImageDetector from "@/components/detectors/ImageDetector";
import EmailDetector from "@/components/detectors/EmailDetector";
import UrlDetector from "@/components/detectors/UrlDetector";
import MessageDetector from "@/components/detectors/MessageDetector";
import Dashboard from "@/components/Dashboard";
import ScanHistory from "@/components/ScanHistory";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ParticleBackground from "@/components/ParticleBackground";

const tabs = [
  { value: "news", label: "News", icon: Newspaper },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "email", label: "Email", icon: Mail },
  { value: "url", label: "URL", icon: Link2 },
  { value: "messages", label: "Messages", icon: MessageSquareWarning },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "history", label: "History", icon: History },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="min-h-screen bg-background hex-bg relative">
      <ParticleBackground />

      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <ShieldLogo size={34} />
            <div>
              <h1 className="text-lg font-bold font-display text-foreground neon-text leading-tight tracking-wide">
                FAKEFACT PRO
              </h1>
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                AI Fraud & Misinformation Detection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-safe/30 bg-safe/10 px-3 py-1 text-xs font-mono text-safe">
              <span className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse" /> ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 pt-12 pb-8 text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
        >
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-mono text-primary">v2.0 — AI-Powered Threat Detection</span>
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-extrabold font-display text-foreground neon-text mb-4 tracking-tight">
          DETECT DIGITAL FRAUD
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
          Advanced AI analysis for fake news, deepfakes, phishing emails, malicious URLs, and scam messages.
          Protect yourself from misinformation and cyber threats with real-time detection.
        </p>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {[
            { icon: Shield, label: "5 Detection Modules", color: "text-primary" },
            { icon: BarChart3, label: "Real-time Analytics", color: "text-safe" },
            { icon: History, label: "Full Scan History", color: "text-warning" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-1.5"
            >
              <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
              <span className="text-xs text-muted-foreground hidden sm:inline">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center gap-1 bg-card/80 glass rounded-xl p-1.5 mb-8 neon-border">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
              >
                <t.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card/50 glass rounded-2xl p-6 sm:p-8 neon-border">
              <TabsContent value="news" className="mt-0"><NewsDetector /></TabsContent>
              <TabsContent value="image" className="mt-0"><ImageDetector /></TabsContent>
              <TabsContent value="email" className="mt-0"><EmailDetector /></TabsContent>
              <TabsContent value="url" className="mt-0"><UrlDetector /></TabsContent>
              <TabsContent value="messages" className="mt-0"><MessageDetector /></TabsContent>
              <TabsContent value="dashboard" className="mt-0 max-w-4xl"><Dashboard /></TabsContent>
              <TabsContent value="history" className="mt-0"><ScanHistory /></TabsContent>
            </div>
          </motion.div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center relative z-10">
        <p className="text-xs text-muted-foreground">
          Developed with ❤️ by{" "}
          <a href="https://www.neetesh.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono">
            Neetesh Sharma
          </a>
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">FakeFact Pro v2.0 — AI Powered Cybersecurity</p>
      </footer>
    </div>
  );
};

export default Index;
