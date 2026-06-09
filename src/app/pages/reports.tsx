import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Download,
  FileText,
  Calendar,
  Search,
  Printer,
  Mail,
  Share2,
  TrendingUp,
  FileCheck,
  Filter,
  BarChart3,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { supabase } from './../../lib/supabaseClient';

interface Diagnosis {
  id: string;
  patient_name: string;
  patient_age: number | null;
  patient_gender: string | null;
  patient_medical_id: string;
  modality: string;
  model_name: string;
  model_accuracy: string;
  diagnosis: string;
  confidence: number;
  risk_level: string;
  class_probabilities: Array<{ label: string; probability: number }>;
  doctor_notes: string | null;
  image_url: string | null;
  grad_cam_url: string | null;
  report_url: string | null;
  created_at: string;
}

export function Reports() {
  const [cases, setCases] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [diagnosisType, setDiagnosisType] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // Fetch diagnoses from Supabase
  useEffect(() => {
    fetchDiagnoses();
  }, [searchTerm, filter, diagnosisType, currentPage]);

  const fetchDiagnoses = async () => {
    try {
      setLoading(true);
      
      // Build the query
      let query = supabase.from('diagnoses').select('*', { count: 'exact' });
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(
          `patient_name.ilike.%${searchTerm}%,` +
          `patient_medical_id.ilike.%${searchTerm}%,` +
          `diagnosis.ilike.%${searchTerm}%,` +
          `modality.ilike.%${searchTerm}%`
        );
      }
      
      // Apply modality filter
      if (diagnosisType !== 'all') {
        const modalityMap: Record<string, string> = {
          'xray': 'Chest X-Ray',
          'skin': 'Skin Lesion',
          'retina': 'Retinal OCT',
          'ct': 'CT Scan',
          'mri': 'Brain MRI',
        };
        const modality = modalityMap[diagnosisType];
        if (modality) {
          query = query.eq('modality', modality);
        }
      }
      
      // Apply time filter
      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      } else if (filter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('created_at', monthAgo.toISOString());
      }
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      setCases(data || []);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error: any) {
      console.error('Error fetching diagnoses:', error);
      toast.error(`Failed to load reports: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagnosis = async (id: string) => {
    try {
      // Delete associated files from storage
      const diagnosisToDelete = cases.find(c => c.id === id);
      
      if (diagnosisToDelete?.image_url) {
        const originalPath = diagnosisToDelete.image_url.split('/').pop();
        if (originalPath) {
          await supabase.storage.from('diagnosis-images').remove([`original-images/${originalPath}`]);
        }
      }
      
      if (diagnosisToDelete?.grad_cam_url) {
        const gradCamPath = diagnosisToDelete.grad_cam_url.split('/').pop();
        if (gradCamPath) {
          await supabase.storage.from('diagnosis-images').remove([`gradcam-images/${gradCamPath}`]);
        }
      }
      
      if (diagnosisToDelete?.report_url) {
        const reportPath = diagnosisToDelete.report_url.split('/').pop();
        if (reportPath) {
          await supabase.storage.from('diagnosis-reports').remove([reportPath]);
        }
      }
      
      // Delete from database
      const { error } = await supabase
        .from('diagnoses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the list
      await fetchDiagnoses();
      return true;
    } catch (error: any) {
      console.error('Error deleting diagnosis:', error);
      toast.error(`Failed to delete: ${error.message}`);
      return false;
    }
  };

  const handleDelete = async (caseId: string, patientName: string) => {
    if (confirmDeleteId === caseId) {
      const success = await deleteDiagnosis(caseId);
      if (success) {
        toast.success(`Report for patient ${patientName} deleted`);
        setConfirmDeleteId(null);
      }
    } else {
      setConfirmDeleteId(caseId);
    }
  };

  const downloadReport = async (caseData: Diagnosis) => {
    if (!caseData.report_url) {
      toast.error('No report available for this case');
      return;
    }
    
    try {
      const response = await fetch(caseData.report_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Medical_Report_${caseData.patient_medical_id}_${new Date(caseData.created_at).toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Medical report for patient ${caseData.patient_name} downloaded as PDF`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const printReport = (patientName: string) => {
    toast.info(`Print feature: Report for ${patientName} would open print dialog`);
  };

  const emailReport = (patientName: string) => {
    toast.info(`Email feature: Report for ${patientName} would be sent via secure email`);
  };

  const downloadAllReports = async () => {
    toast.info(`Packaging ${totalCount} reports for download...`);
    // This would need to be implemented with a backend service for multiple reports
    toast.success(`Report packaging feature coming soon!`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Get modality display name for filtering
  const getModalityDisplay = (modality: string): string => {
    const modalityMap: Record<string, string> = {
      'Chest X-Ray': 'xray',
      'Skin Lesion': 'skin',
      'Retinal OCT': 'retina',
      'Brain MRI': 'mri',
    };
    return modalityMap[modality] || modality.toLowerCase();
  };

  // Calculate statistics from all data (not just current page)
  const [stats, setStats] = useState({ total: 0, weekCount: 0, monthCount: 0, highConfidenceCount: 0 });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total count
        const { count: total } = await supabase
          .from('diagnoses')
          .select('*', { count: 'exact', head: true });
        
        // Get week count
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: week } = await supabase
          .from('diagnoses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo.toISOString());
        
        // Get month count
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const { count: month } = await supabase
          .from('diagnoses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthAgo.toISOString());
        
        // Get high confidence count
        const { count: highConf } = await supabase
          .from('diagnoses')
          .select('*', { count: 'exact', head: true })
          .gt('confidence', 85);
        
        setStats({
          total: total || 0,
          weekCount: week || 0,
          monthCount: month || 0,
          highConfidenceCount: highConf || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const weekCount = stats.weekCount;
  const monthCount = stats.monthCount;
  const highConfidenceCount = stats.highConfidenceCount;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">Patient Reports</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Generate and manage comprehensive medical reports</p>
        </div>
        {stats.total > 0 && (
          <Button onClick={downloadAllReports} className="hidden md:flex gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:-translate-y-1">
            <Download className="w-4 h-4" />
            Download All Reports
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wider mb-2">Total Reports</p>
                <p className="text-5xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wider mb-2">This Month</p>
                <p className="text-5xl font-bold text-white">{monthCount}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wider mb-2">This Week</p>
                <p className="text-5xl font-bold text-white">{weekCount}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-100 uppercase tracking-wider mb-2">High Confidence</p>
                <p className="text-5xl font-bold text-white">{highConfidenceCount}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FileCheck className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Reports List */}
      <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Patient Medical Reports
              </CardTitle>
              <CardDescription className="mt-1">Download, print, or email patient diagnostic reports</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search by patient name, medical ID, diagnosis, or scan type..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
              />
            </div>

            {/* Diagnosis type select */}
            <div className="flex items-center gap-2 sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Select value={diagnosisType} onValueChange={(value) => { setDiagnosisType(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-48 h-11 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="xray">X-Ray</SelectItem>
                  <SelectItem value="skin">Skin Lesion</SelectItem>
                  <SelectItem value="retina">Retinal OCT</SelectItem>
                  <SelectItem value="mri">Brain MRI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time filter buttons */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => { setFilter('all'); setCurrentPage(1); }}
                className="gap-2"
              >
                All
              </Button>
              <Button
                variant={filter === 'week' ? 'default' : 'outline'}
                onClick={() => { setFilter('week'); setCurrentPage(1); }}
              >
                Week
              </Button>
              <Button
                variant={filter === 'month' ? 'default' : 'outline'}
                onClick={() => { setFilter('month'); setCurrentPage(1); }}
              >
                Month
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          {(searchTerm || filter !== 'all' || diagnosisType !== 'all') && (
            <div className="flex items-center justify-between text-sm bg-blue-50 dark:bg-slate-800 p-3 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Showing <span className="font-bold text-blue-600 dark:text-blue-400">{cases.length}</span> of{' '}
                <span className="font-bold text-gray-900 dark:text-white">{totalCount}</span> reports
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchTerm(''); setFilter('all'); setDiagnosisType('all'); setCurrentPage(1); }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading reports...</span>
            </div>
          )}

          {/* Report List */}
          {!loading && cases.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {searchTerm ? (
                  <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                ) : (
                  <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg mb-2">
                {searchTerm ? 'No reports found' : 'No reports available'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Analyze some cases to generate reports'}
              </p>
              {!searchTerm && (
                <Link to="/diagnosis">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                    Go to Diagnosis Tool
                  </Button>
                </Link>
              )}
            </div>
          ) : !loading && (
            <div className="space-y-3">
              {cases.map((caseItem, index) => (
                <div
                  key={caseItem.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent dark:hover:from-slate-800/50 dark:hover:to-transparent transition-all group hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {caseItem.patient_name}
                      </h3>
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white text-xs">
                        {caseItem.modality.toUpperCase()}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          caseItem.confidence > 85
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white'
                        }`}
                      >
                        {caseItem.confidence}% confidence
                      </Badge>
                      <Badge className={`text-xs border-0 ${
                        caseItem.risk_level === 'High' ? 'bg-red-500' :
                        caseItem.risk_level === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'
                      } text-white`}>
                        {caseItem.risk_level} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      {caseItem.diagnosis} • Medical ID: {caseItem.patient_medical_id}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Model: {caseItem.model_name}</span>
                      {caseItem.patient_age && (
                        <>
                          <span>•</span>
                          <span>Age: {caseItem.patient_age}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Link to={`/case/${caseItem.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 hover:bg-blue-50 dark:hover:bg-slate-800">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => downloadReport(caseItem)}
                      disabled={!caseItem.report_url}
                      className="flex-1 sm:flex-none gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printReport(caseItem.patient_name)}
                      className="gap-2 hover:bg-blue-50 dark:hover:bg-slate-800"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => emailReport(caseItem.patient_name)}
                      className="gap-2 hover:bg-blue-50 dark:hover:bg-slate-800"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>

                    {/* Delete */}
                    {confirmDeleteId === caseItem.id ? (
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-1">
                        <button
                          onClick={() => handleDelete(caseItem.id, caseItem.patient_name)}
                          className="text-xs font-semibold px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-semibold px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(caseItem.id, caseItem.patient_name)}
                        className="gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} reports
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-9 h-9 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Information */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            What's Included in Patient Reports
          </CardTitle>
          <CardDescription>Each medical report contains comprehensive diagnostic information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Medical Images</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Original scan with AI analysis overlay and annotations</p>
            </div>
            <div className="space-y-2 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-green-500/30">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Diagnosis Details</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Primary diagnosis with confidence scores and clinical notes</p>
            </div>
            <div className="space-y-2 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">AI Findings</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Detailed AI reasoning and key observation points</p>
            </div>
            <div className="space-y-2 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white">Patient Info</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Patient ID, scan date, model version, and physician details</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">HIPAA-Compliant Report Sharing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All reports are encrypted and can be securely shared via email or downloaded as PDF documents.
                Reports include your medical license information and digital signature for official documentation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}