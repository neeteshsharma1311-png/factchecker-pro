import jsPDF from "jspdf";
import type { AnalysisResult } from "@/components/ResultDisplay";

export function generatePDF(result: AnalysisResult, scanType: string, inputPreview: string) {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  let y = 20;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(0, 180, 216);
  doc.text("FakeFact Pro - Analysis Report", w / 2, y, { align: "center" });
  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString()}`, w / 2, y, { align: "center" });
  y += 15;

  // Line
  doc.setDrawColor(0, 180, 216);
  doc.setLineWidth(0.5);
  doc.line(20, y, w - 20, y);
  y += 12;

  // Scan type
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text(`Scan Type: ${scanType.toUpperCase()}`, 20, y);
  y += 10;

  // Input preview
  if (inputPreview) {
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(`Input: ${inputPreview.slice(0, 200)}${inputPreview.length > 200 ? "..." : ""}`, w - 40);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 6;
  }

  // Classification
  const riskColors: Record<string, [number, number, number]> = {
    safe: [34, 197, 94],
    suspicious: [245, 158, 11],
    danger: [239, 68, 68],
  };
  const color = riskColors[result.riskLevel] || [150, 150, 150];
  doc.setFontSize(16);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(`Classification: ${result.classification}`, 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Confidence: ${result.confidence}%`, 20, y);
  y += 10;

  doc.setTextColor(40, 40, 40);
  doc.text(`Risk Level: ${result.riskLevel.toUpperCase()}`, 20, y);
  y += 12;

  // Explanation
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const expLines = doc.splitTextToSize(result.explanation, w - 40);
  doc.text(expLines, 20, y);
  y += expLines.length * 6 + 10;

  // Details
  if (result.details && Object.keys(result.details).length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(0, 180, 216);
    doc.text("Detailed Findings", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    Object.entries(result.details).forEach(([key, value]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${key}:`, 20, y);
      doc.setFont("helvetica", "normal");
      const valLines = doc.splitTextToSize(value, w - 80);
      doc.text(valLines, 70, y);
      y += valLines.length * 5 + 6;
    });
  }

  // Footer
  y = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Developed by Neetesh Sharma | https://www.neetesh.tech", w / 2, y, { align: "center" });

  doc.save(`fakefact-report-${Date.now()}.pdf`);
}
