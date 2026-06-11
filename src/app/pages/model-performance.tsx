import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCases } from '../context/case-context';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, CheckCircle, AlertCircle, Zap, Target, Brain, Activity, Shield } from 'lucide-react';

export function ModelPerformance() {
  const { modelMetrics, cases } = useCases();

  const accuracyTrend = [
    { month: 'Oct', accuracy: 49.2 },
    { month: 'Nov', accuracy: 52.8 },
    { month: 'Dec', accuracy: 54.1 },
    { month: 'Jan', accuracy: 55.6 },
    { month: 'Feb', accuracy: 57.3 },
    { month: 'Mar', accuracy: 58.51 },
  ];

  const casesByType = [
    { type: 'X-Ray', count: cases.filter(c => c.imageType === 'xray').length || 8, color: '#6366f1' },
    { type: 'Skin', count: cases.filter(c => c.imageType === 'skin').length || 5, color: '#8b5cf6' },
    { type: 'Retina', count: cases.filter(c => c.imageType === 'retina').length || 3, color: '#a78bfa' },
    { type: 'CT', count: cases.filter(c => c.imageType === 'ct').length || 2, color: '#c4b5fd' },
    { type: 'MRI', count: cases.filter(c => c.imageType === 'mri').length || 1, color: '#ddd6fe' },
  ].filter(item => item.count > 0);

  const isRecentlyUpdated = () => {
    const lastUpdate = new Date(modelMetrics.lastUpdated);
    const daysSince = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince <= 30;
  };

  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl shadow-xl p-4">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {payload[0].value}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Accuracy</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl shadow-xl p-4">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{payload[0].value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cases</p>
        </div>
      );
    }
    return null;
  };

  const capabilities = [
    {
      icon: Brain,
      label: 'Multi-Modal Analysis',
      desc: 'X-rays, CT, MRI, skin lesions, retinal scans',
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      ring: 'ring-1 ring-indigo-100 dark:ring-indigo-800/40',
    },
    {
      icon: Activity,
      label: 'Explainable AI',
      desc: 'Grad-CAM heatmaps with clinical context',
      color: 'text-violet-500 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      ring: 'ring-1 ring-violet-100 dark:ring-violet-800/40',
    },
    {
      icon: Shield,
      label: 'Quality Assessment',
      desc: 'Automatic image quality detection',
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      ring: 'ring-1 ring-purple-100 dark:ring-purple-800/40',
    },
    {
      icon: TrendingUp,
      label: 'Continuous Learning',
      desc: 'Regular retraining on new cases',
      color: 'text-fuchsia-500 dark:text-fuchsia-400',
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
      ring: 'ring-1 ring-fuchsia-100 dark:ring-fuchsia-800/40',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 lg:pb-10">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Diagnostics AI
          </p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Model Insights
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Performance metrics and accuracy breakdown
          </p>
        </div>
        {isRecentlyUpdated() && (
          <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-full shadow-sm">
            v2.3.1 · Live
          </Badge>
        )}
      </div>

      {/* ── Update Banner ── */}
      {isRecentlyUpdated() && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-px shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600/90 to-violet-600/90 px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">Model updated recently</p>
              <p className="text-indigo-200 text-xs mt-0.5 truncate">
                v1.0 deployed {new Date(modelMetrics.lastUpdated).toLocaleDateString()} — improved accuracy on rare cases
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-white/60 text-xs">Improvement</p>
              <p className="text-white font-bold text-lg leading-none mt-0.5">+2.3%</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Key Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Accuracy — hero card */}
        <div className="col-span-2 lg:col-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
          <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-3">Overall Accuracy</p>
          <p className="text-5xl font-extrabold text-white leading-none">58.51<span className="text-2xl text-indigo-300 font-bold">%</span></p>
          <p className="text-indigo-200 text-xs mt-3">Across all image types</p>
          <div className="mt-4 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-indigo-200 text-xs font-medium">+2.3% since last update</span>
          </div>
        </div>

        {/* Total Cases */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Total Cases</p>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">34</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">All users combined</p>
        </div>

        {/* Your Cases */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-violet-500 dark:text-violet-400" />
          </div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Your Cases</p>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">19</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">In your history</p>
        </div>

        {/* Improvement */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Improvement</p>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">
            +{modelMetrics.improvementRate}<span className="text-2xl">%</span>
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">Since last update</p>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Accuracy Trend — wider */}
        <Card className="lg:col-span-3 border-gray-100 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white text-base font-bold">Accuracy Trend</CardTitle>
                <CardDescription className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                  6-month trajectory — Oct to Mar
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-full px-3">
                ↑ +9.31%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={accuracyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[45, 62]}
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cases by Type — narrower */}
        <Card className="lg:col-span-2 border-gray-100 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900 dark:text-white text-base font-bold">Cases by Type</CardTitle>
            <CardDescription className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
              Your 19 cases broken down
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={casesByType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} vertical={false} />
                <XAxis
                  dataKey="type"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {casesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Capabilities ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Model Capabilities
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map(({ icon: Icon, label, desc, color, bg, ring }) => (
            <div
              key={label}
              className={`rounded-2xl p-5 ${bg} ${ring} hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className={`w-9 h-9 rounded-xl bg-white/70 dark:bg-black/20 flex items-center justify-center mb-4`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className={`text-sm font-semibold text-gray-900 dark:text-white`}>{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/60 dark:bg-amber-900/10 p-5 flex items-start gap-4">
        <div className="w-9 h-9 flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mt-0.5">
          <AlertCircle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Decision Support Tool</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            AI predictions should always be confirmed with clinical examination and additional diagnostic tests.
            This tool is designed to assist, not replace, professional medical judgment.
          </p>
        </div>
      </div>
    </div>
  );
}