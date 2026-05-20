import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Terminal, Activity, AlertCircle, CheckCircle, XCircle, Cpu } from 'lucide-react';

export function LogsMonitoring() {
  const trainingLogs = [
    { timestamp: '2024-01-20 14:35:22', level: 'INFO', message: 'Starting training round 15 for CXR-RN18-v2.1' },
    { timestamp: '2024-01-20 14:35:25', level: 'INFO', message: 'Loaded global model weights (87.2 MB)' },
    { timestamp: '2024-01-20 14:35:30', level: 'INFO', message: 'Dataset loaded: 4,200 training samples' },
    { timestamp: '2024-01-20 14:40:15', level: 'INFO', message: 'Epoch 1/10 - Loss: 0.245, Accuracy: 91.2%' },
    { timestamp: '2024-01-20 14:45:22', level: 'INFO', message: 'Epoch 2/10 - Loss: 0.189, Accuracy: 93.5%' },
    { timestamp: '2024-01-20 14:50:11', level: 'INFO', message: 'Epoch 3/10 - Loss: 0.152, Accuracy: 95.1%' },
    { timestamp: '2024-01-20 15:02:45', level: 'SUCCESS', message: 'Training completed - Final accuracy: 97.1%' },
    { timestamp: '2024-01-20 15:03:12', level: 'INFO', message: 'Generating submission package...' },
    { timestamp: '2024-01-20 15:03:45', level: 'SUCCESS', message: 'Submission package created: submission_package.zip' },
  ];

  const uploadHistory = [
    { date: '2024-01-20', model: 'CXR-RN18-v2.1', round: 15, status: 'Success', size: '88.5 MB' },
    { date: '2024-01-19', model: 'SKN-MBN-v2.5', round: 8, status: 'Success', size: '45.2 MB' },
    { date: '2024-01-18', model: 'MRI-EFF-v1.4', round: 9, status: 'Success', size: '102.1 MB' },
    { date: '2024-01-17', model: 'OCT-DN121-v2.0', round: 11, status: 'Failed', size: '0 MB' },
    { date: '2024-01-15', model: 'OCT-DN121-v2.0', round: 12, status: 'Success', size: '95.3 MB' },
  ];

  const gpuMetrics = [
    { metric: 'GPU Utilization', value: '85%', color: 'text-green-600' },
    { metric: 'Memory Used', value: '32.4 / 40 GB', color: 'text-blue-600' },
    { metric: 'Temperature', value: '72°C', color: 'text-amber-600' },
    { metric: 'Power Draw', value: '285W / 400W', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Logs & Monitoring
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor training progress, system performance, and upload history
        </p>
      </div>

      {/* GPU Metrics */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" />
            GPU Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {gpuMetrics.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.metric}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Training Logs */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              Training Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
              {trainingLogs.map((log, index) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                  <span className={`font-semibold ${
                    log.level === 'SUCCESS' ? 'text-green-400' :
                    log.level === 'ERROR' ? 'text-red-400' :
                    log.level === 'WARNING' ? 'text-amber-400' :
                    'text-blue-400'
                  }`}>{log.level}</span>{' '}
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload History */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Upload History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadHistory.map((upload, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{upload.model}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Round {upload.round}</p>
                    </div>
                    {upload.status === 'Success' ? (
                      <Badge className="bg-green-100 text-green-700 border-green-300 border">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-red-300 border">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{upload.date}</span>
                    <span className="text-gray-600 dark:text-gray-400">{upload.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failed Uploads */}
      <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-200">
            <AlertCircle className="w-5 h-5" />
            Failed Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  OCT-DN121-v2.0 - Round 11
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Failed on 2024-01-17 at 16:45:30
                </p>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Error: Weight integrity check failed - corrupted file detected
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Epoch Progression */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Recent Training Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { epoch: '10/10', loss: '0.098', accuracy: '97.1%', time: '4m 32s' },
              { epoch: '9/10', loss: '0.112', accuracy: '96.8%', time: '4m 28s' },
              { epoch: '8/10', loss: '0.125', accuracy: '96.3%', time: '4m 35s' },
              { epoch: '7/10', loss: '0.138', accuracy: '95.9%', time: '4m 30s' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">Epoch {item.epoch}</Badge>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Loss</p>
                      <p className="font-mono font-semibold text-gray-900 dark:text-white">{item.loss}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
                      <p className="font-mono font-semibold text-gray-900 dark:text-white">{item.accuracy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-mono font-semibold text-gray-900 dark:text-white">{item.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
