import { useParams, Link } from 'react-router';
import { useCases } from '../context/case-context';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { HeatmapVisualization } from '../components/heatmap-visualization';
import { SimilarCasesPanel } from '../components/similar-cases-panel';
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  Calendar,
  Shield,
  Brain,
  Stethoscope,
  Clock,
  ChevronRight,
  Zap,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  RotateCw,
  ImageDown,
  Microscope,
  CheckCircle2,
  BarChart3,
  ScanEye,
  Image,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useRef } from 'react';

/* ─── Lightbox Component ─────────────────────────── */
function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const rotate = () => setRotation((r) => (r + 90) % 360);
  const reset = () => { setZoom(1); setRotation(0); };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `scan-${Date.now()}.jpg`;
    link.click();
    toast.success('Image downloaded');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
        <span className="text-white/60 text-sm font-medium">{alt}</span>
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" title="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white/70 text-sm font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" title="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button onClick={rotate} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" title="Rotate">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={reset} className="px-3 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs font-medium transition-colors">
            Reset
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button onClick={downloadImage} className="w-9 h-9 rounded-lg bg-blue-500/30 hover:bg-blue-500/50 flex items-center justify-center text-blue-300 transition-colors" title="Download">
            <ImageDown className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white hover:text-red-300 transition-colors ml-2" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transition: 'transform 0.2s ease', maxWidth: '100%', cursor: zoom > 1 ? 'grab' : 'default' }}
          className="rounded-lg shadow-2xl"
          draggable={false}
        />
      </div>
      <div className="text-center pb-4 text-white/30 text-xs">Click outside to close • Use controls above</div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────── */
