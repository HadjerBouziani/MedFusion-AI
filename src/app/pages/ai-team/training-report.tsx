import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Activity, Database, Clock, TrendingUp, Cpu, ArrowLeft } from 'lucide-react';

export function TrainingReportViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Auto-extracted from uploaded JSON
  const report = {
    hospital_id: "hospital_03",
    modality: "Brain MRI",
    architecture: "EfficientNetV2",
    global_model_version: "v1.4",
    dataset_name: "Local MRI Dataset",
    train_samples: 4200,
    validation_samples: 600,
    test_samples: 600,
    local_accuracy: 96.8,
    local_f1: 95.9,
    ssl_divergence: 0.12,
    training_time_minutes: 83,
    round: 9,
    upload_date: "2024-01-20",
    gpu_info: "NVIDIA A100 40GB"
  };

  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page in history
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
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

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Training Report
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Auto-extracted metrics from uploaded submission package
        </p>
      </div>

      {/* Overview Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{report.modality}</h2>
              <p className="text-purple-100">{report.architecture}</p>
            </div>
            <Badge className="bg-white/20 border-white/30 text-white text-base px-4 py-1">
              Round {report.round}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-purple-100 text-sm mb-1">Global Version</p>
              <p className="text-xl font-bold">{report.global_model_version}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-purple-100 text-sm mb-1">Hospital ID</p>
              <p className="text-xl font-bold">{report.hospital_id}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-purple-100 text-sm mb-1">Upload Date</p>
              <p className="text-xl font-bold">{report.upload_date}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-purple-100 text-sm mb-1">Training Time</p>
              <p className="text-xl font-bold">{report.training_time_minutes}m</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dataset Statistics */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Dataset Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Dataset Name</span>
              <span className="font-semibold text-gray-900 dark:text-white">{report.dataset_name}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Training Samples</span>
              <span className="font-semibold text-gray-900 dark:text-white">{report.train_samples.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Validation Samples</span>
              <span className="font-semibold text-gray-900 dark:text-white">{report.validation_samples.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Test Samples</span>
              <span className="font-semibold text-gray-900 dark:text-white">{report.test_samples.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Total Samples</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {(report.train_samples + report.validation_samples + report.test_samples).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Local Accuracy</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{report.local_accuracy}%</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Local F1 Score</span>
              <span className="font-semibold text-gray-900 dark:text-white">{report.local_f1}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">SSL Divergence</span>
              <span className="font-semibold font-mono text-gray-900 dark:text-white">{report.ssl_divergence}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <Cpu className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">GPU</p>
                <p className="font-semibold text-gray-900 dark:text-white">{report.gpu_info}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Training Duration</p>
                <p className="font-semibold text-gray-900 dark:text-white">{report.training_time_minutes} minutes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON Preview */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Raw Report Data (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            {JSON.stringify(report, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}