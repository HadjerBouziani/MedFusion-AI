import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  TrendingUp,
  Award,
  BarChart3,
  Activity,
  CheckCircle,
  ArrowUp,
  Sparkles,
  Brain,
  ChevronDown,
  Filter
} from 'lucide-react';

const modelsData = {
  1: {
    modality: 'Chest X-Ray',
    color: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-500',
    dotColor: 'bg-amber-500',
    currentWeight: 0.24,
    startWeight: 0.08,
    weightChange: '+200%',
    currentSSL: 0.91,
    startSSL: 0.51,
    sslChange: '+78%',
    ranking: '#4',
    rankingLabel: 'Top 15%',
    participants: 28,
    contributionEvolution: [
      { round: 1, weight: 0.08, sslQuality: 0.51 },
      { round: 5, weight: 0.14, sslQuality: 0.72 },
      { round: 10, weight: 0.21, sslQuality: 0.87 },
      { round: 15, weight: 0.24, sslQuality: 0.91 },
    ],
    modelComparisons: [
      { metric: 'Accuracy', local: '96.1%', global: '97.0%', improvement: '+0.9%' },
      { metric: 'F1 Score', local: '95.4%', global: '96.2%', improvement: '+0.8%' },
      { metric: 'AUC-ROC', local: '97.3%', global: '98.1%', improvement: '+0.8%' },
    ],
    impactFactors: [
      { factor: 'Improved representation consistency', impact: 'High', icon: Sparkles, color: 'from-purple-500 to-indigo-600' },
      { factor: 'Lower client divergence', impact: 'Medium', icon: Activity, color: 'from-blue-500 to-cyan-600' },
      { factor: 'Stable validation performance', impact: 'High', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
      { factor: 'High-quality local dataset', impact: 'High', icon: Brain, color: 'from-amber-500 to-orange-600' },
    ],
  },
  2: {
    modality: 'Brain MRI',
    color: 'from-purple-500 to-indigo-600',
    iconColor: 'text-purple-500',
    dotColor: 'bg-purple-500',
    currentWeight: 0.19,
    startWeight: 0.06,
    weightChange: '+217%',
    currentSSL: 0.88,
    startSSL: 0.48,
    sslChange: '+83%',
    ranking: '#6',
    rankingLabel: 'Top 22%',
    participants: 28,
    contributionEvolution: [
      { round: 1, weight: 0.06, sslQuality: 0.48 },
      { round: 3, weight: 0.10, sslQuality: 0.63 },
      { round: 6, weight: 0.15, sslQuality: 0.76 },
      { round: 9, weight: 0.19, sslQuality: 0.88 },
    ],
    modelComparisons: [
      { metric: 'Accuracy', local: '95.8%', global: '96.5%', improvement: '+0.7%' },
      { metric: 'F1 Score', local: '94.9%', global: '95.8%', improvement: '+0.9%' },
      { metric: 'AUC-ROC', local: '96.1%', global: '97.0%', improvement: '+0.9%' },
    ],
    impactFactors: [
      { factor: 'Diverse MRI scan coverage', impact: 'High', icon: Brain, color: 'from-purple-500 to-indigo-600' },
      { factor: 'Consistent annotation quality', impact: 'High', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
      { factor: 'Moderate client divergence', impact: 'Medium', icon: Activity, color: 'from-blue-500 to-cyan-600' },
      { factor: 'Strong feature alignment', impact: 'Medium', icon: Sparkles, color: 'from-amber-500 to-orange-600' },
    ],
  },
  3: {
    modality: 'Retinal OCT',
    color: 'from-green-500 to-emerald-600',
    iconColor: 'text-green-500',
    dotColor: 'bg-green-500',
    currentWeight: 0.27,
    startWeight: 0.09,
    weightChange: '+200%',
    currentSSL: 0.93,
    startSSL: 0.55,
    sslChange: '+69%',
    ranking: '#2',
    rankingLabel: 'Top 8%',
    participants: 28,
    contributionEvolution: [
      { round: 1, weight: 0.09, sslQuality: 0.55 },
      { round: 4, weight: 0.15, sslQuality: 0.72 },
      { round: 8, weight: 0.22, sslQuality: 0.85 },
      { round: 12, weight: 0.27, sslQuality: 0.93 },
    ],
    modelComparisons: [
      { metric: 'Accuracy', local: '97.2%', global: '97.8%', improvement: '+0.6%' },
      { metric: 'F1 Score', local: '96.8%', global: '97.3%', improvement: '+0.5%' },
      { metric: 'AUC-ROC', local: '98.1%', global: '98.6%', improvement: '+0.5%' },
    ],
    impactFactors: [
      { factor: 'Highest SSL quality score', impact: 'High', icon: Sparkles, color: 'from-green-500 to-emerald-600' },
      { factor: 'Minimal data distribution shift', impact: 'High', icon: CheckCircle, color: 'from-blue-500 to-cyan-600' },
      { factor: 'Large labeled dataset', impact: 'High', icon: Brain, color: 'from-purple-500 to-indigo-600' },
      { factor: 'Consistent upload schedule', impact: 'Medium', icon: Activity, color: 'from-amber-500 to-orange-600' },
    ],
  },
  4: {
    modality: 'Skin Lesion',
    color: 'from-rose-500 to-pink-600',
    iconColor: 'text-rose-500',
    dotColor: 'bg-rose-500',
    currentWeight: 0.15,
    startWeight: 0.07,
    weightChange: '+114%',
    currentSSL: 0.82,
    startSSL: 0.44,
    sslChange: '+86%',
    ranking: '#11',
    rankingLabel: 'Top 40%',
    participants: 28,
    contributionEvolution: [
      { round: 1, weight: 0.07, sslQuality: 0.44 },
      { round: 3, weight: 0.09, sslQuality: 0.58 },
      { round: 5, weight: 0.12, sslQuality: 0.71 },
      { round: 8, weight: 0.15, sslQuality: 0.82 },
    ],
    modelComparisons: [
      { metric: 'Accuracy', local: '93.1%', global: '94.2%', improvement: '+1.1%' },
      { metric: 'F1 Score', local: '92.4%', global: '93.6%', improvement: '+1.2%' },
      { metric: 'AUC-ROC', local: '94.8%', global: '95.9%', improvement: '+1.1%' },
    ],
    impactFactors: [
      { factor: 'Good class diversity coverage', impact: 'Medium', icon: Brain, color: 'from-rose-500 to-pink-600' },
      { factor: 'Improving SSL trend', impact: 'Medium', icon: TrendingUp, color: 'from-purple-500 to-indigo-600' },
      { factor: 'Room for label improvement', impact: 'Medium', icon: Activity, color: 'from-amber-500 to-orange-600' },
      { factor: 'Growing contribution weight', impact: 'Medium', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
    ],
  },
};

const modelList = [
  { id: 1, modality: 'Chest X-Ray', dotColor: 'bg-amber-500' },
  { id: 2, modality: 'Brain MRI', dotColor: 'bg-purple-500' },
  { id: 3, modality: 'Retinal OCT', dotColor: 'bg-green-500' },
  { id: 4, modality: 'Skin Lesion', dotColor: 'bg-rose-500' },
];

export function ContributionInsights() {
  const [selectedModelId, setSelectedModelId] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const data = modelsData[selectedModelId as keyof typeof modelsData];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getWeightColor = (weight: number) => {
    if (weight >= 0.2) return 'text-green-600 dark:text-green-400';
    if (weight >= 0.15) return 'text-blue-600 dark:text-blue-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  const getSSLColor = (quality: number) => {
    if (quality >= 0.85) return 'text-green-600 dark:text-green-400';
    if (quality >= 0.7) return 'text-blue-600 dark:text-blue-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="space-y-8">

      {/* Model Selector — above the header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Contribution Insights
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px]"
          >
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Brain className={`w-5 h-5 flex-shrink-0 ${data.iconColor}`} />
            <span className="font-semibold flex-1 text-left text-gray-800 dark:text-gray-100 text-sm">{data.modality}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-1.5">
                {modelList.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModelId(m.id); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left ${
                      selectedModelId === m.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Brain className={`w-5 h-5 ${modelsData[m.id as keyof typeof modelsData].iconColor}`} />
                    <span className={`flex-1 font-medium text-sm ${
                      selectedModelId === m.id
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {m.modality}
                    </span>
                    {selectedModelId === m.id && (
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
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <Badge className="bg-white/20 text-white border-0 mb-3">
            <TrendingUp className="w-3 h-3 mr-1" />
            Deep Analytics
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-2">Contribution Insights</h1>
          <p className="text-purple-100 text-lg">
            Track your federated learning contribution evolution and impact
          </p>
        </div>
      </div>

      {/* Current Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <div className={`h-1 bg-gradient-to-r ${data.color}`}></div>
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${data.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all`}>
                <Award className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-300 border">
                <ArrowUp className="w-3 h-3 mr-1" />
                {data.weightChange}
              </Badge>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Weight</h3>
            <p className={`text-4xl font-bold bg-gradient-to-br ${data.color} bg-clip-text text-transparent`}>
              {data.currentWeight.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">From {data.startWeight.toFixed(2)} at Round 1</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-300 border">
                <ArrowUp className="w-3 h-3 mr-1" />
                {data.sslChange}
              </Badge>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">SSL Quality</h3>
            <p className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {data.currentSSL.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">From {data.startSSL.toFixed(2)} at Round 1</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-300 border">{data.rankingLabel}</Badge>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ranking</h3>
            <p className="text-4xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {data.ranking}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Among {data.participants} participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Evolution Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contribution Evolution */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-10 h-10 bg-gradient-to-br ${data.color} rounded-lg flex items-center justify-center`}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Contribution Evolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Round</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Weight</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contributionEvolution.map((item, index) => (
                    <tr key={item.round} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-gradient-to-br ${data.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">R{item.round}</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Round {item.round}</span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4">
                        <span className={`font-mono font-bold text-lg ${getWeightColor(item.weight)}`}>
                          {item.weight.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right py-4 px-4">
                        {index > 0 && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 border">
                            <ArrowUp className="w-3 h-3 mr-1" />
                            +{((item.weight - data.contributionEvolution[index - 1].weight) * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* SSL Quality Evolution */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Representation Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Round</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">SSL Quality</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {data.contributionEvolution.map((item, index) => (
                    <tr key={item.round} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">R{item.round}</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Round {item.round}</span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4">
                        <span className={`font-mono font-bold text-lg ${getSSLColor(item.sslQuality)}`}>
                          {item.sslQuality.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right py-4 px-4">
                        {index > 0 && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 border">
                            <ArrowUp className="w-3 h-3 mr-1" />
                            +{((item.sslQuality - data.contributionEvolution[index - 1].sslQuality) * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Local vs Global Comparison */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Local vs Global Performance — {data.modality}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Metric</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Local</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Global</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {data.modelComparisons.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{item.metric}</td>
                    <td className="text-right py-4 px-4 font-mono font-semibold text-gray-900 dark:text-white">{item.local}</td>
                    <td className="text-right py-4 px-4 font-mono font-bold text-green-600 dark:text-green-400">{item.global}</td>
                    <td className="text-right py-4 px-4">
                      <Badge className="bg-green-100 text-green-700 border-green-300 border">
                        {item.improvement}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Aggregation Impact Factors */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Why Your Contribution Increased
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Your contribution weight for <strong>{data.modality}</strong> increased due to the following factors identified by the RF-Weighted SSL aggregation algorithm:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {data.impactFactors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm">
                  <div className={`w-12 h-12 bg-gradient-to-br ${factor.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{factor.factor}</h4>
                      <Badge className={`${
                        factor.impact === 'High' ? 'bg-green-100 text-green-700 border-green-300' :
                        'bg-blue-100 text-blue-700 border-blue-300'
                      } border text-xs`}>
                        {factor.impact} Impact
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}