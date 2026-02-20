import { Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ShieldLogo = ({ size = 40 }: { size?: number }) => (
  <motion.div
    className="relative inline-flex items-center justify-center"
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
    <div className="relative animate-pulse-glow rounded-xl p-2">
      <Shield className="text-primary" size={size} strokeWidth={2} />
      <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={size * 0.4} />
    </div>
  </motion.div>
);

export default ShieldLogo;
