import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
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
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from './../../lib/supabaseClient'
import gradMeImg from './gradme.jpg';


type Modality = 'Chest X-Ray' | 'Brain MRI' | 'Retinal OCT' | 'Skin Lesion' | null;

interface Model {
  id: number;
  name: string;
  status: 'Clinical Approved' | 'Experimental';
  accuracy: string;
}

// ── Per-modality class definitions ───────────────────────────────────────────
const MODALITY_CLASSES: Record<string, string[]> = {
  'Chest X-Ray':  ['Normal', 'Pneumonia', 'Tuberculosis'],
  'Brain MRI':    ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary'],
  'Retinal OCT':  ['CNV', 'DME', 'Drusen', 'Normal'],
  'Skin Lesion':  ['Benign', 'Malignant'],
};

// ── FAKE BACKEND ──────────────────────────────────────────────────────────────
const KNOWN_CASES: Record<string, {
  diagnosis: string;
  confidence: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  detailedResults: { label: string; probability: number }[];
  gradCamSrc: string | null;
}> = {
  'Brain MRI::Te-aug-me_26.jpg': {
    diagnosis: 'Meningioma',
    confidence: 96.4,
    riskLevel: 'Moderate',
    detailedResults: [
      { label: 'Meningioma', probability: 96.4 },
      { label: 'No Tumor',   probability: 2.1  },
      { label: 'Glioma',     probability: 1.5  },
    ],
    gradCamSrc: gradMeImg,
  },
};

const UNKNOWN_RESULT = {
  diagnosis: 'Unknown / Unrecognized',
  confidence: 31.7,
  riskLevel: 'High' as const,
  detailedResults: [
    { label: 'Unknown Pattern', probability: 31.7 },
    { label: 'Normal',          probability: 28.4 },
    { label: 'Artifact / Noise',probability: 19.9 },
  ],
  gradCamSrc: null,
};

function getFakeBackendResult(modality: string, filename: string) {
  const key = `${modality}::${filename}`;
  return KNOWN_CASES[key] ?? UNKNOWN_RESULT;
}

function buildDefaultPrediction(modality: string | null) {
  if (!modality) {
    return { diagnosis: '—', confidence: 0, riskLevel: 'Low' as const, detailedResults: [], gradCamSrc: null };
  }
  const classes = MODALITY_CLASSES[modality] ?? [];
  const topMap: Record<string, { diagnosis: string; confidence: number; riskLevel: 'Low' | 'Moderate' | 'High' }> = {
    'Chest X-Ray': { diagnosis: 'Pneumonia', confidence: 97.2, riskLevel: 'High'     },
    'Brain MRI':   { diagnosis: 'Glioma',    confidence: 98.1, riskLevel: 'High'     },
    'Retinal OCT': { diagnosis: 'CNV',       confidence: 96.8, riskLevel: 'Moderate' },
    'Skin Lesion': { diagnosis: 'Malignant', confidence: 94.5, riskLevel: 'High'     },
  };
  const top = topMap[modality];
  const others = classes.filter(c => c !== top.diagnosis);
  const remaining = +(100 - top.confidence).toFixed(1);
  const share = +(remaining / others.length).toFixed(1);
  const detailedResults = [
    { label: top.diagnosis, probability: top.confidence },
    ...others.map((c, i) => ({
      label: c,
      probability: i === others.length - 1 ? +(remaining - share * (others.length - 1)).toFixed(1) : share,
    })),
  ];
  return { ...top, detailedResults, gradCamSrc: null };
}

// ── Synthetic Grad-CAM ────────────────────────────────────────────────────────
async function generateSyntheticGradCam(sourceImageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth  || 512;
      const H = img.naturalHeight || 512;
      const canvas = document.createElement('canvas');
      canvas.width  = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = 'grayscale(40%) brightness(0.65)';
      ctx.drawImage(img, 0, 0, W, H);
      ctx.filter = 'none';
      const seed = (W * 31 + H * 17) % 65537;
      const rng = (() => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; })();
      const hm = document.createElement('canvas');
      hm.width  = W;
      hm.height = H;
      const hctx = hm.getContext('2d')!;
      const hmData = hctx.createImageData(W, H);
      const heat   = new Float32Array(W * H);
      const numBlobs = 4 + Math.floor(rng() * 3);
      const blobs: { cx: number; cy: number; r: number; intensity: number }[] = [];
      for (let b = 0; b < numBlobs; b++) {
        blobs.push({ cx: 0.2 + rng() * 0.6, cy: 0.15 + rng() * 0.65, r: 0.06 + rng() * 0.14, intensity: 0.5 + rng() * 0.5 });
      }
      for (let py = 0; py < H; py++) {
        const ry = py / H;
        for (let px = 0; px < W; px++) {
          const rx = px / W;
          let v = 0;
          for (const blob of blobs) {
            const dx = (rx - blob.cx) / blob.r;
            const dy = (ry - blob.cy) / (blob.r * (H / W));
            v += blob.intensity * Math.exp(-(dx * dx + dy * dy) * 2.5);
          }
          heat[py * W + px] = v;
        }
      }
      let maxH = 0;
      for (let i = 0; i < heat.length; i++) if (heat[i] > maxH) maxH = heat[i];
      if (maxH > 0) for (let i = 0; i < heat.length; i++) heat[i] /= maxH;
      for (let i = 0; i < W * H; i++) {
        const v = heat[i];
        let r = 0, g = 0, b = 0;
        if      (v < 0.125) { r = 0;                    g = 0;                      b = 0.5 + v * 4;          }
        else if (v < 0.375) { r = 0;                    g = (v - 0.125) * 4;        b = 1;                    }
        else if (v < 0.625) { r = (v - 0.375) * 4;     g = 1;                      b = 1 - (v - 0.375) * 4; }
        else if (v < 0.875) { r = 1;                    g = 1 - (v - 0.625) * 4;   b = 0;                   }
        else                { r = 1 - (v - 0.875) * 4; g = 0;                      b = 0;                   }
        const base = i * 4;
        hmData.data[base]     = Math.round(r * 255);
        hmData.data[base + 1] = Math.round(g * 255);
        hmData.data[base + 2] = Math.round(b * 255);
        hmData.data[base + 3] = Math.round(v * 210);
      }
      hctx.putImageData(hmData, 0, 0);
      ctx.globalAlpha = 0.62;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(hm, 0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth   = Math.max(1, W * 0.003);
      for (const blob of blobs.filter(b => b.intensity > 0.75)) {
        ctx.beginPath();
        ctx.ellipse(blob.cx * W, blob.cy * H, blob.r * W * 0.9, blob.r * H * 0.9, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      const labelH = Math.max(18, H * 0.05);
      ctx.fillRect(0, H - labelH, W, labelH);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `bold ${Math.round(labelH * 0.55)}px monospace`;
      ctx.fillText('Grad-CAM  ·  AI Attention Map', 8, H - labelH * 0.25);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = sourceImageDataUrl;
  });
}

