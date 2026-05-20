import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Brain, CheckCircle, Clock, Upload, TrendingUp, Activity, Zap, Award, ArrowRight, Download, Eye, Sparkles, BarChart3, Users, Server } from 'lucide-react';
import { Link } from 'react-router';

export function AITeamDashboard() {
  const stats = [
    { label: 'Assigned Models', value: '5', icon: Brain, color: 'from-blue-500 to-cyan-600', trend: '+2 this month' },
    { label: 'Completed FL Rounds', value: '18', icon: CheckCircle, color: 'from-green-500 to-emerald-600', trend: '85% success rate' },
    { label: 'Pending Training Tasks', value: '2', icon: Clock, color: 'from-amber-500 to-orange-600', trend: 'Due in 3 days' },
    { label: 'Last Upload', value: 'Today', icon: Upload, color: 'from-purple-500 to-indigo-600', trend: '4:32 PM' },
  ];

  const participationData = [
    { model: 'CXR-RN18-v2.1', round: 'Round 15', status: 'Ready to Train', modality: 'Chest X-Ray', accuracy: '97.1%' },
    { model: 'MRI-EFF-v1.4', round: 'Round 9', status: 'Awaiting Upload', modality: 'Brain MRI', accuracy: '96.8%' },
    { model: 'OCT-DN121-v2.0', round: 'Round 12', status: 'Uploaded', modality: 'Retinal OCT', accuracy: '97.5%' },
    { model: 'SKN-MBN-v2.5', round: 'Round 8', status: 'Ready to Train', modality: 'Skin Lesion', accuracy: '94.2%' },
  ];

  // Federation Stats Data
  const federationStats = {
    totalParticipants: 28,
    submitted: 26,
    onTime: 24,
    yourContribution: 0.24,
    yourRank: 4
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <Badge className="bg-white/20 text-white border-0 mb-3">
              <Activity className="w-3 h-3 mr-1" />
              Federated Learning
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, Research Team!
            </h1>
            <p className="text-blue-100 text-lg">
              You're contributing to cutting-edge privacy-preserving AI
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border-2 border-white/20">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-xl bg-white dark:bg-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Federated Participation */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Participation Table */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Recent Training Activity
                </CardTitle>
                <Link to="/ai/training">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participationData.map((item, index) => {
                  const roundNumber = parseInt(item.round.replace('Round ', ''));
                  return (
                    <Link to={`/ai/round-details/${roundNumber}`} key={index}>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl hover:shadow-md transition-all group cursor-pointer">
                        <div className={`w-12 h-12 bg-gradient-to-br ${
                          item.modality === 'Chest X-Ray' ? 'from-blue-500 to-cyan-600' :
                          item.modality === 'Brain MRI' ? 'from-purple-500 to-indigo-600' :
                          item.modality === 'Retinal OCT' ? 'from-green-500 to-emerald-600' :
                          'from-amber-500 to-orange-600'
                        } rounded-xl flex items-center justify-center shadow-lg`}>
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{item.model}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.modality} • {item.round}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">{item.accuracy}</p>
                          <Badge className={`mt-1 ${
                            item.status === 'Ready to Train' ? 'bg-violet-100 text-violet-700 border-violet-300' :
                            item.status === 'Uploaded' ? 'bg-green-100 text-green-700 border-green-300' :
                            'bg-amber-100 text-amber-700 border-amber-300'
                          } border`}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Federation Stats Section */}
        <div className="space-y-6">
          {/* Your Contribution Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            <CardContent className="pt-8 pb-8 relative">
              <Award className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold mb-2">Your Contribution</h3>
              <p className="text-5xl font-bold mb-2">{federationStats.yourContribution}</p>
              <p className="text-purple-100 mb-2">Contribution Weight</p>
              <Badge className="bg-white/20 text-white border-0">
                Rank #{federationStats.yourRank}
              </Badge>
            </CardContent>
          </Card>

          {/* Federation Stats Card - Only Submitted and On Time */}
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Server className="w-4 h-4 text-white" />
                </div>
                Federation Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Submitted Stat */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Submitted
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{federationStats.submitted}/{federationStats.totalParticipants}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: `${(federationStats.submitted / federationStats.totalParticipants) * 100}%` }}></div>
                </div>
              </div>

              {/* On Time Stat */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    On Time
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{federationStats.onTime}/{federationStats.submitted}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full" style={{ width: `${(federationStats.onTime / federationStats.submitted) * 100}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}