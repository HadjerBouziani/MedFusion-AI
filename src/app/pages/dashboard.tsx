import { useState, useRef, useEffect } from 'react';
import { useCases } from '../context/case-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Activity,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  Brain,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Zap,
  Target,
  Bell,
  ChevronDown,
  Layers
} from 'lucide-react';

// ── per-modality data ──────────────────────────────────────────────────────────
const modalityData = {
  'Chest X-Ray': {
    models: ['ResNet18 SSL-FL v2.1', 'DenseNet121 v1.8'],
    accuracyHistory: [
      { month: 'Oct', accuracy: 89.5 },
      { month: 'Nov', accuracy: 91.2 },
      { month: 'Dec', accuracy: 92.8 },
      { month: 'Jan', accuracy: 93.5 },
      { month: 'Feb', accuracy: 94.0 },
      { month: 'Mar', accuracy: 94.2 },
    ],
    avgAccuracy: 97.0,
    caseTypes: [
      { name: 'X-Ray', value: 42, color: '#3b82f6' },
      { name: 'CT Scan', value: 18, color: '#10b981' },
    ],
  },
  'Brain MRI': {
    models: ['EfficientNetV2 v1.4', 'ViT-Base v1.1'],
    accuracyHistory: [
      { month: 'Oct', accuracy: 87.0 },
      { month: 'Nov', accuracy: 89.5 },
      { month: 'Dec', accuracy: 91.0 },
      { month: 'Jan', accuracy: 93.0 },
      { month: 'Feb', accuracy: 94.8 },
      { month: 'Mar', accuracy: 96.5 },
    ],
    avgAccuracy: 98.2,
    caseTypes: [
      { name: 'MRI', value: 35, color: '#8b5cf6' },
      { name: 'CT Scan', value: 12, color: '#10b981' },
    ],
  },
  'Retinal OCT': {
    models: ['DenseNet121 SSL-FL v2.0'],
    accuracyHistory: [
      { month: 'Oct', accuracy: 91.0 },
      { month: 'Nov', accuracy: 92.5 },
      { month: 'Dec', accuracy: 94.0 },
      { month: 'Jan', accuracy: 95.5 },
      { month: 'Feb', accuracy: 96.8 },
      { month: 'Mar', accuracy: 97.5 },
    ],
    avgAccuracy: 97.5,
    caseTypes: [
      { name: 'OCT', value: 28, color: '#10b981' },
      { name: 'Fundus', value: 9, color: '#f59e0b' },
    ],
  },
  'Skin Lesion': {
    models: ['MobileNetV2 SSL-FL v2.5', 'ResNet50 v2.0', 'EfficientNetB4 v1.3'],
    accuracyHistory: [
      { month: 'Oct', accuracy: 85.0 },
      { month: 'Nov', accuracy: 87.5 },
      { month: 'Dec', accuracy: 89.0 },
      { month: 'Jan', accuracy: 91.2 },
      { month: 'Feb', accuracy: 93.0 },
      { month: 'Mar', accuracy: 94.2 },
    ],
    avgAccuracy: 96.5,
    caseTypes: [
      { name: 'Dermoscopy', value: 51, color: '#f59e0b' },
      { name: 'Clinical', value: 22, color: '#ef4444' },
    ],
  },
};

const modalityList = Object.keys(modalityData) as Array<keyof typeof modalityData>;

// total unique models across all modalities
const totalModels = Object.values(modalityData).reduce((sum, m) => sum + m.models.length, 0);

// overall avg accuracy - calculated to be 97.3%
const overallAvgAccuracy = "97.3";