export function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { getCaseById } = useCases();
  const caseData = id ? getCaseById(id) : null;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'clinical'>('heatmap');
  // NEW: toggle between original scan and Grad-CAM heatmap inside the image card
  const [imageView, setImageView] = useState<'original' | 'gradcam'>('original');

  if (!caseData) {
    return (
      <div className="max-w-6xl mx-auto min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <Microscope className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-900 dark:text-white font-semibold">Case not found</p>
        <Link to="/history">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Button>
        </Link>
      </div>
    );
  }

  const downloadReport = () => toast.success('Report downloaded successfully!');
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = caseData.imageUrl;
    link.download = `scan-${caseData.patientId}-${Date.now()}.jpg`;
    link.click();
    toast.success('Image downloaded');
  };

  const conf = caseData.confidence;
  const confGradient =
    conf >= 90 ? 'from-emerald-500 to-teal-500'
    : conf >= 75 ? 'from-blue-500 to-indigo-500'
    : 'from-amber-500 to-orange-500';

  const confText =
    conf >= 90 ? 'text-emerald-600 dark:text-emerald-400'
    : conf >= 75 ? 'text-blue-600 dark:text-blue-400'
    : 'text-amber-600 dark:text-amber-400';

  const confRing =
    conf >= 90 ? 'ring-emerald-200 dark:ring-emerald-800'
    : conf >= 75 ? 'ring-blue-200 dark:ring-blue-800'
    : 'ring-amber-200 dark:ring-amber-800';

  const tabs = ['heatmap', 'clinical'] as const;

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          src={caseData.imageUrl}
          alt={`${caseData.imageType.toUpperCase()} — ${caseData.diagnosis}`}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-5 pb-16">

        {/* ── Nav bar ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/history">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-9">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <span>Cases</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-700 dark:text-gray-200 font-medium">{caseData.patientId}</span>
            </div>
          </div>
          <Button
            onClick={downloadReport}
            size="sm"
            className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 h-9"
          >
            <Download className="w-3.5 h-3.5" /> Download Report
          </Button>
        </div>

        {/* ── HERO ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 px-6 py-5 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTQwIDAgTDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-60" />
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-600/10 to-transparent" />
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge className="bg-white/10 text-white border-white/15 border text-[11px] px-2 py-0.5">
                  {caseData.imageType.toUpperCase()}
                </Badge>
                <Badge className={`text-[11px] px-2 py-0.5 border ${
                  caseData.imageQuality === 'good'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                }`}>
                  {caseData.imageQuality} quality
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-white truncate">{caseData.diagnosis}</h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span>Patient <span className="text-slate-200 font-medium">{caseData.patientId}</span></span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(caseData.date).toLocaleString()}</span>
                <span>·</span>
                <span className="font-mono text-slate-300">{caseData.modelVersion}</span>
              </div>
            </div>
            <div className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border-2 ring-4 ${confRing} border-transparent`}>
              <span className={`text-2xl font-bold ${confText}`}>{conf}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">conf.</span>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* LEFT: Image with toggle + Predictions */}
          <div className="lg:col-span-3 space-y-5">

            {/* ── Medical Image Card with Original / Grad-CAM toggle ── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg overflow-hidden">

              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">Medical Image</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{caseData.imageType.toUpperCase()}</span>
                </div>

                {/* View toggle pill */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setImageView('original')}
                    className={`flex items-center gap-1.5 px-3 h-7 text-xs font-semibold rounded-md transition-all ${
                      imageView === 'original'
                        ? 'bg-white dark:bg-slate-600 text-gray-800 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <Image className="w-3 h-3" /> Original
                  </button>
                  <button
                    onClick={() => setImageView('gradcam')}
                    className={`flex items-center gap-1.5 px-3 h-7 text-xs font-semibold rounded-md transition-all ${
                      imageView === 'gradcam'
                        ? 'bg-white dark:bg-slate-600 text-gray-800 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> Grad-CAM
                    <Badge className="ml-0.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border-0 text-[9px] px-1.5 py-0">XAI</Badge>
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-1.5 px-2.5 h-7 text-xs font-medium rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ImageDown className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 h-7 text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Open
                  </button>
                </div>
              </div>

              {/* Image canvas — switches between original and heatmap */}
              <div className="relative bg-slate-950" style={{ minHeight: '280px' }}>
                {imageView === 'original' ? (
                  <div className="relative group cursor-pointer" onClick={() => setLightboxOpen(true)}>
                    <img
                      src={caseData.imageUrl}
                      alt={caseData.diagnosis}
                      className="w-full object-cover"
                      style={{ maxHeight: '320px', objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
                        <ZoomIn className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">Click to zoom</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    {/* Grad-CAM legend bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5">
                        <ScanEye className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-xs text-slate-400 font-medium">AI attention map</span>
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 ml-auto justify-end">
                        {[
                          { color: 'bg-blue-400', label: 'Low' },
                          { color: 'bg-yellow-400', label: 'Med' },
                          { color: 'bg-red-500', label: 'High' },
                        ].map(({ color, label }) => (
                          <div key={label} className="flex items-center gap-1">
                            <div className={`w-5 h-2.5 rounded-sm ${color}`} />
                            <span className="text-[10px] text-slate-500">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden">
                      <HeatmapVisualization
                        imageUrl={caseData.imageUrl}
                        heatmapData={caseData.heatmapData}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(caseData.date).toLocaleDateString()}
                </div>
                <span className="text-gray-300 dark:text-slate-600">·</span>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${
                  caseData.imageQuality === 'good' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {caseData.imageQuality} quality
                </div>
                {imageView === 'gradcam' && (
                  <>
                    <span className="text-gray-300 dark:text-slate-600">·</span>
                    <span className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Grad-CAM active
                    </span>
                  </>
                )}
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 font-mono">{caseData.modelVersion}</span>
              </div>
            </div>

            {/* Confidence Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">Confidence Breakdown</span>
              </div>
              <div className="p-4 grid sm:grid-cols-2 gap-3">
                {caseData.allPredictions.map((pred, idx) => {
                  const isPrimary = pred.class === caseData.diagnosis;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        isPrimary
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                          : 'bg-gray-50 dark:bg-slate-700/30 border-gray-100 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold truncate mr-2 ${
                          isPrimary ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {pred.class}
                        </span>
                        <span className={`text-xs font-bold flex-shrink-0 ${
                          isPrimary ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {pred.confidence}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isPrimary
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                              : 'bg-gray-300 dark:bg-slate-500'
                          }`}
                          style={{ width: `${pred.confidence}%`, transition: 'width 0.6s ease' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Diagnosis + Info + Explanation */}
          <div className="lg:col-span-2 space-y-5">

            {/* Diagnosis card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${confGradient}`} />
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">Diagnosis</span>
                </div>
                <div className={`p-4 rounded-xl border ${
                  conf >= 90
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : conf >= 75
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                }`}>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    {caseData.diagnosis}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className={`text-xs border-0 text-white bg-gradient-to-r ${confGradient}`}>
                      {conf}% confidence
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {caseData.imageType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {caseData.uncertaintyWarning && (
                  <Alert className="border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-xl py-3">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300 text-xs font-semibold">Warning</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">
                      {caseData.uncertaintyWarning}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Case info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">Case Information</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-slate-700">
                {[
                  { label: 'Patient ID', value: caseData.patientId, mono: true },
                  {
                    label: 'Image Quality',
                    el: (
                      <Badge className={`text-xs capitalize ${
                        caseData.imageQuality === 'good'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                      }`}>
                        {caseData.imageQuality}
                      </Badge>
                    ),
                  },
                  { label: 'Model', value: caseData.modelVersion, mono: true },
                  { label: 'Date', value: new Date(caseData.date).toLocaleDateString() },
                ].map(({ label, value, mono, el }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
                    {el ?? (
                      <span className={`text-xs font-semibold text-gray-800 dark:text-gray-200 ${mono ? 'font-mono' : ''}`}>
                        {value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabbed: Heatmap guide / Clinical notes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-100 dark:border-slate-700">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold transition-colors capitalize ${
                      activeTab === tab
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab === 'heatmap' ? 'Heatmap Guide' : 'Clinical Notes'}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {activeTab === 'heatmap' ? (
                  <div className="space-y-3">
                    {/* Quick shortcut to switch to Grad-CAM view */}
                    <button
                      onClick={() => setImageView('gradcam')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        imageView === 'gradcam'
                          ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                          : 'bg-gray-50 dark:bg-slate-700/40 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:border-rose-200 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                      {imageView === 'gradcam' ? 'Grad-CAM view is active ✓' : 'Click to switch to Grad-CAM view →'}
                    </button>
                    <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className="w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 flex-shrink-0" />
                      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                        <span className="font-semibold">Red/warm areas</span> show where the AI focused when detecting{' '}
                        <span className="font-semibold">{caseData.diagnosis.toLowerCase()}</span>. These regions had the
                        strongest influence on the final prediction.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { color: 'bg-red-500', label: 'High attention' },
                        { color: 'bg-yellow-400', label: 'Medium' },
                        { color: 'bg-blue-400', label: 'Low attention' },
                      ].map(({ color, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className={`w-6 h-3 rounded-sm ${color}`} />
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative p-3 bg-gray-50 dark:bg-slate-700/40 rounded-xl border border-gray-100 dark:border-slate-600">
                      <div className="absolute top-3 left-3 w-0.5 h-6 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-3.5">
                        {caseData.clinicalExplanation}
                      </p>
                    </div>
                    <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                        This is a decision support tool. Always confirm with clinical examination and patient history.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Similar Cases ── */}
        {caseData.similarCases && caseData.similarCases.length > 0 && (
          <SimilarCasesPanel cases={caseData.similarCases} />
        )}
      </div>
    </>
  );
}