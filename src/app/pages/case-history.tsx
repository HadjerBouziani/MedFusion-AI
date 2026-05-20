import { Link } from 'react-router';
import { useCases } from '../context/case-context';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, Search, Filter, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function CaseHistory() {
  const { cases, deleteCase } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || c.imageType === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (e: React.MouseEvent, caseId: string, patientId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeleteId === caseId) {
      deleteCase(caseId);
      toast.success(`Case for patient ${patientId} deleted`);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(caseId);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Case History</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Review and manage your previous diagnostic analyses</p>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by patient ID or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex items-center gap-2 sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 h-11">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="xray">X-Ray</SelectItem>
                  <SelectItem value="skin">Skin Lesion</SelectItem>
                  <SelectItem value="retina">Retinal Scan</SelectItem>
                  <SelectItem value="ct">CT Scan</SelectItem>
                  <SelectItem value="mri">MRI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">{filteredCases.length}</span> of{' '}
          <span className="font-medium text-gray-900 dark:text-white">{cases.length}</span> cases
        </p>
      </div>

      {/* Cases Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-gray-200 dark:border-slate-700 shadow-sm">
              <CardContent className="py-24">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No cases found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try adjusting your filters</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="relative group">
              <Link to={`/case/${caseItem.id}`}>
                <Card className="h-full border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-slate-800">
                      <img
                        src={caseItem.imageUrl}
                        alt={caseItem.diagnosis}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 shadow-sm">
                        {caseItem.imageType.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {caseItem.diagnosis}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Patient: {caseItem.patientId}</p>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                        <Badge variant={caseItem.confidence > 85 ? 'default' : 'secondary'}>
                          {caseItem.confidence}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(caseItem.date).toLocaleDateString()}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500">{caseItem.modelVersion}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Delete button overlay */}
              <div className="absolute top-3 left-3 z-10">
                {confirmDeleteId === caseItem.id ? (
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-1">
                    <button
                      onClick={(e) => handleDelete(e, caseItem.id, caseItem.patientId)}
                      className="text-xs font-semibold px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="text-xs font-semibold px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleDelete(e, caseItem.id, caseItem.patientId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 rounded-lg flex items-center justify-center shadow-sm"
                    title="Delete case"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}