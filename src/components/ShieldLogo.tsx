import { Shield, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";

const ShieldLogo = ({ size = 40 }: { size?: number }) => (
  <motion.div
    className="relative inline-flex items-center justify-center"
    animate={{ scale: [1, 1.06, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="absolute inset-[-8px] rounded-full bg-primary/15 blur-xl animate-pulse" />
    <div className="absolute inset-[-4px] rounded-full bg-primary/8 blur-md" />
    <div className="relative animate-pulse-glow rounded-xl p-2.5 bg-primary/5 border border-primary/20">
      <Shield className="text-primary" size={size} strokeWidth={1.8} />
      <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={size * 0.35} />
    </div>
  </motion.div>
);

export default ShieldLogo;
