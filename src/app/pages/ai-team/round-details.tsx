import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Server,
  TrendingUp,
  Brain,
  Award,
  Activity,
  Users,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router';

export function RoundDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roundNumber = id || '15';

  const roundInfo = {
    roundNumber: parseInt(roundNumber),
    model: 'Chest X-Ray ResNet18 SSL-FL',
    version: 'v1.0',
    startDate: 'May 10, 2026',
    trainingDeadline: 'May 15, 2026',
    aggregationComplete: 'May 16, 2026',
    status: 'Completed',
    color: 'from-blue-500 to-cyan-600'
  };

  const participationSteps = [
    { step: 'Downloaded', status: 'completed', date: '2024-05-10 09:30', icon: Download, color: 'from-green-500 to-emerald-600' },
    { step: 'Trained Locally', status: 'completed', date: '2024-05-14 16:45', icon: Brain, color: 'from-blue-500 to-cyan-600' },
    { step: 'Uploaded', status: 'completed', date: '2024-05-14 17:10', icon: Upload, color: 'from-purple-500 to-indigo-600' },
    { step: 'Aggregated', status: 'completed', date: '2024-05-16 10:20', icon: Server, color: 'from-amber-500 to-orange-600' },
  ];

  const globalImprovements = [
    { metric: 'Global Accuracy', before: '96.2%', after: '97.0%', improvement: '+0.8%', color: 'from-green-500 to-emerald-600' },
    { metric: 'Global F1 Score', before: '95.5%', after: '96.3%', improvement: '+0.8%', color: 'from-blue-500 to-cyan-600' },
    { metric: 'Global Precision', before: '95.8%', after: '96.7%', improvement: '+0.9%', color: 'from-purple-500 to-indigo-600' },
    { metric: 'Global Recall', before: '95.2%', after: '95.9%', improvement: '+0.7%', color: 'from-amber-500 to-orange-600' },
  ];

  const participationStats = {
    totalParticipants: 17,
    submitted: 17,
    onTime: 17,
    yourContribution: 0.24,
    yourRank: 1
  };

  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page in history
  };

  return (
    <div className="space-y-8">
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-white/20 text-white border-0">
              <Activity className="w-3 h-3 mr-1" />
              Round {roundInfo.roundNumber}
            </Badge>
            <Badge className="bg-green-500/90 text-white border-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              {roundInfo.status}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Round {roundInfo.roundNumber} Details
          </h1>
          <p className="text-purple-100 text-lg mb-4">
            {roundInfo.model}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 font-mono">
              {roundInfo.version}
            </Badge>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Round Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Round Started</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{roundInfo.startDate}</p>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Training Deadline</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{roundInfo.trainingDeadline}</p>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aggregation Completed</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{roundInfo.aggregationComplete}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participation Status & Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Participation Steps */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                Your Participation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participationSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="relative">
                      {index < participationSteps.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"></div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg relative z-10`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{step.step}</h4>
                            <Badge className="bg-green-100 text-green-700 border-green-300 border">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {step.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{step.date}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <CardContent className="pt-8 pb-8">
              <Award className="w-12 h-12 text-white mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your Contribution</h3>
              <p className="text-5xl font-bold mb-2">{participationStats.yourContribution}</p>
              <p className="text-purple-100">Contribution Weight</p>
              <Badge className="bg-white/20 text-white border-0 mt-4">
                Rank #{participationStats.yourRank}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Federation Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Participants</span>
                  <span className="font-bold text-gray-900 dark:text-white">{participationStats.totalParticipants}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Submitted</span>
                  <span className="font-bold text-gray-900 dark:text-white">{participationStats.submitted}/{participationStats.totalParticipants}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: `${(participationStats.submitted / participationStats.totalParticipants) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">On Time</span>
                  <span className="font-bold text-gray-900 dark:text-white">{participationStats.onTime}/{participationStats.submitted}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full" style={{ width: `${(participationStats.onTime / participationStats.submitted) * 100}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Improvements */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Global Model Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalImprovements.map((item, index) => (
              <div key={index} className="relative p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300 border">
                    {item.improvement}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{item.metric}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-semibold text-gray-600 dark:text-gray-400 line-through">{item.before}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">{item.after}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Round Summary</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Round {roundInfo.roundNumber} completed successfully with {participationStats.submitted} participants contributing to the global model.
                  The global accuracy improved from 96.2% to 97.0%, achieving a significant +0.8% improvement.
                  Your contribution weight of {participationStats.yourContribution} ranked #{participationStats.yourRank} among all participants.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-wrap gap-3">
            <Link to="/ai/training">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Brain className="w-4 h-4 mr-2" />
                View All Training
              </Button>
            </Link>
            <Link to="/ai/contribution-insights">
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Contribution Insights
              </Button>
            </Link>
            <Link to="/ai/model-versions">
              <Button variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                View Model Versions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}