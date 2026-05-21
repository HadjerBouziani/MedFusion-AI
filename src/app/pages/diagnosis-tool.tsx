import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Activity,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  Save,
  Send,
  Brain,
  Eye,
  FileText,
  Sparkles,
  User,
  Calendar,
  Hash,
  Zap,
  Image as ImageIcon,
  Shield,
  Target,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

type Modality = 'Chest X-Ray' | 'Brain MRI' | 'Retinal OCT' | 'Skin Lesion' | null;

interface Model {
  id: number;
  name: string;
  status: 'Clinical Approved' | 'Experimental';
  accuracy: string;
}

// ── Utility ───────────────────────────────────────────────────────────────────

function generatePatientId(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const number = Math.floor(10000 + Math.random() * 90000);
  return `P-${prefix}${number}`;
}

// ── PDF Generation ─────────────────────────────────────────────────────────────

async function loadJsPDF(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).jspdf) {
      resolve((window as any).jspdf.jsPDF);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve((window as any).jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function generateMedicalReport(params: {
  patientInfo: { name: string; age: string; gender: string; medicalId: string };
  selectedModality: Modality;
  selectedModel: Model | null;
  mockPrediction: { diagnosis: string; confidence: number; riskLevel: string; detailedResults: { label: string; probability: number }[] };
  doctorNotes: string;
  uploadedImage: string | null;
}) {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const riskColor: Record<string, [number, number, number]> = {
    High: [220, 53, 69],
    Moderate: [255, 152, 0],
    Low: [40, 167, 69],
  };
  const rc = riskColor[params.mockPrediction.riskLevel] ?? [100, 100, 100];

  // ── Page 1 ────────────────────────────────────────────────────────────────

  // Deep navy header block
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 52, 'F');

  // Accent gradient strip
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 52, W, 3, 'F');

  // Header logo circle
  doc.setFillColor(59, 130, 246);
  doc.circle(20, 22, 9, 'F');
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('AI', 16.5, 25.5);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('AI MEDICAL DIAGNOSIS REPORT', 34, 19);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Powered by Federated Learning & SSL Diagnostics Platform', 34, 26);

  // Header right — date/time
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8);
  doc.text(`Generated: ${dateStr}  ${timeStr}`, W - 12, 19, { align: 'right' });
  doc.text(`Report ID: RPT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, W - 12, 26, { align: 'right' });

  // Modality badge row
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(34, 33, 60, 12, 3, 3, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text('MODALITY', 38, 38.5);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(params.selectedModality ?? '—', 38, 43.5);

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(100, 33, 68, 12, 3, 3, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('AI MODEL', 104, 38.5);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const modelName = params.selectedModel?.name ?? '—';
  doc.text(modelName.length > 28 ? modelName.substring(0, 28) + '…' : modelName, 104, 43.5);

  // ── Patient Info Section ──────────────────────────────────────────────────
  let y = 64;

  // Section header
  doc.setFillColor(248, 250, 252);
  doc.rect(0, y - 4, W, 10, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(12, y - 4, 3, 10, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', 20, y + 3);
  y += 14;

  // Patient info card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(12, y, W - 24, 34, 4, 4, 'FD');

  const col1 = 20, col2 = 75, col3 = 130;
  const labelY = y + 10, valueY = y + 18;

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('PATIENT NAME', col1, labelY);
  doc.text('AGE / GENDER', col2, labelY);
  doc.text('MEDICAL ID', col3, labelY);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(params.patientInfo.name || '—', col1, valueY);
  doc.text(
    `${params.patientInfo.age || '—'} yrs${params.patientInfo.gender ? ' / ' + params.patientInfo.gender : ''}`,
    col2,
    valueY
  );
  doc.setFont('courier', 'bold');
  doc.text(params.patientInfo.medicalId || '—', col3, valueY);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(col2 - 5, y + 6, col2 - 5, y + 28);
  doc.line(col3 - 5, y + 6, col3 - 5, y + 28);

  // Date row
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text('ANALYSIS DATE', col1, y + 27);
  doc.text('STATUS', col2, y + 27);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text(dateStr, col1 + 30, y + 27);

  // Status badge
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(col2 + 1, y + 22.5, 28, 7, 2, 2, 'F');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPLETED', col2 + 3.5, y + 27.5);

  y += 44;

  // ── Diagnosis Result Section ──────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(0, y - 4, W, 10, 'F');
  doc.setFillColor(99, 102, 241);
  doc.rect(12, y - 4, 3, 10, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGNOSIS RESULTS', 20, y + 3);
  y += 14;

  // Primary diagnosis card — dark
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(12, y, 85, 50, 4, 4, 'F');

  doc.setFillColor(59, 130, 246);
  doc.roundedRect(16, y + 6, 25, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIMARY DIAGNOSIS', 18, y + 11.5);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const diagText = params.mockPrediction.diagnosis;
  doc.text(diagText, 16, y + 28);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Confidence Score', 16, y + 37);

  // Confidence bar bg
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(16, y + 39, 77, 5, 2, 2, 'F');
  // Confidence bar fill
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(16, y + 39, 77 * (params.mockPrediction.confidence / 100), 5, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${params.mockPrediction.confidence}%`, 16 + 77 * (params.mockPrediction.confidence / 100) - 14, y + 43.5);

  // Risk level card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(103, y, 95, 50, 4, 4, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('RISK ASSESSMENT', 111, y + 10);

  doc.setFillColor(...rc);
  doc.roundedRect(111, y + 14, 40, 14, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(params.mockPrediction.riskLevel.toUpperCase(), 113, y + 23.5);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('MODEL ACCURACY', 111, y + 36);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(params.selectedModel?.accuracy ?? '—', 111, y + 46);

  y += 60;

  // ── Probability Breakdown ──────────────────────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.rect(0, y - 4, W, 10, 'F');
  doc.setFillColor(16, 185, 129);
  doc.rect(12, y - 4, 3, 10, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PROBABILITY BREAKDOWN', 20, y + 3);
  y += 14;

  const barColors: [number, number, number][] = [
    [59, 130, 246],
    [100, 116, 139],
    [148, 163, 184],
  ];

  params.mockPrediction.detailedResults.forEach((result, i) => {
    const bx = 12, bw = W - 24;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(bx, y, bw, 18, 3, 3, 'FD');

    // Label
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
    doc.text(result.label, bx + 6, y + 11);

    // Bar track
    const trackX = bx + 55, trackW = bw - 80, trackH = 5;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(trackX, y + 7, trackW, trackH, 2, 2, 'F');
    // Bar fill
    doc.setFillColor(...barColors[Math.min(i, barColors.length - 1)]);
    doc.roundedRect(trackX, y + 7, trackW * (result.probability / 100), trackH, 2, 2, 'F');

    // Percentage
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${result.probability}%`, bx + bw - 6, y + 12, { align: 'right' });

    y += 22;
  });

  y += 6;

  // ── Medical Image (if provided) ─────────────────────────────────────────
  if (params.uploadedImage && y < 210) {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, y - 4, W, 10, 'F');
    doc.setFillColor(168, 85, 247);
    doc.rect(12, y - 4, 3, 10, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAL IMAGE', 20, y + 3);
    y += 12;

    try {
      const imgH = Math.min(60, H - y - 20);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(12, y, W - 24, imgH + 4, 4, 4, 'D');
      doc.addImage(params.uploadedImage, 'JPEG', 14, y + 2, W - 28, imgH, undefined, 'FAST');
      y += imgH + 10;
    } catch (_) {
      // silently skip if image can't be embedded
      y += 8;
    }
  }

  // ── Clinical Notes ────────────────────────────────────────────────────────
  if (params.doctorNotes.trim()) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(248, 250, 252);
    doc.rect(0, y - 4, W, 10, 'F');
    doc.setFillColor(245, 158, 11);
    doc.rect(12, y - 4, 3, 10, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINICAL NOTES', 20, y + 3);
    y += 14;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    const noteLines = doc.splitTextToSize(params.doctorNotes, W - 36);
    const noteH = Math.max(24, noteLines.length * 5.5 + 12);
    doc.roundedRect(12, y, W - 24, noteH, 4, 4, 'FD');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(noteLines, 18, y + 10);
    y += noteH + 10;
  }

  // ── AI Explainability ──────────────────────────────────────────────────────
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.rect(0, y - 4, W, 10, 'F');
  doc.setFillColor(239, 68, 68);
  doc.rect(12, y - 4, 3, 10, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('AI EXPLAINABILITY SUMMARY', 20, y + 3);
  y += 14;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  const explainText = `The AI model identified suspicious regions in the ${(params.selectedModality ?? '').toLowerCase()} image with high confidence (${params.mockPrediction.confidence}%). The analysis focused on texture abnormalities and density variations typical of ${params.mockPrediction.diagnosis.toLowerCase()}. Grad-CAM visualization confirmed the model's attention was concentrated on clinically relevant anatomical areas. The prediction aligns with established diagnostic criteria for this condition.`;
  const explainLines = doc.splitTextToSize(explainText, W - 36);
  const explainH = explainLines.length * 5.5 + 12;
  doc.roundedRect(12, y, W - 24, explainH, 4, 4, 'FD');

  // Light amber background for the explainability box
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(12, y, W - 24, explainH, 4, 4, 'F');
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.3);
  doc.roundedRect(12, y, W - 24, explainH, 4, 4, 'D');

  doc.setTextColor(92, 61, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(explainLines, 18, y + 10);
  y += explainH + 12;

  // ── Disclaimer ────────────────────────────────────────────────────────────
  if (y > 260) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(12, y, W - 24, 22, 3, 3, 'FD');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠  IMPORTANT MEDICAL DISCLAIMER', 16, y + 7);
  doc.setFont('helvetica', 'normal');
  const disclaimer = 'This AI-generated report is intended to assist qualified healthcare professionals and should not replace clinical judgment. All findings must be reviewed and validated by a licensed physician before any medical decisions are made. This report is confidential and intended solely for the treating physician.';
  const discLines = doc.splitTextToSize(disclaimer, W - 36);
  doc.text(discLines, 16, y + 13);

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = H - 12;
  doc.setFillColor(15, 23, 42);
  doc.rect(0, footerY - 4, W, 16, 'F');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Medical Diagnostics Platform  •  Federated Learning & SSL', 12, footerY + 4);
  doc.setTextColor(59, 130, 246);
  doc.text(`Page 1 of ${doc.getNumberOfPages()}`, W - 12, footerY + 4, { align: 'right' });

  // ── Save ──────────────────────────────────────────────────────────────────
  const safeName = (params.patientInfo.name || 'patient').replace(/\s+/g, '_');
  const safeDate = now.toISOString().split('T')[0];
  doc.save(`MedReport_${safeName}_${safeDate}.pdf`);
}

// ── Custom SVG Medical Icons ──────────────────────────────────────────────────

function ChestXRayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8 C32 8 20 10 16 18 C12 26 12 38 16 46 C20 54 32 56 32 56 C32 56 44 54 48 46 C52 38 52 26 48 18 C44 10 32 8 32 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      <line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 16 Q22 18 18 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 22 Q21 24 17 31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 28 Q21 30 18 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 34 Q22 36 20 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 40 Q24 42 23 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 16 Q42 18 46 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 22 Q43 24 47 31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 28 Q43 30 46 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 34 Q42 36 44 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 40 Q40 42 41 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M22 20 Q17 28 18 40 Q20 46 25 48 Q28 44 28 34 L28 20 Z" fill="currentColor" opacity="0.12"/>
      <path d="M42 20 Q47 28 46 40 Q44 46 39 48 Q36 44 36 34 L36 20 Z" fill="currentColor" opacity="0.12"/>
    </svg>
  );
}

function BrainMRIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10 C24 10 16 16 14 24 C12 30 13 35 16 39 C14 41 14 45 17 47 C19 49 22 49 24 48 C26 51 29 53 32 53 C35 53 38 51 40 48 C42 49 45 49 47 47 C50 45 50 41 48 39 C51 35 52 30 50 24 C48 16 40 10 32 10Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round"/>
      <path d="M22 18 Q18 22 18 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M20 30 Q17 34 19 39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M24 42 Q21 44 22 47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M42 18 Q46 22 46 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M44 30 Q47 34 45 39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M40 42 Q43 44 42 47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M32 12 C32 18 31 26 31 32 C31 38 32 44 32 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="2 2"/>
      <path d="M26 12 Q28 16 32 15 Q36 16 38 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M22 22 Q26 26 32 24 Q38 26 42 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function RetinalOCTIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 32 Q20 16 32 16 Q44 16 56 32 Q44 48 32 48 Q20 48 8 32Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" strokeLinejoin="round"/>
      <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.12"/>
      <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.35"/>
      <line x1="32" y1="22" x2="32" y2="25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="32" y1="39" x2="32" y2="42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="32" x2="25" y2="32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="39" y1="32" x2="42" y2="32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="25" y1="25" x2="27" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="37" y1="25" x2="39" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="25" y1="39" x2="27" y2="37" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="37" y1="39" x2="39" y2="37" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="28" cy="28" r="2" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

function SkinLesionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="52" width="24" height="4" rx="2" fill="currentColor" opacity="0.4"/>
      <rect x="30" y="20" width="4" height="34" rx="2" fill="currentColor" opacity="0.35"/>
      <rect x="20" y="20" width="20" height="4" rx="2" fill="currentColor" opacity="0.35"/>
      <rect x="18" y="10" width="8" height="14" rx="4" fill="currentColor" opacity="0.45"/>
      <circle cx="34" cy="46" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15"/>
      <circle cx="34" cy="46" r="2.5" fill="currentColor" opacity="0.3"/>
      <rect x="26" y="40" width="24" height="3" rx="1.5" fill="currentColor" opacity="0.3"/>
      <circle cx="44" cy="41.5" r="2" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.2"/>
      <path d="M43 41 Q44 40 45 41.5 Q44.5 43 43.5 42.5 Z" fill="currentColor" opacity="0.4"/>
      <path d="M22 24 L22 40" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" opacity="0.4"/>
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DiagnosisTool() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModality, setSelectedModality] = useState<Modality>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    medicalId: generatePatientId(),
  });
  const [ageError, setAgeError] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const steps = [
    { number: 1, title: 'Modality', icon: Target },
    { number: 2, title: 'Model', icon: Brain },
    { number: 3, title: 'Patient', icon: User },
    { number: 4, title: 'Upload', icon: Upload },
    { number: 5, title: 'Analysis', icon: Sparkles },
    { number: 6, title: 'Explain', icon: Eye },
    { number: 7, title: 'Export', icon: FileText },
  ];

  const modalities = [
    {
      name: 'Chest X-Ray',
      Icon: ChestXRayIcon,
      gradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-500',
      bgSelected: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/60 dark:to-cyan-950/60',
      borderSelected: 'border-blue-400 dark:border-blue-500',
      badgeClass: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
      description: 'Pneumonia, Tuberculosis, COVID-19',
      tags: ['Pneumonia', 'COVID-19', 'TB'],
      stat: '97.87% acc',
    },
    {
      name: 'Brain MRI',
      Icon: BrainMRIIcon,
      gradient: 'from-purple-500 to-violet-600',
      iconColor: 'text-purple-500',
      bgSelected: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/60 dark:to-violet-950/60',
      borderSelected: 'border-purple-400 dark:border-purple-500',
      badgeClass: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
      description: 'Tumors, Lesions, Structural Abnormalities',
      tags: ['Tumor', 'Lesion', 'MS'],
      stat: '99.02% acc',
    },
    {
      name: 'Retinal OCT',
      Icon: RetinalOCTIcon,
      gradient: 'from-emerald-500 to-teal-500',
      iconColor: 'text-emerald-500',
      bgSelected: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60',
      borderSelected: 'border-emerald-400 dark:border-emerald-500',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
      description: 'CNV, DME, Drusen, Macular Degeneration',
      tags: ['CNV', 'DME', 'Drusen'],
      stat: '97.50% acc',
    },
    {
      name: 'Skin Lesion',
      Icon: SkinLesionIcon,
      gradient: 'from-amber-500 to-orange-500',
      iconColor: 'text-amber-500',
      bgSelected: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60',
      borderSelected: 'border-amber-400 dark:border-amber-500',
      badgeClass: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
      description: 'Melanoma, Basal Cell, Malignant Detection',
      tags: ['Melanoma', 'BCC', 'SCC'],
      stat: '94.30% acc',
    },
  ];

  const modelsByModality: Record<string, Model[]> = {
    'Chest X-Ray': [
      { id: 1, name: 'ResNet18 SSL-FL v2.1', status: 'Clinical Approved', accuracy: '97.87%' },
      { id: 2, name: 'DenseNet121 SSL-FL v2.0', status: 'Experimental', accuracy: '96.45%' },
    ],
    'Brain MRI': [
      { id: 3, name: 'DenseNet121 SSL-FL v3.0', status: 'Clinical Approved', accuracy: '99.02%' },
      { id: 4, name: 'EfficientNet-B4 SSL-FL v1.5', status: 'Experimental', accuracy: '98.15%' },
    ],
    'Retinal OCT': [
      { id: 5, name: 'EfficientNet-B3 SSL-FL v1.8', status: 'Clinical Approved', accuracy: '97.50%' },
      { id: 6, name: 'ResNet50 SSL-FL v2.3', status: 'Experimental', accuracy: '96.80%' },
    ],
    'Skin Lesion': [
      { id: 7, name: 'MobileNetV2 SSL-FL v2.5', status: 'Clinical Approved', accuracy: '94.30%' },
      { id: 8, name: 'InceptionV3 SSL-FL v1.9', status: 'Experimental', accuracy: '93.75%' },
    ],
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgeChange = (value: string) => {
    const stripped = value.replace(/[^0-9]/g, '');
    setPatientInfo({ ...patientInfo, age: stripped });
    if (stripped === '') { setAgeError(''); return; }
    const num = parseInt(stripped, 10);
    if (num <= 0) setAgeError('Age must be greater than 0');
    else if (num > 130) setAgeError('Age must be 130 or less');
    else setAgeError('');
  };

  const isAgeValid = () => {
    if (!patientInfo.age) return false;
    const num = parseInt(patientInfo.age, 10);
    return Number.isInteger(num) && num > 0 && num <= 130;
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(5);
      toast.success('Analysis complete!');
    }, 3000);
  };

  const mockPrediction = {
    diagnosis:
      selectedModality === 'Chest X-Ray' ? 'Pneumonia'
      : selectedModality === 'Brain MRI' ? 'Glioma'
      : selectedModality === 'Retinal OCT' ? 'Diabetic Macular Edema'
      : 'Melanoma',
    confidence: 97.2,
    riskLevel: 'Moderate',
    detailedResults: [
      {
        label: selectedModality === 'Chest X-Ray' ? 'Pneumonia'
          : selectedModality === 'Brain MRI' ? 'Glioma'
          : selectedModality === 'Retinal OCT' ? 'DME'
          : 'Melanoma',
        probability: 97.2,
      },
      { label: 'Normal', probability: 2.1 },
      {
        label: selectedModality === 'Chest X-Ray' ? 'Tuberculosis'
          : selectedModality === 'Brain MRI' ? 'Meningioma'
          : selectedModality === 'Retinal OCT' ? 'Drusen'
          : 'Benign',
        probability: 0.7,
      },
    ],
  };

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateMedicalReport({
        patientInfo,
        selectedModality,
        selectedModel,
        mockPrediction,
        doctorNotes,
        uploadedImage,
      });
      toast.success('PDF report downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedModality !== null;
    if (currentStep === 2) return selectedModel !== null;
    if (currentStep === 3) return patientInfo.name && isAgeValid();
    if (currentStep === 4) return uploadedImage !== null;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* ── Progress Bar ── */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur sticky top-20 z-30">
        <CardContent className="pt-5 pb-5 px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">AI Diagnosis Workflow</h2>
            <Badge className="bg-blue-100 text-blue-700 border-0 text-xs px-3 py-1">
              Step {currentStep} / 7 — {steps[currentStep - 1].title}
            </Badge>
          </div>
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center" style={{ flex: index < steps.length - 1 ? '1 1 0%' : '0 0 auto' }}>
                <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 40 }}>
                  <button
                    type="button"
                    onClick={() => currentStep > step.number && setCurrentStep(step.number)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none ${
                      currentStep === step.number
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md ring-4 ring-blue-100 dark:ring-blue-900/40 scale-110'
                        : currentStep > step.number
                        ? 'bg-green-500 cursor-pointer hover:bg-green-600'
                        : 'bg-gray-200 dark:bg-slate-700 cursor-default'
                    }`}
                    disabled={currentStep <= step.number}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <step.icon className={`w-4 h-4 ${currentStep >= step.number ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                    )}
                  </button>
                  <span className={`text-[10px] font-medium leading-none text-center whitespace-nowrap ${
                    currentStep === step.number ? 'text-blue-600 dark:text-blue-400'
                    : currentStep > step.number ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                  }`}>{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: currentStep > step.number ? '100%' : '0%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">

        {/* ── Step 1 ── */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">Choose Imaging Modality</h2>
              <p className="text-gray-600 dark:text-gray-400">Select the type of medical scan you want to analyze with AI-powered diagnosis</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {modalities.map((modality) => {
                const isSelected = selectedModality === modality.name;
                const { Icon } = modality;
                return (
                  <div key={modality.name} onClick={() => setSelectedModality(modality.name as Modality)} className="group relative cursor-pointer">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${modality.gradient} rounded-3xl blur-lg transition-all duration-500 ${isSelected ? 'opacity-25' : 'opacity-0 group-hover:opacity-15'}`} />
                    <div className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected ? `${modality.borderSelected} ${modality.bgSelected} shadow-xl` : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-lg'}`}>
                      <div className={`h-1 w-full bg-gradient-to-r ${modality.gradient} transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                      <div className="p-6">
                        <div className="flex items-start gap-5">
                          <div className={`relative flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${isSelected ? `bg-gradient-to-br ${modality.gradient}` : `bg-gray-50 dark:bg-slate-700/80 group-hover:bg-gradient-to-br group-hover:${modality.gradient}`}`}>
                            <Icon className={`w-11 h-11 transition-colors duration-300 ${isSelected ? 'text-white' : `${modality.iconColor} group-hover:text-white`}`} />
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center ring-2 ring-green-400 shadow-md">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{modality.name}</h3>
                              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${modality.badgeClass}`}>{modality.stat}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-snug">{modality.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {modality.tags.map((tag) => (
                                <span key={tag} className={`text-xs px-2 py-0.5 rounded-md font-medium border transition-colors duration-200 ${isSelected ? `${modality.badgeClass} border-current/20` : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600'}`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`px-6 py-3 border-t transition-colors duration-300 flex items-center justify-between ${isSelected ? 'border-current/10 bg-white/40 dark:bg-black/10' : 'border-gray-100 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/30'}`}>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <Brain className={`w-3.5 h-3.5 ${isSelected ? modality.iconColor : 'text-gray-400'}`} />
                          {modelsByModality[modality.name]?.length} AI models available
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1 transition-all duration-300 ${isSelected ? modality.iconColor : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                          {isSelected ? 'Selected ✓' : 'Select →'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 2 ── */}
        {currentStep === 2 && selectedModality && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select AI Model</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose a model for {selectedModality} analysis</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {modelsByModality[selectedModality].map((model) => (
                <Card key={model.id} className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedModel?.id === model.id ? 'border-blue-500 shadow-xl bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur'}`} onClick={() => setSelectedModel(model)}>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{model.name}</h3>
                          <Badge className={`mt-1 ${model.status === 'Clinical Approved' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-amber-100 text-amber-700 border-amber-300'} border`}>
                            {model.status === 'Clinical Approved' ? <Shield className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                            {model.status}
                          </Badge>
                        </div>
                      </div>
                      {selectedModel?.id === model.id && <CheckCircle className="w-6 h-6 text-blue-600" />}
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Model Accuracy</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{model.accuracy}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3 ── */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Patient Information</h2>
              <p className="text-gray-600 dark:text-gray-400">Enter patient details for the analysis record</p>
            </div>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />Patient Name <span className="text-red-500">*</span></Label>
                    <Input id="name" placeholder="Full name" value={patientInfo.name} onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" />Age <span className="text-red-500">*</span></Label>
                    <Input id="age" inputMode="numeric" placeholder="e.g. 45" value={patientInfo.age} onChange={(e) => handleAgeChange(e.target.value)} className={`h-12 ${ageError ? 'border-red-400 focus:ring-red-300' : ''}`} />
                    {ageError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{ageError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />Gender</Label>
                    <div className="flex gap-3 h-12 items-center">
                      {(['Male', 'Female'] as const).map((g) => (
                        <button key={g} type="button" onClick={() => setPatientInfo({ ...patientInfo, gender: g })} className={`flex-1 h-12 rounded-lg border-2 text-sm font-semibold transition-all duration-200 ${patientInfo.gender === g ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-500'}`}>
                          {g === 'Male' ? '♂ Male' : '♀ Female'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medicalId" className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />Medical ID
                      <span className="ml-auto text-xs text-gray-400 font-normal">Auto-generated — edit if needed</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input id="medicalId" placeholder="P-XX00000" value={patientInfo.medicalId} onChange={(e) => setPatientInfo({ ...patientInfo, medicalId: e.target.value })} className="h-12 font-mono flex-1" />
                      <Button type="button" variant="outline" size="icon" className="h-12 w-12 flex-shrink-0" onClick={() => setPatientInfo({ ...patientInfo, medicalId: generatePatientId() })} title="Regenerate ID">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Step 4 ── */}
        {currentStep === 4 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Medical Image</h2>
              <p className="text-gray-600 dark:text-gray-400">Upload {selectedModality} image for AI analysis</p>
            </div>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ImageIcon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Drop your medical image here</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">or click to browse from your computer</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload">
                      <Button asChild size="lg" className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600">
                        <span><Upload className="w-5 h-5 mr-2" />Select Image</span>
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Supported formats: JPG, PNG, DICOM</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-96 object-contain" />
                      <Badge className="absolute top-4 right-4 bg-green-500 text-white border-0 shadow-lg"><CheckCircle className="w-3 h-3 mr-1" />Image Uploaded</Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setUploadedImage(null)}>Change Image</Button>
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600" onClick={runAnalysis}><Zap className="w-4 h-4 mr-2" />Start Analysis</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Step 5 ── */}
        {currentStep === 5 && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur max-w-2xl mx-auto">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Image...</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">AI is processing your medical image</p>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Prediction Results</h2>
                  <p className="text-gray-600 dark:text-gray-400">Analysis completed successfully</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <CardContent className="pt-8 pb-8">
                      <div className="text-center">
                        <Badge className="bg-white/20 text-white border-0 mb-4">Primary Diagnosis</Badge>
                        <h3 className="text-3xl font-bold mb-2">{mockPrediction.diagnosis}</h3>
                        <p className="text-blue-100 mb-6">Confidence: {mockPrediction.confidence}%</p>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                          <p className="text-sm mb-2">Risk Level</p>
                          <Badge className={`${mockPrediction.riskLevel === 'High' ? 'bg-red-500' : mockPrediction.riskLevel === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'} text-white border-0 text-lg px-4 py-2`}>{mockPrediction.riskLevel}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                    <CardContent className="pt-8 pb-8">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Detailed Probabilities</h3>
                      <div className="space-y-4">
                        {mockPrediction.detailedResults.map((result, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{result.label}</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{result.probability}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div className={`h-2 rounded-full ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-400'}`} style={{ width: `${result.probability}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 6 ── */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Explainability</h2>
              <p className="text-gray-600 dark:text-gray-400">Visual explanation of AI decision-making</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Original Image</h3>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <img src={uploadedImage || ''} alt="Original" className="w-full h-80 object-contain" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Grad-CAM Heatmap</h3>
                    <Badge className="bg-purple-100 text-purple-700 border-0"><Eye className="w-3 h-3 mr-1" />AI Focus Areas</Badge>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <img src={uploadedImage || ''} alt="Heatmap" className="w-full h-80 object-contain opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-yellow-500/40 to-transparent mix-blend-multiply"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur rounded-lg p-3">
                      <p className="text-white text-sm"><span className="font-semibold">Red areas:</span> High attention regions where AI detected abnormalities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" />Clinical Explanation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The AI model identified suspicious regions in the {selectedModality?.toLowerCase()} image with high confidence. The highlighted areas (shown in red) indicate potential {mockPrediction.diagnosis.toLowerCase()} patterns. The model focused primarily on texture abnormalities and density variations typical of this condition.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Step 7 ── */}
        {currentStep === 7 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Review & Export Report</h2>
              <p className="text-gray-600 dark:text-gray-400">Add clinical notes and export the analysis</p>
            </div>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-6 pb-6">
                <Label htmlFor="notes" className="flex items-center gap-2 mb-3"><FileText className="w-4 h-4 text-gray-500" />Clinical Notes</Label>
                <Textarea id="notes" placeholder="Enter your clinical observations and recommendations..." value={doctorNotes} onChange={(e) => setDoctorNotes(e.target.value)} rows={6} className="resize-none" />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Analysis Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-600 dark:text-gray-400">Patient</p><p className="font-semibold text-gray-900 dark:text-white">{patientInfo.name} ({patientInfo.age}y{patientInfo.gender ? `, ${patientInfo.gender}` : ''})</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">Medical ID</p><p className="font-semibold text-gray-900 dark:text-white font-mono">{patientInfo.medicalId}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">Modality</p><p className="font-semibold text-gray-900 dark:text-white">{selectedModality}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">AI Model</p><p className="font-semibold text-gray-900 dark:text-white">{selectedModel?.name}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">Diagnosis</p><p className="font-semibold text-gray-900 dark:text-white">{mockPrediction.diagnosis}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">Confidence</p><p className="font-semibold text-gray-900 dark:text-white">{mockPrediction.confidence}%</p></div>
                </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-70"
                onClick={handleExportPDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <><RefreshCw className="w-5 h-5 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Download className="w-5 h-5 mr-2" />Export PDF</>
                )}
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" onClick={() => toast.success('Saved to case history!')}>
                <Save className="w-5 h-5 mr-2" />Save to History
              </Button>
              <Button size="lg" variant="outline" className="border-2" onClick={() => toast.success('Report sent to patient!')}>
                <Send className="w-5 h-5 mr-2" />Send to Patient
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur sticky bottom-4 z-30">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
              <ArrowLeft className="w-5 h-5 mr-2" />Previous
            </Button>
            <Button
              size="lg"
              onClick={() => {
                if (currentStep === 4 && uploadedImage) runAnalysis();
                else setCurrentStep(Math.min(7, currentStep + 1));
              }}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {currentStep === 4 && uploadedImage ? (
                <><Zap className="w-5 h-5 mr-2" />Start Analysis</>
              ) : (
                <>Next<ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}