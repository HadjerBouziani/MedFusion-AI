import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCases } from '../context/case-context';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, CheckCircle, AlertCircle, Zap, Target } from 'lucide-react';

export function ModelPerformance() {
  const { modelMetrics, cases } = useCases();

  // Mock historical data for accuracy trend
  const accuracyTrend = [
    { month: 'Oct', accuracy: 89.5 },
    { month: 'Nov', accuracy: 91.2 },
    { month: 'Dec', accuracy: 92.8 },
    { month: 'Jan', accuracy: 93.5 },
    { month: 'Feb', accuracy: 94.0 },
    { month: 'Mar', accuracy: 94.2 },
  ];

  // Cases by type
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Model Insights</h2>
        <p className="text-gray-600 mt-2">AI model performance and accuracy metrics</p>
      </div>

      {/* Model Update Banner */}
      {isRecentlyUpdated() && (
        <Card className="border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 mb-1">Model Recently Updated</p>
                <p className="text-sm text-blue-800">
                  Latest version v2.3.1 deployed on {new Date(modelMetrics.lastUpdated).toLocaleDateString()} 
                  with improved accuracy on rare cases.
                </p>
              </div>
              <Badge className="bg-blue-600 hover:bg-blue-700">v2.3.1</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant="default" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                +{modelMetrics.improvementRate}%
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Overall Accuracy</p>
            <p className="text-3xl font-semibold text-gray-900">{modelMetrics.overallAccuracy}%</p>
            <p className="text-sm text-gray-500 mt-2">Across all image types</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Cases Analyzed</p>
            <p className="text-3xl font-semibold text-gray-900">{modelMetrics.totalCases.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">By all users</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Your Cases</p>
            <p className="text-3xl font-semibold text-gray-900">{cases.length}</p>
            <p className="text-sm text-gray-500 mt-2">In your history</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Improvement Rate</p>
            <p className="text-3xl font-semibold text-gray-900">{modelMetrics.improvementRate}%</p>
            <p className="text-sm text-gray-500 mt-2">Since last update</p>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy Trend Chart */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Accuracy Improvement Trend</CardTitle>
          <CardDescription>Model performance has improved by 12% over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                style={{ fontSize: '13px', fontWeight: 500 }}
              />
              <YAxis 
                domain={[85, 100]} 
                stroke="#6b7280" 
                style={{ fontSize: '13px', fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                }}
              />
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
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Your Cases by Image Type</CardTitle>
            <CardDescription>Distribution of your analyzed cases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casesByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="type" 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Capabilities */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Model Capabilities</CardTitle>
            <CardDescription>What the AI can do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Multi-Modal Analysis</p>
                <p className="text-sm text-gray-600 mt-0.5">Supports X-rays, CT, MRI, skin lesions, and retinal scans</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Explainable AI</p>
                <p className="text-sm text-gray-600 mt-0.5">Grad-CAM visualization and clinical explanations</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Quality Assessment</p>
                <p className="text-sm text-gray-600 mt-0.5">Automatic image quality detection and warnings</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Continuous Learning</p>
                <p className="text-sm text-gray-600 mt-0.5">Regular updates with improved accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Card className="border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle>Understanding the Metrics</CardTitle>
          <CardDescription>What these numbers mean for your practice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Decision Support Tool</p>
              <p className="text-sm text-gray-600 mt-1">
                AI predictions should always be confirmed with clinical examination and additional diagnostic tests. 
                This tool is designed to assist, not replace, professional medical judgment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Continuous Improvement</p>
              <p className="text-sm text-gray-600 mt-1">
                Model performance has improved by 12% over the last updates. The system is regularly updated 
                with new training data to maintain high accuracy across diverse cases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
