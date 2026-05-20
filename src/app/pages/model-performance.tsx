import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useCases } from '../context/case-context';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, CheckCircle, AlertCircle, Zap, Target, ArrowLeft, Brain, ChevronDown, Filter } from 'lucide-react';

// Modality-specific data
const modalityPerformanceData = {
  'Chest X-Ray': {
    accuracyTrend: [
      { month: 'Oct', accuracy: 89.5 },
      { month: 'Nov', accuracy: 91.2 },
      { month: 'Dec', accuracy: 92.8 },
      { month: 'Jan', accuracy: 93.5 },
      { month: 'Feb', accuracy: 94.0 },
      { month: 'Mar', accuracy: 94.2 },
    ],
    overallAccuracy: 94.2,
    improvementRate: 5.2,
    casesAnalyzed: 1250,
    capabilities: [
      { title: 'Multi-Modal Analysis', desc: 'Supports X-rays and CT scans', color: 'blue' },
      { title: 'Explainable AI', desc: 'Grad-CAM visualization for pneumonia detection', color: 'purple' },
      { title: 'Quality Assessment', desc: 'Automatic image quality detection', color: 'green' },
      { title: 'Continuous Learning', desc: 'Regular updates with new chest X-ray data', color: 'amber' },
    ],
  },
  'Brain MRI': {
    accuracyTrend: [
      { month: 'Oct', accuracy: 87.0 },
      { month: 'Nov', accuracy: 89.5 },
      { month: 'Dec', accuracy: 91.0 },
      { month: 'Jan', accuracy: 93.0 },
      { month: 'Feb', accuracy: 94.8 },
      { month: 'Mar', accuracy: 96.5 },
    ],
    overallAccuracy: 96.5,
    improvementRate: 8.3,
    casesAnalyzed: 890,
    capabilities: [
      { title: 'Multi-Modal Analysis', desc: 'Supports MRI and CT scans', color: 'blue' },
      { title: 'Explainable AI', desc: 'Tumor segmentation and localization', color: 'purple' },
      { title: 'Quality Assessment', desc: 'Motion artifact detection', color: 'green' },
      { title: 'Continuous Learning', desc: 'Regular updates with brain tumor data', color: 'amber' },
    ],
  },
  'Retinal OCT': {
    accuracyTrend: [
      { month: 'Oct', accuracy: 91.0 },
      { month: 'Nov', accuracy: 92.5 },
      { month: 'Dec', accuracy: 94.0 },
      { month: 'Jan', accuracy: 95.5 },
      { month: 'Feb', accuracy: 96.8 },
      { month: 'Mar', accuracy: 97.5 },
    ],
    overallAccuracy: 97.5,
    improvementRate: 7.1,
    casesAnalyzed: 560,
    capabilities: [
      { title: 'Multi-Modal Analysis', desc: 'Supports OCT and Fundus imaging', color: 'blue' },
      { title: 'Explainable AI', desc: 'Retinal layer segmentation', color: 'purple' },
      { title: 'Quality Assessment', desc: 'Image clarity assessment', color: 'green' },
      { title: 'Continuous Learning', desc: 'Regular updates with retinal disease data', color: 'amber' },
    ],
  },
  'Skin Lesion': {
    accuracyTrend: [
      { month: 'Oct', accuracy: 85.0 },
      { month: 'Nov', accuracy: 87.5 },
      { month: 'Dec', accuracy: 89.0 },
      { month: 'Jan', accuracy: 91.2 },
      { month: 'Feb', accuracy: 93.0 },
      { month: 'Mar', accuracy: 94.2 },
    ],
    overallAccuracy: 94.2,
    improvementRate: 9.8,
    casesAnalyzed: 2340,
    capabilities: [
      { title: 'Multi-Modal Analysis', desc: 'Supports dermoscopy and clinical images', color: 'blue' },
      { title: 'Explainable AI', desc: 'Lesion boundary detection', color: 'purple' },
      { title: 'Quality Assessment', desc: 'Artifact and lighting detection', color: 'green' },
      { title: 'Continuous Learning', desc: 'Regular updates with skin lesion data', color: 'amber' },
    ],
  },
};

const modalityList = [
  { id: 'Chest X-Ray', iconColor: 'text-blue-500', dotColor: 'bg-blue-500' },
  { id: 'Brain MRI', iconColor: 'text-purple-500', dotColor: 'bg-purple-500' },
  { id: 'Retinal OCT', iconColor: 'text-green-500', dotColor: 'bg-green-500' },
  { id: 'Skin Lesion', iconColor: 'text-amber-500', dotColor: 'bg-amber-500' },
];