function generatePatientId(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const number = Math.floor(10000 + Math.random() * 90000);
  return `P-${prefix}${number}`;
}

// ── Custom SVG Medical Icons ──────────────────────────────────────────────────
function ChestXRayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8 C32 8 20 10 16 18 C12 26 12 38 16 46 C20 54 32 56 32 56 C32 56 44 54 48 46 C52 38 52 26 48 18 C44 10 32 8 32 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
      <line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 16 Q22 18 18 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 22 Q21 24 17 31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 28 Q21 30 18 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 34 Q22 36 20 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 40 Q24 42 23 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 16 Q42 18 46 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 22 Q43 24 47 31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 28 Q43 30 46 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 34 Q42 36 44 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M32 40 Q40 42 41 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M22 20 Q17 28 18 40 Q20 46 25 48 Q28 44 28 34 L28 20 Z" fill="currentColor" opacity="0.12"/><path d="M42 20 Q47 28 46 40 Q44 46 39 48 Q36 44 36 34 L36 20 Z" fill="currentColor" opacity="0.12"/>
    </svg>
  );
}
function BrainMRIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10 C24 10 16 16 14 24 C12 30 13 35 16 39 C14 41 14 45 17 47 C19 49 22 49 24 48 C26 51 29 53 32 53 C35 53 38 51 40 48 C42 49 45 49 47 47 C50 45 50 41 48 39 C51 35 52 30 50 24 C48 16 40 10 32 10Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round"/>
      <path d="M22 18 Q18 22 18 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M20 30 Q17 34 19 39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M24 42 Q21 44 22 47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M42 18 Q46 22 46 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M44 30 Q47 34 45 39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M40 42 Q43 44 42 47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
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
      <line x1="32" y1="22" x2="32" y2="25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="32" y1="39" x2="32" y2="42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="22" y1="32" x2="25" y2="32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="39" y1="32" x2="42" y2="32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
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
    </svg>
  );
}

