import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Activity,
  Brain,
  Shield,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export function AIInsights() {
  const insights = [
    {
      id: 1,
      type: 'success',
      icon: TrendingUp,
      title: 'Outstanding Performance Improvement',
      message: 'Your local model performance improved by 6.2% in the last training round',
      impact: 'High',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      timestamp: '2 hours ago',
      details: 'Your Chest X-Ray model achieved 97.1% accuracy, surpassing the previous 91.2%'
    },
    {
      id: 2,
      type: 'success',
      icon: Shield,
      title: 'Highly Reliable Contributor',
      message: 'This client is now considered highly reliable for aggregation',
      impact: 'High',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      timestamp: '3 hours ago',
      details: 'Consistent performance across 15 rounds with 98% on-time submission rate'
    },
    {
      id: 3,
      type: 'success',
      icon: Activity,
      title: 'Representation Divergence Improved',
      message: 'Representation divergence decreased significantly by 34%',
      impact: 'Medium',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      timestamp: '5 hours ago',
      details: 'Your local representations are now more aligned with the global model'
    },
    {
      id: 4,
      type: 'achievement',
      icon: Award,
      title: 'Top 10% Contributor',
      message: 'You rank in the top 10% of all federated learning participants',
      impact: 'High',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      timestamp: '1 day ago',
      details: 'Your contribution weight increased from 0.08 to 0.24 over 15 rounds'
    },
    {
      id: 5,
      type: 'info',
      icon: Target,
      title: 'Optimal Dataset Size Detected',
      message: 'Your dataset size is optimal for maximizing contribution weight',
      impact: 'Medium',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      borderColor: 'border-cyan-200 dark:border-cyan-800',
      timestamp: '1 day ago',
      details: '4,200 samples provide excellent balance between diversity and quality'
    },
    {
      id: 6,
      type: 'warning',
      icon: AlertCircle,
      title: 'Training Time Optimization',
      message: 'Consider reducing training epochs from 50 to 35 for faster convergence',
      impact: 'Low',
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      timestamp: '2 days ago',
      details: 'Analysis shows diminishing returns after epoch 35 in your current setup'
    },
    {
      id: 7,
      type: 'success',
      icon: Brain,
      title: 'SSL Quality Excellence',
      message: 'Your self-supervised learning quality score reached 0.91 (Excellent)',
      impact: 'High',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      timestamp: '2 days ago',
      details: 'High-quality representations contribute to better global model performance'
    },
    {
      id: 8,
      type: 'success',
      icon: Zap,
      title: 'Fast Convergence Detected',
      message: 'Your model converged 40% faster than the federated average',
      impact: 'Medium',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      timestamp: '3 days ago',
      details: 'Efficient training process reduces computational costs and time'
    },
  ];

  const metrics = [
    { label: 'Performance Trend', value: '+6.2%', icon: ArrowUp, color: 'text-green-600 dark:text-green-400' },
    { label: 'Reliability Score', value: '98/100', icon: CheckCircle, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Contribution Rank', value: '#4', icon: Award, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Divergence', value: '-34%', icon: ArrowDown, color: 'text-green-600 dark:text-green-400' },
  ];

  const getImpactBadge = (impact: string) => {
    if (impact === 'High') {
      return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    } else if (impact === 'Medium') {
      return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    } else {
      return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <Badge className="bg-white/20 text-white border-0 mb-3">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Intelligence
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Insights
          </h1>
          <p className="text-purple-100 text-lg">
            Intelligent analysis and recommendations powered by machine learning
          </p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-xl bg-white dark:bg-slate-800 hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI-Generated Insights */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            AI-Generated Insights
          </h2>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
            {insights.length} New Insights
          </Badge>
        </div>

        <div className="grid gap-6">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card
                key={insight.id}
                className={`border-2 ${insight.borderColor} ${insight.bgColor} hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
              >
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${insight.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {insight.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                            {insight.message}
                          </p>
                        </div>
                        <Badge className={`${getImpactBadge(insight.impact)} border flex-shrink-0`}>
                          {insight.impact} Impact
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 mb-3 border border-gray-200/50 dark:border-slate-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {insight.details}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Activity className="w-3 h-3" />
                        <span>{insight.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <CardContent className="pt-8 pb-8 relative">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">Overall Performance Summary</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-4">
                Your federated learning participation is exceptional. You've demonstrated consistent improvements in model performance, maintained high reliability, and contributed significantly to the global model's success. Keep up the excellent work!
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Excellent Contributor
                </Badge>
                <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  Top 10% Rank
                </Badge>
                <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  High Performance
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
