import { Link } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Brain, Download, Upload, Activity, Cpu, Zap } from 'lucide-react';

export function Training() {
  const models = [
    {
      id: 1,
      modality: 'Chest X-Ray',
      architecture: 'ResNet18 SSL-FL - v2.1 ',
      globalVersion: 'v2.1',
      aggregationMethod: 'SSL Adaptive Aggregation',
      round: 3,
      status: 'Uploaded',
      color: 'from-amber-500 to-orange-600',
      lastDownload: '2024-01-20',
      prevAccuracy: '97.1%',
      canUpload: true
    },
    {
      id: 2,
      modality: 'Brain MRI',
      architecture: 'EfficientNetV2',
      globalVersion: 'v1.4',
      aggregationMethod: 'RF-Weighted SSL',
      round: 5,
      status: 'Uploaded',
      color: 'from-purple-500 to-indigo-600',
      lastDownload: '2024-01-18',
      prevAccuracy: '96.8%',
      canUpload: true
    },
    {
      id: 3,
      modality: 'Retinal OCT',
      architecture: 'DenseNet121 SSL-FL',
      globalVersion: 'v2.0',
      aggregationMethod: 'SSL Adaptive Aggregation',
      round: 5,
      status: 'Uploaded',
      color: 'from-green-500 to-emerald-600',
      lastDownload: '2024-01-15',
      prevAccuracy: '97.5%',
      canUpload: false
    },
    {
      id: 4,
      modality: 'Skin Lesion HAM10000',
      architecture: 'MobileNetV2 SSL-FL',
      globalVersion: 'v2.5',
      aggregationMethod: 'RF-Weighted SSL',
      round: 4,
      status: 'Uploaded',
      color: 'from-amber-500 to-orange-600',
      lastDownload: '2024-01-19',
      prevAccuracy: '94.2%',
      canUpload: false
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <Badge className="bg-white/20 text-white border-0 mb-3">
            <Brain className="w-3 h-3 mr-1" />
            Assigned Models
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-2">
            Training
          </h1>
          <p className="text-purple-100 text-lg">
            Download packages, train locally, and upload your model updates
          </p>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid gap-8">
        {models.map((model) => (
          <Card key={model.id} className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white dark:bg-slate-800 overflow-hidden group">
            {/* Status Bar */}
            <div className={`h-1 bg-gradient-to-r ${
              model.status === 'Uploaded' ? 'from-green-500 to-emerald-600' :
              model.status === 'Awaiting Upload' ? 'from-amber-500 to-orange-600' :
              model.status === 'Trained Locally' ? 'from-blue-500 to-indigo-600' :
              'from-purple-500 to-indigo-600'
            }`}></div>

            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Model Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative">
                      <div className={`w-20 h-20 bg-gradient-to-br ${model.color} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">R{model.round}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Badge className={`mb-3 ${
                        model.status === 'Uploaded' ? 'bg-green-100 text-green-700 border-green-300' :
                        model.status === 'Awaiting Upload' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                        model.status === 'Trained Locally' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                        'bg-purple-100 text-purple-700 border-purple-300'
                      } border`}>
                        {model.status}
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {model.modality}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {model.architecture}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Global Version</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{model.globalVersion}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Previous Accuracy</p>
                      <p className="text-lg font-bold font-mono text-gray-900 dark:text-white">{model.prevAccuracy}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Global {model.globalVersion}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Training Round</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">Round {model.round}</p>
                    </div>
                  </div>

                  {/* Info Tags */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Aggregation Method</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{model.aggregationMethod}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Download</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{model.lastDownload}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="lg:w-72 flex flex-col gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      Quick Actions
                    </h4>
                    <div className="space-y-3">
                      <Link to={`/ai/download-package/${model.id}`} className="block">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all h-12">
                          <Download className="w-5 h-5 mr-2" />
                          Download Package
                        </Button>
                      </Link>
                      <Link to={`/ai/upload-update/${model.id}`} className="block">
                        <Button
                          variant="outline"
                          className={`w-full border-2 h-12 ${
                            !model.canUpload
                              ? 'opacity-50 cursor-not-allowed'
                              : 'border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          }`}
                          disabled={!model.canUpload}
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Upload Update
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}