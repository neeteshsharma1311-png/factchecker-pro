import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, ImageIcon, Mail, Link2, MessageSquareWarning, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import ShieldLogo from "@/components/ShieldLogo";
import NewsDetector from "@/components/detectors/NewsDetector";
import ImageDetector from "@/components/detectors/ImageDetector";
import EmailDetector from "@/components/detectors/EmailDetector";
import UrlDetector from "@/components/detectors/UrlDetector";
import MessageDetector from "@/components/detectors/MessageDetector";
import Dashboard from "@/components/Dashboard";

const tabs = [
  { value: "news", label: "News", icon: Newspaper },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "email", label: "Email", icon: Mail },
  { value: "url", label: "URL", icon: Link2 },
  { value: "messages", label: "Messages", icon: MessageSquareWarning },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/60 glass sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <ShieldLogo size={36} />
            <div>
              <h1 className="text-lg font-bold text-foreground neon-text leading-tight">FakeFact Pro</h1>
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground">AI Fraud & Misinformation Detection</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-safe/30 bg-safe/10 px-3 py-1 text-xs font-mono text-safe">
            <span className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse" /> System Online
          </span>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 pt-12 pb-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground neon-text mb-3">
          Detect Digital Fraud in Seconds
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          AI-powered analysis for fake news, deepfakes, phishing emails, malicious URLs, and scam messages.
          Protect yourself from misinformation and cyber threats.
        </p>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center gap-1 bg-secondary/50 rounded-xl p-1.5 mb-8">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="flex items-center gap-1.5 px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="max-w-2xl mx-auto">
            <TabsContent value="news"><NewsDetector /></TabsContent>
            <TabsContent value="image"><ImageDetector /></TabsContent>
            <TabsContent value="email"><EmailDetector /></TabsContent>
            <TabsContent value="url"><UrlDetector /></TabsContent>
            <TabsContent value="messages"><MessageDetector /></TabsContent>
            <TabsContent value="dashboard" className="max-w-4xl mx-auto"><Dashboard /></TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Developed with ❤️ by{" "}
        <a href="https://www.neetesh.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Neetesh Sharma
        </a>
      </footer>
    </div>
  );
};

export default Index;
