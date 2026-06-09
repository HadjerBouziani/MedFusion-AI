import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Brain,
  Package,
  Download,
  CheckCircle,
  Clock,
  Archive,
  TrendingUp,
  Calendar,
  Server,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type ModelStatus = 'Active' | 'Deprecated' | 'Archived';

interface ModelVersion {
  id: string;
  modality: string;
  architecture: string;
  version: string;
  status: ModelStatus;
  downloadDate: string;
  aggregationRound: number;
  accuracy: string;
  color: string;
}

const modelVersionsData: Record<string, ModelVersion[]> = {
  'Chest X-Ray': [
    {
      id: 'CXR-RN18',
      modality: 'Chest X-Ray',
      architecture: 'ResNet18 SSL-FL',
      version: 'v2.1',
      status: 'Active',
      downloadDate: '2026-06-02',
      aggregationRound: 3,
      accuracy: '97.1%',
      color: 'from-blue-500 to-cyan-600'
    },
  ],
  'Brain MRI': [
    {
      id: 'MRI-EFF',
      modality: 'Brain MRI',
      architecture: 'EfficientNetV2',
      version: 'v1.4',
      status: 'Active',
      downloadDate: '2026-05-18',
      aggregationRound: 5,
      accuracy: '96.8%',
      color: 'from-purple-500 to-indigo-600'
    },
  ],
  'Retinal OCT': [
    {
      id: 'OCT-DN121',
      modality: 'Retinal OCT',
      architecture: 'DenseNet121 SSL-FL',
      version: 'v2.0',
      status: 'Active',
      downloadDate: '2026-05-15',
      aggregationRound: 4,
      accuracy: '97.5%',
      color: 'from-green-500 to-emerald-600'
    },
  ],
  'Skin Lesion': [
    {
      id: 'SKIN-EFF',
      modality: 'Skin Lesion',
      architecture: 'EfficientNetV2 SSL-FL',
      version: 'v1.0',
      status: 'Active',
      downloadDate: '2026-05-25',
      aggregationRound: 4,
      accuracy: '94.2%',
      color: 'from-pink-500 to-rose-600'
    },
  ],
};

const modelList = [
  { id: 'Chest X-Ray', dotColor: 'bg-amber-500', iconColor: 'text-amber-500' },
  { id: 'Brain MRI', dotColor: 'bg-purple-500', iconColor: 'text-purple-500' },
  { id: 'Retinal OCT', dotColor: 'bg-green-500', iconColor: 'text-green-500' },
  { id: 'Skin Lesion', dotColor: 'bg-pink-500', iconColor: 'text-pink-500' },
];

const downloadHistoryData: Record<string, any[]> = {
  'Chest X-Ray': [
    { version: 'v2.1', date: '2024-01-20', round: 3, status: 'Trained & Uploaded' },
  ],
  'Brain MRI': [
    { version: 'v1.4', date: '2024-01-18', round: 5, status: 'Trained & Uploaded' },
  ],
  'Retinal OCT': [
    { version: 'v2.0', date: '2024-01-15', round: 4, status: 'Trained & Uploaded' },
  ],
  'Skin Lesion': [
    { version: 'v1.0', date: '2024-01-25', round: 4, status: 'Trained & Uploaded' },
  ],
};

const aggregationHistoryData: Record<string, any[]> = {
  'Chest X-Ray': [
    { round: 3, date: '2024-01-22', contributionWeight: 0.24, globalAccuracy: '97.1%', improvement: '+0.8%' },
  ],
  'Brain MRI': [
    { round: 5, date: '2024-01-20', contributionWeight: 0.19, globalAccuracy: '96.8%', improvement: '+0.7%' },
  ],
  'Retinal OCT': [
    { round: 4, date: '2024-01-17', contributionWeight: 0.27, globalAccuracy: '97.5%', improvement: '+0.6%' },
  ],
  'Skin Lesion': [
    { round: 4, date: '2024-01-27', contributionWeight: 0.22, globalAccuracy: '94.2%', improvement: '+0.5%' },
  ],
};

export function ModelVersions() {
  const [selectedModality, setSelectedModality] = useState<string>('Chest X-Ray');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modelVersions = modelVersionsData[selectedModality] || [];
  const downloadHistory = downloadHistoryData[selectedModality] || [];
  const aggregationHistory = aggregationHistoryData[selectedModality] || [];

  const getSelectedModalityColor = () => {
    const found = modelList.find(m => m.id === selectedModality);
    return found?.iconColor || 'text-blue-500';
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: ModelStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Deprecated':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Archived':
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: ModelStatus) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Deprecated':
        return <Clock className="w-4 h-4" />;
      case 'Archived':
        return <Archive className="w-4 h-4" />;
    }
  };

  // Calculate stats based on selected modality
  const activeModelsCount = modelVersions.filter(m => m.status === 'Active').length;
  const totalVersions = modelVersions.length;
  const latestRound = aggregationHistory[0]?.round || '-';

  return (
    <div className="space-y-8">
      {/* Model Selector — above the header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Model Versions
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px]"
          >
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Brain className={`w-5 h-5 flex-shrink-0 ${getSelectedModalityColor()}`} />
            <span className="font-semibold flex-1 text-left text-gray-800 dark:text-gray-100 text-sm">{selectedModality}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-1.5">
                {modelList.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModality(m.id); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left ${
                      selectedModality === m.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Brain className={`w-5 h-5 ${m.iconColor}`} />
                    <span className={`flex-1 font-medium text-sm ${
                      selectedModality === m.id
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {m.id}
                    </span>
                    {selectedModality === m.id && (
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <Badge className="bg-white/20 text-white border-0 mb-3">
            <Package className="w-3 h-3 mr-1" />
            Version Control
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-2">
            Model Versions — {selectedModality}
          </h1>
          <p className="text-blue-100 text-lg">
            Track all model versions, downloads, and aggregation history
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">Active</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Models</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeModelsCount}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700 border-purple-300 border">Total</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Versions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalVersions}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-2">
              <Download className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-100 text-green-700 border-green-300 border">History</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Downloads</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{downloadHistory.length}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-2">
              <Server className="w-8 h-8 text-amber-600" />
              <Badge className="bg-amber-100 text-amber-700 border-amber-300 border">Latest</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Round</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{latestRound}</p>
          </CardContent>
        </Card>
      </div>

      {/* All Model Versions Table */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            {selectedModality} — Model Versions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Architecture</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Version</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Downloaded</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Accuracy</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {modelVersions.map((model) => (
                  <tr
                    key={model.id}
                    className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${model.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{model.modality}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{model.architecture}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="font-mono">{model.version}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusBadge(model.status)} border`}>
                        {getStatusIcon(model.status)}
                        <span className="ml-1">{model.status}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {model.downloadDate}
                    </td>
                    <td className="text-right py-4 px-4 font-mono font-bold text-gray-900 dark:text-white">
                      {model.accuracy}
                    </td>
                    <td className="text-right py-4 px-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Download & Aggregation History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Download History */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              Download History — {selectedModality}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {downloadHistory.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">{item.version}</span>
                      <Badge className="bg-green-100 text-green-700 border-green-300 border text-xs">
                        Round {item.round}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aggregation History */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Aggregation History — {selectedModality}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aggregationHistory.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">R{item.round}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">Round {item.round}</span>
                      <Badge className="bg-green-100 text-green-700 border-green-300 border text-xs">
                        {item.improvement}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-500">Weight: {item.contributionWeight}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">Accuracy: {item.globalAccuracy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}