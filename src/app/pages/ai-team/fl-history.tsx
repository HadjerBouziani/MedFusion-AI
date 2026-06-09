import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { History, Download, Eye, Info } from 'lucide-react';
import { Link } from 'react-router';

export function FLHistory() {
  const history = [
    // Chest X-Ray - 2026-04-28
    { round: 3, model: 'CXR-RN18-v2.1', modality: 'Chest X-Ray', localAccuracy: '97.1%', uploadDate: '2026-04-28', status: 'Completed' },
    { round: 2, model: 'CXR-RN18-v2.1', modality: 'Chest X-Ray', localAccuracy: '96.9%', uploadDate: '2026-04-28', status: 'Completed' },
    
    // Brain MRI - 2026-05-05
    { round: 4, model: 'MRI-EFF-v1.4', modality: 'Brain MRI', localAccuracy: '96.8%', uploadDate: '2026-05-05', status: 'Completed' },
    { round: 1, model: 'MRI-EFF-v1.4', modality: 'Brain MRI', localAccuracy: '96.5%', uploadDate: '2026-05-05', status: 'Completed' },
    
    // Retinal OCT - 2026-05-05
    { round: 5, model: 'OCT-DN121-v2.0', modality: 'Retinal OCT', localAccuracy: '97.5%', uploadDate: '2026-05-05', status: 'Completed' },
    { round: 4, model: 'OCT-DN121-v2.0', modality: 'Retinal OCT', localAccuracy: '97.2%', uploadDate: '2026-05-05', status: 'Completed' },
    
    // Skin Lesion - 2026-06-12
    { round: 3, model: 'SKN-MBN-v2.5', modality: 'Skin Lesion', localAccuracy: '94.2%', uploadDate: '2026-06-12', status: 'Completed' },
    { round: 2, model: 'SKN-MBN-v2.5', modality: 'Skin Lesion', localAccuracy: '93.9%', uploadDate: '2026-06-12', status: 'Completed' },
  ];

  // Calculate statistics
  const totalRounds = 17;
  const avgAccuracy = 97.3;
  const activeModels = 4;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Federated Participation History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track all your previous federated learning rounds
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="pt-6 pb-6">
            <p className="text-blue-100 mb-1">Total Rounds Completed</p>
            <p className="text-4xl font-bold">{totalRounds}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="pt-6 pb-6">
            <p className="text-green-100 mb-1">Average Local Accuracy</p>
            <p className="text-4xl font-bold">{avgAccuracy}%</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <CardContent className="pt-6 pb-6">
            <p className="text-purple-100 mb-1">Active Models</p>
            <p className="text-4xl font-bold">{activeModels}</p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Participation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Round</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Modality</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Local Accuracy</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Upload Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="font-mono">{item.round}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{item.model}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-700 dark:text-gray-300">{item.modality}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-mono font-semibold text-gray-900 dark:text-white">{item.localAccuracy}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-700 dark:text-gray-300">{item.uploadDate}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-100 text-green-700 border-green-300 border">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/ai/round-details/${item.round}`}>
                          <Button variant="ghost" size="sm" title="View Round Details">
                            <Info className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/ai/training-report/${item.round}`}>
                          <Button variant="ghost" size="sm" title="View Report">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}