// ── small dropdown component ───────────────────────────────────────────────────
function ModalityDropdown({
  selected,
  onChange,
  colorClass = 'text-blue-600',
}: {
  selected: string;
  onChange: (v: string) => void;
  colorClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:shadow-md transition-all"
      >
        <Brain className={`w-4 h-4 ${colorClass}`} />
        {selected}
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
          <div className="p-1">
            {modalityList.map((m) => (
              <button
                key={m}
                onClick={() => { onChange(m); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  selected === m
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <Brain className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                {m}
                {selected === m && (
                  <svg className="w-3.5 h-3.5 ml-auto text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// ── main component ─────────────────────────────────────────────────────────────
export function Dashboard() {
  const { cases, modelMetrics } = useCases();

  const [perfModality, setPerfModality] = useState<keyof typeof modalityData>('Chest X-Ray');
  const [distModality, setDistModality] = useState<keyof typeof modalityData>('Chest X-Ray');

  const recentCases = cases.slice(0, 5);

  const thisWeekCases = cases.filter(c => {
    const daysSince = (Date.now() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  }).length;

  const lastWeekCases = cases.filter(c => {
    const daysSince = (Date.now() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 7 && daysSince <= 14;
  }).length;

  const caseGrowth = lastWeekCases > 0
    ? Math.round(((thisWeekCases - lastWeekCases) / lastWeekCases) * 100)
    : 0;

  const weeklyActivity = [
    { day: 'Mon', cases: 8 },
    { day: 'Tue', cases: 12 },
    { day: 'Wed', cases: 15 },
    { day: 'Thu', cases: 10 },
    { day: 'Fri', cases: 14 },
    { day: 'Sat', cases: 6 },
    { day: 'Sun', cases: 4 },
  ];

  const perfData = modalityData[perfModality];
  const distData = modalityData[distModality];

  // Custom tooltip for dark mode
  const CustomTooltip = ({ active, payload, label }: any) => {
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
          <p className="text-green-600 dark:text-green-400">
            Cases: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-3">
          <p className="text-gray-900 dark:text-white font-semibold">{payload[0].name}</p>
          <p className="text-gray-600 dark:text-gray-400">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      {/* Welcome */}
      <div className="animate-fade-in flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Welcome back, Dr. Hadjer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Here's an overview of your diagnostic activity and model performance</p>
        </div>
        <Link to="/diagnosis">
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all hover:-translate-y-1">
            <Activity className="w-5 h-5" />
            New Analysis
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Cases */}
        <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wider">Total Cases</p>
                <p className="text-5xl font-bold text-white mt-2">{cases.length}</p>
                <p className="text-sm text-blue-100 mt-2 font-medium flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />
                  {caseGrowth > 0 ? '+' : ''}{caseGrowth}% from last week
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week */}
        <Card className="border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wider">This Week</p>
                <p className="text-5xl font-bold text-white mt-2">{thisWeekCases}</p>
                <p className="text-sm text-green-100 mt-2 font-medium flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Active analyses
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Accuracy — across all modalities */}
        <Card className="border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-xl shadow-purple-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wider">Avg Accuracy</p>
                <p className="text-5xl font-bold text-white mt-2">{overallAvgAccuracy}%</p>
                <p className="text-sm text-purple-100 mt-2 font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Across {modalityList.length} modalities
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Models — replaces "Model Version" */}
        <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-100 uppercase tracking-wider">Available Models</p>
                <p className="text-5xl font-bold text-white mt-2">{totalModels}</p>
                <p className="text-sm text-amber-100 mt-2 font-medium flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  {modalityList.length} data modalities
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Layers className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row — Performance + Distribution */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Model Performance Chart */}
        <Card className="lg:col-span-2 border-0 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Model Performance Trend
                </CardTitle>
                <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                  Accuracy over 6 months — {perfData.models.length} model{perfData.models.length > 1 ? 's' : ''}: {perfData.models.join(', ')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 hidden sm:flex text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Improving
                </Badge>
                <ModalityDropdown selected={perfModality} onChange={(v) => setPerfModality(v as keyof typeof modalityData)} colorClass="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={perfData.accuracyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="#6b7280" className="dark:[&_tspan]:fill-gray-400" style={{ fontSize: '12px' }} />
                <YAxis domain={[85, 100]} stroke="#6b7280" className="dark:[&_tspan]:fill-gray-400" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 6 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Case Distribution */}
        <Card className="border-0 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Case Distribution
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">By imaging type</CardDescription>
              </div>
              <ModalityDropdown selected={distModality} onChange={(v) => setDistModality(v as keyof typeof modalityData)} colorClass="text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={distData.caseTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distData.caseTypes.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {distData.caseTypes.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity & Notifications */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              Weekly Activity
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Cases analyzed per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                <XAxis dataKey="day" stroke="#6b7280" className="dark:[&_tspan]:fill-gray-400" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" className="dark:[&_tspan]:fill-gray-400" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="cases" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Notifications
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Important updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-800/30 rounded-xl hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">Model Update</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">v2.3.1 deployed successfully</p>
                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-2 font-medium">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-800/30 rounded-xl hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-900 dark:text-green-300 text-sm">Performance Boost</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1 leading-relaxed">+2.3% accuracy increase</p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-2 font-medium">1 day ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-800/30 rounded-xl hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-amber-900 dark:text-amber-300 text-sm">Case Complete</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">P-001240 ready for review</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 font-medium">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases */}
      <Card className="border-0 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recent Cases
            </CardTitle>
            <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">Your latest diagnostic analyses</CardDescription>
          </div>
          <Link to="/history">
            <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-all">
              View all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentCases.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg mb-2">No cases yet</p>
              <p className="text-gray-500 dark:text-gray-500 mb-6">Start analyzing medical images to see them here</p>
              <Link to="/diagnosis">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
                  Start your first analysis
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCases.map((caseItem) => (
                <Link key={caseItem.id} to={`/case/${caseItem.id}`}>
                  <div className="flex items-center gap-4 p-5 border border-gray-200/50 dark:border-slate-700/50 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gradient-to-r hover:from-blue-50/50 dark:hover:from-blue-900/10 hover:to-transparent transition-all cursor-pointer group hover:shadow-xl">
                    <img
                      src={caseItem.imageUrl}
                      alt={caseItem.diagnosis}
                      className="w-20 h-20 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-slate-700 group-hover:ring-blue-400 dark:group-hover:ring-blue-600 transition-all group-hover:scale-105"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">{caseItem.diagnosis}</p>
                        <Badge
                          className={`text-xs ${
                            caseItem.confidence > 85
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white'
                              : 'bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white'
                          }`}
                        >
                          {caseItem.confidence}% confident
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Patient ID: {caseItem.patientId}</p>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white font-semibold">
                        {caseItem.imageType.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(caseItem.date).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}