import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Zap,
  Brain,
  Activity,
  GitBranch,
  Gauge,
  BarChart3,
  LineChart,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Trophy,
  Clock,
  Database,
  Network
} from 'lucide-react';

export function AnalyticsDashboard() {
  // Mock data
  const currentContribution = 0.21;
  const previousContribution = 0.18;
  const contributionChange = ((currentContribution - previousContribution) / previousContribution * 100).toFixed(1);

  const representationQuality = 0.87;
  const sslScore = 0.87;
  const divergenceScore = 0.13;

  const roundHistory = [
    { round: 1, localAcc: 82, contribution: 0.09, sslScore: 0.51, divergence: 0.42 },
    { round: 5, localAcc: 89, contribution: 0.14, sslScore: 0.67, divergence: 0.31 },
    { round: 10, localAcc: 94, contribution: 0.18, sslScore: 0.79, divergence: 0.21 },
    { round: 15, localAcc: 96, contribution: 0.22, sslScore: 0.87, divergence: 0.13 },
  ];

  const performanceComparison = [
    { metric: 'Accuracy', local: 96.1, global: 97.0 },
    { metric: 'F1 Score', local: 95.3, global: 96.2 },
    { metric: 'Recall', local: 94.9, global: 96.0 },
    { metric: 'Precision', local: 95.7, global: 96.4 },
  ];

  const clientRanking = [
    { name: 'Hospital A (You)', contribution: 0.24, rank: 1, quality: 'Excellent' },
    { name: 'Hospital B', contribution: 0.21, rank: 2, quality: 'Excellent' },
    { name: 'Hospital C', contribution: 0.17, rank: 3, quality: 'Good' },
    { name: 'Hospital D', contribution: 0.15, rank: 4, quality: 'Good' },
    { name: 'Hospital E', contribution: 0.12, rank: 5, quality: 'Fair' },
  ];

  const reliabilityScore = 91;

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'from-green-500 to-emerald-600';
    if (score >= 0.6) return 'from-blue-500 to-cyan-600';
    if (score >= 0.4) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getQualityStatus = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Federated Intelligence Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep insights into your contribution and representation quality
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Contribution Weight */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-white/80" />
              <Badge className="bg-white/20 text-white border-0">
                {parseFloat(contributionChange) > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                {Math.abs(parseFloat(contributionChange))}%
              </Badge>
            </div>
            <p className="text-blue-100 text-sm mb-1">Contribution Weight</p>
            <p className="text-4xl font-bold mb-2">{currentContribution.toFixed(2)}</p>
            <p className="text-blue-100 text-xs">Previous: {previousContribution.toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* Representation Quality */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-white/80" />
              <Badge className="bg-white/20 text-white border-0">
                {getQualityStatus(representationQuality)}
              </Badge>
            </div>
            <p className="text-purple-100 text-sm mb-1">Representation Quality</p>
            <p className="text-4xl font-bold mb-2">{representationQuality.toFixed(2)}</p>
            <p className="text-purple-100 text-xs">Out of 1.00</p>
          </CardContent>
        </Card>

        {/* Divergence Score */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <GitBranch className="w-8 h-8 text-white/80" />
              <Badge className="bg-white/20 text-white border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                Low Drift
              </Badge>
            </div>
            <p className="text-green-100 text-sm mb-1">Client Divergence</p>
            <p className="text-4xl font-bold mb-2">{divergenceScore.toFixed(2)}</p>
            <p className="text-green-100 text-xs">Lower is better</p>
          </CardContent>
        </Card>

        {/* Reliability Score */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-white/80" />
              <Badge className="bg-white/20 text-white border-0">
                Top Tier
              </Badge>
            </div>
            <p className="text-amber-100 text-sm mb-1">Reliability Score</p>
            <p className="text-4xl font-bold mb-2">{reliabilityScore}<span className="text-2xl">/100</span></p>
            <p className="text-amber-100 text-xs">Based on consistency</p>
          </CardContent>
        </Card>
      </div>

      {/* Round-by-Round Evolution */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            Round-by-Round Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Round</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Local Accuracy</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Global Contribution</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">SSL Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Divergence</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Trend</th>
                </tr>
              </thead>
              <tbody>
                {roundHistory.map((round, index) => (
                  <tr key={round.round} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="font-mono">Round {round.round}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${round.localAcc}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold font-mono text-gray-900 dark:text-white">{round.localAcc}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold font-mono text-gray-900 dark:text-white">{round.contribution.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${getQualityColor(round.sslScore)} h-2 rounded-full`}
                            style={{ width: `${round.sslScore * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold font-mono text-gray-900 dark:text-white">{round.sslScore.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${
                        round.divergence < 0.2 ? 'bg-green-100 text-green-700 border-green-300' :
                        round.divergence < 0.4 ? 'bg-amber-100 text-amber-700 border-amber-300' :
                        'bg-red-100 text-red-700 border-red-300'
                      } border font-mono`}>
                        {round.divergence.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {index > 0 ? (
                        roundHistory[index].contribution > roundHistory[index - 1].contribution ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : roundHistory[index].contribution < roundHistory[index - 1].contribution ? (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-400" />
                        )
                      ) : (
                        <Minus className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Local vs Global Performance */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Local vs Global Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceComparison.map((metric) => (
                <div key={metric.metric}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.metric}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">Local: {metric.local}%</span>
                      <span className="text-sm font-mono text-purple-600 dark:text-purple-400">Global: {metric.global}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${metric.local}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${metric.global}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Your local model aligns well with the global federation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Aggregation Explanation */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Aggregation Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge className="bg-green-100 text-green-700 border-green-300 border mb-3">
                  Weight Increased +16.7%
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your aggregation weight increased because:
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Lower divergence</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Model updates are more aligned with global distribution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Improved SSL representation quality</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Better semantic feature learning detected</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Higher validation consistency</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Stable performance across multiple validation sets</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Ranking */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Federated Participation Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientRanking.map((client, index) => (
              <div
                key={client.name}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  client.rank === 1
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-700'
                    : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    client.rank === 1 ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white' :
                    client.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                    client.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' :
                    'bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {client.rank === 1 ? '🥇' : client.rank === 2 ? '🥈' : client.rank === 3 ? '🥉' : client.rank}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {client.name}
                      {client.rank === 1 && <Trophy className="w-4 h-4 inline ml-2 text-amber-600" />}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quality: {client.quality}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{client.contribution.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">contribution weight</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Efficiency */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Training Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">83 min</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-0">Efficient</Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upload Size</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">112 MB</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-0">Optimal</Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Communication</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Good</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-0">Fast Convergence</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Model Evolution Timeline */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Model Evolution Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { round: 'Round 1', milestone: 'Initial Global Model', description: 'Baseline federation established' },
              { round: 'Round 5', milestone: 'Improved MRI Feature Stability', description: 'Better representation learning' },
              { round: 'Round 10', milestone: 'Enhanced Non-IID Robustness', description: 'Reduced client drift' },
              { round: 'Round 15', milestone: 'Final Clinical Candidate', description: 'Ready for validation phase' },
            ].map((milestone, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 3 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  } text-white font-bold shadow-lg`}>
                    {index === 3 ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  {index < 3 && <div className="w-0.5 h-12 bg-blue-300 dark:bg-blue-700"></div>}
                </div>
                <div className="flex-1 pb-8">
                  <Badge variant="outline" className="mb-2">{milestone.round}</Badge>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{milestone.milestone}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