// Modality Dropdown Component
function ModalityDropdown({ selected, onChange }: { selected: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getSelectedColor = () => {
    const found = modalityList.find(m => m.id === selected);
    return found?.iconColor || 'text-blue-500';
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px]"
      >
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <Brain className={`w-5 h-5 flex-shrink-0 ${getSelectedColor()}`} />
        <span className="font-semibold flex-1 text-left text-gray-800 dark:text-gray-100 text-sm">{selected}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
          <div className="p-1.5">
            {modalityList.map((m) => (
              <button
                key={m.id}
                onClick={() => { onChange(m.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left ${
                  selected === m.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Brain className={`w-5 h-5 ${m.iconColor}`} />
                <span className={`flex-1 font-medium text-sm ${
                  selected === m.id
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {m.id}
                </span>
                {selected === m.id && (
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ModelPerformance() {
  const navigate = useNavigate();
  const { modelMetrics, cases } = useCases();
  const [selectedModality, setSelectedModality] = useState<string>('Chest X-Ray');

  const currentData = modalityPerformanceData[selectedModality as keyof typeof modalityPerformanceData];

  // Cases by type based on selected modality
  const casesByType = [
    { type: 'X-Ray', count: cases.filter(c => c.imageType === 'xray').length || 3 },
    { type: 'Skin', count: cases.filter(c => c.imageType === 'skin').length || 2 },
    { type: 'Retina', count: cases.filter(c => c.imageType === 'retina').length || 1 },
    { type: 'CT', count: cases.filter(c => c.imageType === 'ct').length || 0 },
    { type: 'MRI', count: cases.filter(c => c.imageType === 'mri').length || 0 },
  ].filter(item => item.count > 0);

  const isRecentlyUpdated = () => {
    const lastUpdate = new Date(modelMetrics.lastUpdated);
    const daysSince = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince <= 30;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Custom tooltip for dark mode
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-3">
          <p className="text-gray-900 dark:text-white font-semibold">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Accuracy: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-3">
          <p className="text-gray-900 dark:text-white font-semibold">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Cases: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const getCapabilityColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'purple': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
      case 'green': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'amber': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
      default: return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Page Header with Modality Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Model Insights</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">AI model performance and accuracy metrics</p>
        </div>
        <ModalityDropdown selected={selectedModality} onChange={setSelectedModality} />
      </div>

      {/* Model Update Banner */}
      {isRecentlyUpdated() && (
        <Card className="border-blue-300 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Model Recently Updated</p>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Latest version v2.3.1 deployed on {new Date(modelMetrics.lastUpdated).toLocaleDateString()} 
                  with improved accuracy on rare cases for {selectedModality}.
                </p>
              </div>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white">v2.3.1</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics - Dynamic based on selected modality */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge variant="default" className="gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                +{currentData.improvementRate}%
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Overall Accuracy</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">{currentData.overallAccuracy}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">For {selectedModality}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Cases Analyzed</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">{currentData.casesAnalyzed.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">For {selectedModality}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Cases</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">{cases.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">In your history</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Improvement Rate</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">{currentData.improvementRate}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Since last update</p>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy Trend Chart - Dynamic based on selected modality */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Accuracy Improvement Trend — {selectedModality}</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Model performance has improved by {currentData.improvementRate}% over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={currentData.accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                className="dark:[&_tspan]:fill-gray-400"
                style={{ fontSize: '13px', fontWeight: 500 }}
              />
              <YAxis 
                domain={[85, 100]} 
                stroke="#6b7280" 
                className="dark:[&_tspan]:fill-gray-400"
                style={{ fontSize: '13px', fontWeight: 500 }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cases Distribution and Capabilities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cases by Type */}
        <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Cases by Image Type</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Distribution of your analyzed cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casesByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="type" 
                  stroke="#6b7280" 
                  className="dark:[&_tspan]:fill-gray-400"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  className="dark:[&_tspan]:fill-gray-400"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Capabilities - Dynamic based on selected modality */}
        <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Model Capabilities — {selectedModality}</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              What the AI can do for this modality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentData.capabilities.map((capability, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 ${getCapabilityColor(capability.color)} rounded-lg`}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{capability.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{capability.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-gradient-to-br from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Understanding the Metrics</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            What these numbers mean for your practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Decision Support Tool</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                AI predictions should always be confirmed with clinical examination and additional diagnostic tests. 
                This tool is designed to assist, not replace, professional medical judgment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Continuous Improvement</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Model performance has improved by {currentData.improvementRate}% over the last updates. The system is regularly updated 
                with new training data to maintain high accuracy across diverse cases for {selectedModality}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}