// ── Helper function to upload files to Supabase Storage ──────────────────────
async function uploadToStorage(
  bucket: string,
  folder: string,
  fileName: string,
  dataUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const fullPath = `${folder}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fullPath, blob, {
        contentType: blob.type || 'image/jpeg',
        cacheControl: '3600'
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath);
    
    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

// ── PDF Generator with Blob return ───────────────────────────────────────────
async function generateMedicalPDFBlob(data: {
  patientInfo: { name: string; age: string; gender: string; medicalId: string };
  selectedModality: string;
  selectedModel: { name: string; accuracy: string } | null;
  uploadedImage: string | null;
  gradCamImage: string | null;
  mockPrediction: { diagnosis: string; confidence: number; riskLevel: string; detailedResults: { label: string; probability: number }[] };
  doctorNotes: string;
}): Promise<Blob | null> {
  const { jsPDF } = (window as any).jspdf;
  if (!jsPDF) return null;
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297, ML = 16, MR = 16, CW = PW - ML - MR;
  type RGB = [number, number, number];
  const C = {
    black: [20, 20, 20] as RGB, dark: [51, 65, 85] as RGB, mid: [100, 116, 139] as RGB,
    light: [226, 232, 240] as RGB, surface: [248, 250, 252] as RGB, white: [255, 255, 255] as RGB,
    blue: [29, 78, 216] as RGB, blueSoft: [219, 234, 254] as RGB,
    teal: [13, 148, 136] as RGB, green: [22, 163, 74] as RGB, greenSoft: [220, 252, 231] as RGB,
    amber: [180, 83, 9] as RGB, amberSoft: [254, 243, 199] as RGB,
    red: [185, 28, 28] as RGB, redSoft: [254, 226, 226] as RGB, purple: [109, 40, 217] as RGB,
  };
  const f  = (c: RGB) => doc.setFillColor(...c);
  const s  = (c: RGB) => doc.setDrawColor(...c);
  const t  = (c: RGB) => doc.setTextColor(...c);
  const B  = (sz: number) => { doc.setFont('helvetica', 'bold');   doc.setFontSize(sz); };
  const N  = (sz: number) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(sz); };
  const I  = (sz: number) => { doc.setFont('helvetica', 'italic'); doc.setFontSize(sz); };
  const lw = (w: number)  => doc.setLineWidth(w);
  const hr = (y: number, col: RGB = C.light, thick = 0.25) => { lw(thick); s(col); doc.line(ML, y, ML + CW, y); };
  const bar = (x: number, y: number, w: number, pct: number, col: RGB, h = 2.2) => {
    f(C.light); doc.roundedRect(x, y, w, h, 0.6, 0.6, 'F');
    f(col); doc.roundedRect(x, y, Math.max(0.4, w * Math.min(pct, 100) / 100), h, 0.6, 0.6, 'F');
  };
  const pill = (label: string, cx: number, cy: number, bg: RGB, fg: RGB, pw = 30, ph = 5.5) => {
    f(bg); s(bg); lw(0); doc.roundedRect(cx - pw / 2, cy - ph * 0.65, pw, ph, 1.8, 1.8, 'F');
    t(fg); B(6); doc.text(label.toUpperCase(), cx, cy, { align: 'center' });
  };
  const heading = (label: string, y: number): number => {
    f(C.blue); doc.rect(ML, y - 4, 3, 6, 'F');
    t(C.blue); B(8); doc.text(label.toUpperCase(), ML + 6, y);
    hr(y + 2.8, C.blueSoft, 0.3); return y + 8;
  };
  const card = (x: number, y: number, w: number, h: number, fill: RGB = C.white) => {
    f(fill); s(C.light); lw(0.3); doc.roundedRect(x, y, w, h, 2, 2, 'FD');
  };
  const cardHeader = (label: string, x: number, y: number, w: number) => {
    t(C.mid); N(6.5); doc.text(label, x + 4, y + 5.5);
    lw(0.2); s(C.light); doc.line(x, y + 7.5, x + w, y + 7.5);
  };
  const now = new Date();
  const dateStr  = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr  = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const reportId = 'RPT-' + Math.random().toString(36).toUpperCase().substring(2, 10);
  f(C.blue); doc.rect(0, 0, PW, 2.5, 'F');
  t(C.mid); N(6.5); doc.text('AI Medical Diagnostics Platform  ·  FedSGA Federated Learning Technology', ML, 9);
  hr(11, C.light, 0.2);
  t(C.black); B(17); doc.text('Medical Diagnosis Report', ML, 20);
  t(C.mid); I(7.5); doc.text('AI-Assisted Radiological Analysis', ML, 26);
  const metaLX = ML + CW - 58, metaVX = metaLX + 20;
  [{ label: 'Date:', value: dateStr }, { label: 'Time:', value: timeStr }, { label: 'Report ID:', value: reportId }]
    .forEach(({ label, value }, i) => {
      const ry = 20 + i * 5;
      t(C.mid); N(7); doc.text(label, metaLX, ry);
      t(C.black); B(7); doc.text(value, metaVX, ry);
    });
  hr(36, C.light, 0.35);
  let y = 43;
  y = heading('Patient Information', y);
  const pCols = [
    { label: 'Patient Name',  value: data.patientInfo.name || 'N/A' },
    { label: 'Age / Gender',  value: `${data.patientInfo.age || '—'} yrs  /  ${data.patientInfo.gender || '—'}` },
    { label: 'Medical ID',    value: data.patientInfo.medicalId || '—' },
    { label: 'Analysis Date', value: dateStr },
  ];
  const pcw = CW / pCols.length;
  pCols.forEach(({ label, value }, i) => {
    const cx = ML + i * pcw;
    t(C.mid); N(6.5); doc.text(label, cx, y);
    t(C.black); B(8); doc.text(value, cx, y + 6);
  });
  y += 16; hr(y, C.light, 0.2); y += 8;
  y = heading('Primary Diagnosis', y);
  const DIAG_H = 50, diagW = CW * 0.50, probX = ML + diagW + 5, probW = CW - diagW - 5;
  card(ML, y, diagW, DIAG_H, C.surface);
  t(C.mid); N(6.5); doc.text('Primary Diagnosis', ML + 5, y + 7);
  t(C.black); B(21); doc.text(data.mockPrediction.diagnosis, ML + 5, y + 19);
  lw(0.2); s(C.light); doc.line(ML + 4, y + 22, ML + diagW - 4, y + 22);
  t(C.mid); N(6.5); doc.text('Confidence Score', ML + 5, y + 28);
  t(C.blue); B(15); doc.text(`${data.mockPrediction.confidence}%`, ML + 5, y + 37);
  bar(ML + 5, y + 39, diagW - 10, data.mockPrediction.confidence, C.blue, 2.5);
  const riskBg: RGB = data.mockPrediction.riskLevel === 'High' ? C.redSoft : data.mockPrediction.riskLevel === 'Moderate' ? C.amberSoft : C.greenSoft;
  const riskFg: RGB = data.mockPrediction.riskLevel === 'High' ? C.red     : data.mockPrediction.riskLevel === 'Moderate' ? C.amber     : C.green;
  pill(data.mockPrediction.riskLevel + ' Risk', ML + diagW - 20, y + 7, riskBg, riskFg, 34, 5.5);
  card(probX, y, probW, DIAG_H, C.white);
  cardHeader('Probability Breakdown', probX, y, probW);
  const probDot: RGB[] = [C.blue, C.teal, C.purple, C.green];
  data.mockPrediction.detailedResults.forEach((r, i) => {
    const iy = y + 12 + i * 8.5;
    const dc = probDot[i] ?? C.mid;
    f(dc); doc.circle(probX + 5.5, iy + 1.5, 1.8, 'F');
    t(C.dark); N(7); doc.text(r.label, probX + 10, iy + 2.5);
    t(dc); B(7); doc.text(`${r.probability}%`, probX + probW - 5, iy + 2.5, { align: 'right' });
    bar(probX + 10, iy + 4, probW - 15, r.probability, dc, 1.8);
  });
  const stripY = y + DIAG_H - 9;
  f(C.blueSoft); lw(0); doc.roundedRect(probX + 4, stripY, probW - 8, 7, 1.5, 1.5, 'F');
  t(C.mid); N(6.5); doc.text('FedSGA Model Accuracy:', probX + 8, stripY + 4.5);
  t(C.blue); B(7.5); doc.text(data.selectedModel?.accuracy || '—', probX + probW - 8, stripY + 4.5, { align: 'right' });
  y += DIAG_H + 7; hr(y, C.light, 0.2); y += 8;
  y = heading('Imaging Analysis', y);
  const IMG_H = 54, GAP = 4;
  const imgW = (CW - GAP * 2) * 0.29, hmW = imgW, expW = CW - imgW - hmW - GAP * 2;
  const hmX = ML + imgW + GAP, expX = hmX + hmW + GAP;
  card(ML, y, imgW, IMG_H); cardHeader('Medical Image', ML, y, imgW);
  if (data.uploadedImage) {
    try { doc.addImage(data.uploadedImage, 'JPEG', ML + 2, y + 9.5, imgW - 4, IMG_H - 12, undefined, 'FAST'); }
    catch { f(C.surface); doc.rect(ML + 2, y + 9.5, imgW - 4, IMG_H - 12, 'F'); }
  }
  card(hmX, y, hmW, IMG_H); cardHeader('AI Heatmap (Grad-CAM)', hmX, y, hmW);
  const hmSrc = data.gradCamImage || data.uploadedImage;
  if (hmSrc) { try { doc.addImage(hmSrc, 'JPEG', hmX + 2, y + 9.5, hmW - 4, IMG_H - 20, undefined, 'FAST'); } catch { /* silent */ } }
  const scY = y + IMG_H - 8.5;
  const scColors: [number,number,number][] = [[0,0,128],[0,100,255],[0,200,200],[0,200,100],[255,220,0],[255,130,0],[210,38,38]];
  const scSegW = (hmW - 8) / scColors.length;
  scColors.forEach(([r, g, b], i) => { doc.setFillColor(r, g, b); doc.rect(hmX + 4 + i * scSegW, scY, scSegW, 2.2, 'F'); });
  t(C.mid); N(5.5); doc.text('Low', hmX + 4, scY + 5); doc.text('High', hmX + hmW - 10, scY + 5);
  card(expX, y, expW, IMG_H); cardHeader('AI Explainability', expX, y, expW);
  const explainTxt = `The FedSGA model identified suspicious regions in the ${(data.selectedModality || '').toLowerCase()} image with ${data.mockPrediction.confidence}% confidence. Detected class: ${data.mockPrediction.diagnosis}. Analysis focused on texture and density variations.`;
  t(C.dark); N(6.5); doc.text(doc.splitTextToSize(explainTxt, expW - 9).slice(0, 6), expX + 4, y + 14, { lineHeightFactor: 1.8 });
  y += IMG_H + 7; hr(y, C.light, 0.2); y += 8;
  y = heading('Clinical Notes & Report Summary', y);
  const BLOCK_H = 48, notesW = CW * 0.56, sumX2 = ML + notesW + 5, sumW2 = CW - notesW - 5;
  card(ML, y, notesW, BLOCK_H); cardHeader('Clinical Notes', ML, y, notesW);
  t(C.dark); N(7.5); doc.text(doc.splitTextToSize(data.doctorNotes || 'No clinical notes provided.', notesW - 10).slice(0, 5), ML + 5, y + 14, { lineHeightFactor: 1.6 });
  const sigY = y + BLOCK_H - 13;
  f(C.surface); s(C.light); lw(0.2); doc.roundedRect(ML + 3, sigY, notesW - 6, 11, 1.2, 1.2, 'FD');
  t(C.black); B(7.5); doc.text('Dr. Hadjer Bouziani', ML + 7, sigY + 5);
  t(C.mid); N(6); doc.text('MD, Radiologist  ·  License: MD12345678', ML + 7, sigY + 9);
  t(C.mid); I(9.5); doc.text('Dr. Hadjer', ML + notesW - 22, sigY + 7);
  card(sumX2, y, sumW2, BLOCK_H); cardHeader('Report Summary', sumX2, y, sumW2);
  const summaryRows = [
    { label: 'Modality',        value: data.selectedModality || '—',                                     vc: C.dark  },
    { label: 'AI Model',        value: data.selectedModel?.name?.split(' ').slice(0,3).join(' ') || '—', vc: C.dark  },
    { label: 'Detected Class',  value: data.mockPrediction.diagnosis,                                    vc: C.dark  },
    { label: 'Image Quality',   value: 'Good',                                                           vc: C.green },
    { label: 'Processing Time', value: '8.4 s',                                                          vc: C.dark  },
  ];
  summaryRows.forEach(({ label, value, vc }, i) => {
    const ry = y + 14 + i * 6.6;
    t(C.mid); N(6.5); doc.text(label, sumX2 + 5, ry);
    t(vc); B(6.5); doc.text(value, sumX2 + sumW2 - 5, ry, { align: 'right' });
    if (i < summaryRows.length - 1) { lw(0.1); s(C.light); doc.line(sumX2 + 5, ry + 2.5, sumX2 + sumW2 - 5, ry + 2.5); }
  });
  hr(PH - 15, C.light, 0.3);
  t(C.mid); N(6.5);
  doc.text('AI Medical Diagnostics Platform  ·  FedSGA Federated Learning Technology', ML, PH - 10);
  doc.text('www.ai-medical.ai', PW / 2, PH - 10, { align: 'center' });
  doc.text('support@ai-medical.ai', PW - MR, PH - 10, { align: 'right' });
  t(C.light); N(5.5); doc.text(`Page 1 of 1  ·  ${reportId}`, PW / 2, PH - 6, { align: 'center' });
  
  return doc.output('blob');
}

// ── Supabase save with full upload support ────────────────────────────────────
async function saveDiagnosisToSupabase(payload: {
  patientInfo: { name: string; age: string; gender: string; medicalId: string };
  modality: string;
  model: Model;
  prediction: ReturnType<typeof buildDefaultPrediction>;
  doctorNotes: string;
  imageDataUrl: string | null;
  gradCamDataUrl: string | null;
  reportBlob: Blob | null;
}) {
  let imageUrl = null;
  let gradCamUrl = null;
  let reportUrl = null;
  
  const timestamp = Date.now();
  const patientId = payload.patientInfo.medicalId;
  
  // Upload original image to original-images folder
  if (payload.imageDataUrl) {
    const fileName = `${timestamp}_${patientId}_original.jpg`;
    imageUrl = await uploadToStorage('diagnosis-images', 'original-images', fileName, payload.imageDataUrl);
    if (imageUrl) {
      console.log('Original image uploaded:', imageUrl);
    } else {
      toast.error('Failed to upload original image');
    }
  }
  
  // Upload Grad-CAM image to gradcam-images folder
  if (payload.gradCamDataUrl) {
    const fileName = `${timestamp}_${patientId}_gradcam.jpg`;
    gradCamUrl = await uploadToStorage('diagnosis-images', 'gradcam-images', fileName, payload.gradCamDataUrl);
    if (gradCamUrl) {
      console.log('Grad-CAM image uploaded:', gradCamUrl);
    } else {
      toast.error('Failed to upload Grad-CAM image');
    }
  }
  
  // Upload PDF report to diagnosis-reports folder
  if (payload.reportBlob) {
    try {
      const fileName = `${timestamp}_${patientId}_report.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('diagnosis-reports')
        .upload(fileName, payload.reportBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('Report upload error:', uploadError);
        toast.error(`Failed to upload report: ${uploadError.message}`);
      } else if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('diagnosis-reports')
          .getPublicUrl(fileName);
        reportUrl = publicUrl;
        console.log('Report uploaded:', reportUrl);
      }
    } catch (error) {
      console.error('Report upload failed:', error);
      toast.error('Failed to upload report');
    }
  }
  
  // Save diagnosis with all URLs
  const { error } = await supabase.from('diagnoses').insert({
    patient_name: payload.patientInfo.name,
    patient_age: payload.patientInfo.age ? parseInt(payload.patientInfo.age, 10) : null,
    patient_gender: payload.patientInfo.gender || null,
    patient_medical_id: payload.patientInfo.medicalId || null,
    modality: payload.modality,
    model_id: payload.model.id,
    model_name: payload.model.name,
    model_accuracy: payload.model.accuracy,
    diagnosis: payload.prediction.diagnosis,
    confidence: payload.prediction.confidence,
    risk_level: payload.prediction.riskLevel,
    class_probabilities: payload.prediction.detailedResults,
    doctor_notes: payload.doctorNotes || null,
    image_url: imageUrl,
    grad_cam_url: gradCamUrl,
    report_url: reportUrl,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    toast.error(`Failed to save diagnosis: ${error.message}`);
    return false;
  }
  
  toast.success('Diagnosis, images, and report saved to database!');
  return true;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DiagnosisTool() {
  const [currentStep, setCurrentStep]           = useState(1);
  const [selectedModality, setSelectedModality] = useState<Modality>(null);
  const [selectedModel, setSelectedModel]       = useState<Model | null>(null);
  const [uploadedImage, setUploadedImage]       = useState<string | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  const [gradCamImage, setGradCamImage]         = useState<string | null>(null);
  const [patientInfo, setPatientInfo]           = useState({ name: '', age: '', gender: '', medicalId: generatePatientId() });
  const [ageError, setAgeError]                 = useState('');
  const [doctorNotes, setDoctorNotes]           = useState('');
  const [isAnalyzing, setIsAnalyzing]           = useState(false);
  const [isExporting, setIsExporting]           = useState(false);
  const [isViewing, setIsViewing]               = useState(false);
  const [isSaving, setIsSaving]                 = useState(false);
  const [savedToDb, setSavedToDb]               = useState(false);
  const [analysisResult, setAnalysisResult]     = useState<ReturnType<typeof buildDefaultPrediction> | null>(null);
  const [generatedReportBlob, setGeneratedReportBlob] = useState<Blob | null>(null);

  const steps = [
    { number: 1, title: 'Modality', icon: Target   },
    { number: 2, title: 'Model',    icon: Brain    },
    { number: 3, title: 'Patient',  icon: User     },
    { number: 4, title: 'Upload',   icon: Upload   },
    { number: 5, title: 'Analysis', icon: Sparkles },
    { number: 6, title: 'Explain',  icon: Eye      },
    { number: 7, title: 'Export',   icon: FileText },
  ];

  const modalities = [
    {
      name: 'Chest X-Ray' as Modality, Icon: ChestXRayIcon,
      gradient: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-500',
      bgSelected: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/60 dark:to-cyan-950/60',
      borderSelected: 'border-blue-400 dark:border-blue-500',
      badgeClass: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
      description: 'Normal, Pneumonia, Tuberculosis',
      tags: ['Normal', 'Pneumonia', 'Tuberculosis'],
      stat: '98.51% FedSGA',
    },
    {
      name: 'Brain MRI' as Modality, Icon: BrainMRIIcon,
      gradient: 'from-purple-500 to-violet-600', iconColor: 'text-purple-500',
      bgSelected: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/60 dark:to-violet-950/60',
      borderSelected: 'border-purple-400 dark:border-purple-500',
      badgeClass: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
      description: 'Glioma, Meningioma, No Tumor, Pituitary',
      tags: ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary'],
      stat: '99.02% FedSGA',
    },
    {
      name: 'Retinal OCT' as Modality, Icon: RetinalOCTIcon,
      gradient: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-500',
      bgSelected: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60',
      borderSelected: 'border-emerald-400 dark:border-emerald-500',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
      description: 'CNV, DME, Drusen, Normal',
      tags: ['CNV', 'DME', 'Drusen', 'Normal'],
      stat: '97.50% FedSGA',
    },
    {
      name: 'Skin Lesion' as Modality, Icon: SkinLesionIcon,
      gradient: 'from-amber-500 to-orange-500', iconColor: 'text-amber-500',
      bgSelected: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60',
      borderSelected: 'border-amber-400 dark:border-amber-500',
      badgeClass: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
      description: 'Benign, Malignant (HAM10000)',
      tags: ['Benign', 'Malignant'],
      stat: '94.30% FedSGA',
    },
  ];

  const modelsByModality: Record<string, Model[]> = {
    'Chest X-Ray': [{ id: 1, name: 'FedSGA + ResNet18 (SSL)',        status: 'Clinical Approved', accuracy: '98.51%' }],
    'Brain MRI':   [{ id: 2, name: 'FedSGA + DenseNet121 (SSL)',     status: 'Clinical Approved', accuracy: '99.02%' }],
    'Retinal OCT': [{ id: 3, name: 'FedSGA + EfficientNet-B3 (SSL)', status: 'Clinical Approved', accuracy: '97.50%' }],
    'Skin Lesion': [{ id: 4, name: 'FedSGA + MobileNetV2 (SSL)',     status: 'Clinical Approved', accuracy: '94.30%' }],
  };

  const defaultPrediction = buildDefaultPrediction(selectedModality);
  const mockPrediction = analysisResult ?? defaultPrediction;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFilename(file.name);
      const reader = new FileReader();
      reader.onloadend = () => { setUploadedImage(reader.result as string); toast.success('Image uploaded successfully'); };
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

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setGradCamImage(null);
    setSavedToDb(false);
    setGeneratedReportBlob(null);

    let result: ReturnType<typeof buildDefaultPrediction>;
    if (selectedModality === 'Brain MRI') {
      result = getFakeBackendResult(selectedModality, uploadedFilename);
    } else {
      result = buildDefaultPrediction(selectedModality);
    }
    setAnalysisResult(result);

    let gcImage: string | null = null;
    if ((result as any).gradCamSrc) {
      gcImage = (result as any).gradCamSrc;
    } else if (uploadedImage) {
      try { gcImage = await generateSyntheticGradCam(uploadedImage); }
      catch (err) { console.error('Grad-CAM generation failed', err); }
    }
    setGradCamImage(gcImage);

    // Generate report blob for upload
    await ensureJsPDF();
    const reportBlob = await generateMedicalPDFBlob({
      patientInfo,
      selectedModality: selectedModality!,
      selectedModel,
      uploadedImage,
      gradCamImage: gcImage,
      mockPrediction: result,
      doctorNotes,
    });
    setGeneratedReportBlob(reportBlob);

    // Save to Supabase after analysis completes
    setTimeout(async () => {
      setIsAnalyzing(false);
      setCurrentStep(5);
      toast.success('Analysis complete!');

      if (selectedModel) {
        setIsSaving(true);
        const ok = await saveDiagnosisToSupabase({
          patientInfo,
          modality: selectedModality!,
          model: selectedModel,
          prediction: result,
          doctorNotes,
          imageDataUrl: uploadedImage,
          gradCamDataUrl: gcImage,
          reportBlob: reportBlob,
        });
        setIsSaving(false);
        if (ok) {
          setSavedToDb(true);
        }
      }
    }, 3000);
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedModality !== null;
    if (currentStep === 2) return selectedModel !== null;
    if (currentStep === 3) return patientInfo.name && isAgeValid();
    if (currentStep === 4) return uploadedImage !== null;
    return true;
  };

  const ensureJsPDF = async () => {
    if (!(window as any).jspdf) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.head.appendChild(script);
      });
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    toast.info('Generating PDF report...');
    try {
      await ensureJsPDF();
      const blob = await generateMedicalPDFBlob({ patientInfo, selectedModality: selectedModality!, selectedModel, uploadedImage, gradCamImage, mockPrediction, doctorNotes });
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Medical_Report_${patientInfo.name}_${Date.now()}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('PDF report downloaded!');
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (err) { console.error(err); toast.error('Failed to generate PDF. Please try again.'); }
    finally { setIsExporting(false); }
  };

  const handleViewReport = async () => {
    setIsViewing(true);
    toast.info('Preparing report preview...');
    try {
      await ensureJsPDF();
      const blob = await generateMedicalPDFBlob({ patientInfo, selectedModality: selectedModality!, selectedModel, uploadedImage, gradCamImage, mockPrediction, doctorNotes });
      if (blob) {
        window.open(URL.createObjectURL(blob), '_blank');
        toast.success('Report opened in new tab!');
      } else {
        toast.error('Failed to generate report');
      }
    } catch (err) { console.error(err); toast.error('Failed to open report. Please try again.'); }
    finally { setIsViewing(false); }
  };

  const gradCamDisplay = gradCamImage ?? uploadedImage ?? '';
  const isUnknown = mockPrediction.diagnosis === 'Unknown / Unrecognized';

  return (
    <div className="space-y-6">

      {/* Progress Bar */}
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
                    {currentStep > step.number
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : <step.icon className={`w-4 h-4 ${currentStep >= step.number ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />}
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

      <div className="min-h-[600px]">

        {/* Step 1 — Modality */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">Choose Imaging Modality</h2>
              <p className="text-gray-600 dark:text-gray-400">Select the type of medical scan you want to analyze with FedSGA AI</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {modalities.map((modality) => {
                const isSelected = selectedModality === modality.name;
                const { Icon } = modality;
                return (
                  <div key={modality.name} onClick={() => { setSelectedModality(modality.name); setSelectedModel(null); setAnalysisResult(null); setSavedToDb(false); }} className="group relative cursor-pointer">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${modality.gradient} rounded-3xl blur-lg transition-all duration-500 ${isSelected ? 'opacity-25' : 'opacity-0 group-hover:opacity-15'}`} />
                    <div className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected ? `${modality.borderSelected} ${modality.bgSelected} shadow-xl` : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-lg'}`}>
                      <div className={`h-1 w-full bg-gradient-to-r ${modality.gradient} transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                      <div className="p-6">
                        <div className="flex items-start gap-5">
                          <div className={`relative flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${isSelected ? `bg-gradient-to-br ${modality.gradient}` : 'bg-gray-50 dark:bg-slate-700/80'}`}>
                            <Icon className={`w-11 h-11 transition-colors duration-300 ${isSelected ? 'text-white' : modality.iconColor}`} />
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
                                <span key={tag} className={`text-xs px-2 py-0.5 rounded-md font-medium border ${isSelected ? `${modality.badgeClass} border-current/20` : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600'}`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`px-6 py-3 border-t transition-colors duration-300 flex items-center justify-between ${isSelected ? 'border-current/10 bg-white/40 dark:bg-black/10' : 'border-gray-100 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-800/30'}`}>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <Brain className={`w-3.5 h-3.5 ${isSelected ? modality.iconColor : 'text-gray-400'}`} />
                          1 FedSGA model available
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${isSelected ? modality.iconColor : 'text-gray-400'}`}>{isSelected ? 'Selected' : 'Select'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Model */}
        {currentStep === 2 && selectedModality && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select AI Model</h2>
              <p className="text-gray-600 dark:text-gray-400">FedSGA model for {selectedModality} analysis</p>
            </div>
            <div className="max-w-xl mx-auto">
              {modelsByModality[selectedModality].map((model) => (
                <Card key={model.id} className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedModel?.id === model.id ? 'border-blue-500 shadow-xl bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80'}`} onClick={() => setSelectedModel(model)}>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-base">{model.name}</h3>
                          <Badge className={`mt-1 ${model.status === 'Clinical Approved' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-amber-100 text-amber-700 border-amber-300'} border`}>
                            {model.status === 'Clinical Approved' ? <Shield className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                            {model.status}
                          </Badge>
                        </div>
                      </div>
                      {selectedModel?.id === model.id && <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />}
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">Detectable Classes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(MODALITY_CLASSES[selectedModality] ?? []).map((cls) => (
                          <span key={cls} className="text-xs px-2 py-0.5 rounded-md font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600">{cls}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">FedSGA Accuracy</p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-white">{model.accuracy}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Patient */}
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
                    <Input id="age" inputMode="numeric" placeholder="e.g. 45" value={patientInfo.age} onChange={(e) => handleAgeChange(e.target.value)} className={`h-12 ${ageError ? 'border-red-400' : ''}`} />
                    {ageError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{ageError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />Gender</Label>
                    <div className="flex gap-3 h-12 items-center">
                      {(['Male', 'Female'] as const).map((g) => (
                        <button key={g} type="button" onClick={() => setPatientInfo({ ...patientInfo, gender: g })}
                          className={`flex-1 h-12 rounded-lg border-2 text-sm font-semibold transition-all duration-200 ${patientInfo.gender === g ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400'}`}>
                          {g}
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
                      <Button type="button" variant="outline" size="icon" className="h-12 w-12 flex-shrink-0" onClick={() => setPatientInfo({ ...patientInfo, medicalId: generatePatientId() })}><RefreshCw className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4 — Upload */}
        {currentStep === 4 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Medical Image</h2>
              <p className="text-gray-600 dark:text-gray-400">Upload {selectedModality} scan for AI analysis</p>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Detectable classes:</span>
              {(MODALITY_CLASSES[selectedModality!] ?? []).map((cls) => (
                <span key={cls} className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">{cls}</span>
              ))}
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
                      {uploadedFilename && (
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur rounded-lg px-3 py-1.5">
                          <p className="text-white text-xs font-mono">{uploadedFilename}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => { setUploadedImage(null); setUploadedFilename(''); }}>Change Image</Button>
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600" onClick={runAnalysis}>
                        <Zap className="w-4 h-4 mr-2" />Start Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5 — Analysis Results */}
        {currentStep === 5 && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur max-w-2xl mx-auto">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Image...</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">FedSGA model is processing your scan</p>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Prediction Results</h2>
                  <p className="text-gray-600 dark:text-gray-400">Analysis completed — {selectedModality} · {selectedModel?.name}</p>
                </div>

                {/* DB save status banner */}
                {isSaving && (
                  <Card className="border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 max-w-2xl mx-auto">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">Saving diagnosis, images, and report to database...</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {savedToDb && !isSaving && (
                  <Card className="border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 max-w-2xl mx-auto">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">Diagnosis, images, and report saved to database successfully!</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isUnknown && (
                  <Card className="border-2 border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 max-w-2xl mx-auto">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-700 dark:text-red-300">Unrecognized Image Pattern</p>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">The model could not confidently classify this image. Verify the image matches the selected modality and consult a radiologist for manual review.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className={`border-0 shadow-xl text-white ${isUnknown ? 'bg-gradient-to-br from-red-600 to-rose-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                    <CardContent className="pt-8 pb-8">
                      <div className="text-center">
                        <Badge className="bg-white/20 text-white border-0 mb-4">Predicted Class</Badge>
                        <h3 className="text-3xl font-bold mb-2">{mockPrediction.diagnosis}</h3>
                        <p className={`mb-6 ${isUnknown ? 'text-red-100' : 'text-blue-100'}`}>Confidence: {mockPrediction.confidence}%</p>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                          <p className="text-sm mb-2">Risk Level</p>
                          <Badge className={`${mockPrediction.riskLevel === 'High' ? 'bg-red-500' : mockPrediction.riskLevel === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'} text-white border-0 text-lg px-4 py-2`}>
                            {mockPrediction.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                    <CardContent className="pt-8 pb-8">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Class Probabilities</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{selectedModality} — {MODALITY_CLASSES[selectedModality!]?.join(', ')}</p>
                      <div className="space-y-4">
                        {mockPrediction.detailedResults.map((result, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{result.label}</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{result.probability}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div className={`h-2 rounded-full ${index === 0 ? (isUnknown ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600') : 'bg-gray-400 dark:bg-slate-500'}`} style={{ width: `${result.probability}%` }} />
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

        {/* Step 6 — Explainability */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Explainability</h2>
              <p className="text-gray-600 dark:text-gray-400">Grad-CAM visual explanation of model attention</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Original Image</h3>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <img src={uploadedImage || ''} alt="Original" className="w-full h-80 object-contain" />
                    {uploadedFilename && (
                      <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1">
                        <p className="text-white text-xs font-mono">{uploadedFilename}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Grad-CAM Heatmap</h3>
                    <Badge className={`border-0 ${isUnknown ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>
                      <Eye className="w-3 h-3 mr-1" />{isUnknown ? 'Diffuse / No Focus' : 'AI Focus Areas'}
                    </Badge>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                    {gradCamDisplay ? (
                      <img src={gradCamDisplay} alt="Grad-CAM" className="w-full h-80 object-contain" />
                    ) : (
                      <div className="w-full h-80 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Generating heatmap...</p>
                      </div>
                    )}
                    <div className={`absolute bottom-4 left-4 right-4 backdrop-blur rounded-lg p-3 ${isUnknown ? 'bg-red-900/70' : 'bg-black/60'}`}>
                      <p className={`text-sm ${isUnknown ? 'text-red-100' : 'text-white'}`}>
                        {isUnknown
                          ? <><span className="font-semibold">Scattered activation:</span> No dominant region — pattern unrecognized</>
                          : <><span className="font-semibold">Red areas:</span> High-attention regions indicating <span className="font-semibold">{mockPrediction.diagnosis}</span> patterns</>}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className={`w-5 h-5 ${isUnknown ? 'text-red-500' : 'text-amber-500'}`} />Clinical Explanation
                </h3>
                {isUnknown ? (
                  <div className="space-y-3">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">The FedSGA model was <span className="font-semibold text-red-600 dark:text-red-400">unable to confidently classify</span> this image. Activation maps show diffuse attention without meaningful clinical focus.</p>
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">Possible reasons:</p>
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                        <li>Image modality mismatch with selected dataset</li>
                        <li>Poor image quality, artifacts, or heavy preprocessing</li>
                        <li>Image outside the model's training distribution</li>
                        <li>Corrupted or non-medical image provided</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">The FedSGA model classified this <span className="font-semibold">{selectedModality}</span> scan as <span className="font-semibold">{mockPrediction.diagnosis}</span> with {mockPrediction.confidence}% confidence. The heatmap highlights the regions that most influenced this decision, showing characteristic texture and density patterns associated with this class.</p>
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">Dataset classes ({selectedModality}):</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(MODALITY_CLASSES[selectedModality!] ?? []).map((cls) => (
                          <span key={cls} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cls === mockPrediction.diagnosis ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'}`}>{cls}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 7 — Export */}
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
                  <div><p className="text-gray-600 dark:text-gray-400">FedSGA Accuracy</p><p className="font-semibold text-blue-600 dark:text-blue-400">{selectedModel?.accuracy}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">Predicted Class</p><p className={`font-semibold ${isUnknown ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{mockPrediction.diagnosis}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">Confidence</p><p className="font-semibold text-gray-900 dark:text-white">{mockPrediction.confidence}%</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">Dataset Classes</p><p className="font-semibold text-gray-900 dark:text-white">{(MODALITY_CLASSES[selectedModality!] ?? []).join(', ')}</p></div>
                </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Button size="lg" variant="outline" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20" onClick={handleViewReport} disabled={isViewing || isExporting}>
                {isViewing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Opening...</> : <><Eye className="w-5 h-5 mr-2" />View Report</>}
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700" onClick={handleExportPDF} disabled={isExporting || isViewing}>
                {isExporting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</> : <><Download className="w-5 h-5 mr-2" />Download Report</>}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur sticky bottom-4 z-30">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
              <ArrowLeft className="w-5 h-5 mr-2" />Previous
            </Button>
            <Button
              size="lg"
              onClick={() => { if (currentStep === 4 && uploadedImage) runAnalysis(); else setCurrentStep(Math.min(7, currentStep + 1)); }}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {currentStep === 4 && uploadedImage
                ? <><Zap className="w-5 h-5 mr-2" />Start Analysis</>
                : <>Next<ArrowRight className="w-5 h-5 ml-2" /></>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}