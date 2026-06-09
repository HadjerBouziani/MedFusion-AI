import { Link } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, Search, Filter, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
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
  created_at: string;
}

export function CaseHistory() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Fetch diagnoses from Supabase
  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diagnoses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error: any) {
      console.error('Error fetching diagnoses:', error);
      toast.error(`Failed to load cases: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagnosis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diagnoses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Also delete the image from storage if it exists
      const diagnosisToDelete = cases.find(c => c.id === id);
      if (diagnosisToDelete?.image_url) {
        // Extract filename from URL
        const fileName = diagnosisToDelete.image_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('diagnosis-images')
            .remove([fileName]);
        }
      }
      
      // Remove from local state
      setCases(prevCases => prevCases.filter(c => c.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting diagnosis:', error);
      toast.error(`Failed to delete: ${error.message}`);
      return false;
    }
  };

  const handleDelete = async (e: React.MouseEvent, caseId: string, patientName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirmDeleteId === caseId) {
      const success = await deleteDiagnosis(caseId);
      if (success) {
        toast.success(`Case for patient ${patientName} deleted`);
        setConfirmDeleteId(null);
      }
    } else {
      setConfirmDeleteId(caseId);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Map modality to display type for filtering
  const getModalityType = (modality: string): string => {
    const modalityMap: Record<string, string> = {
      'Chest X-Ray': 'xray',
      'Brain MRI': 'mri',
      'Retinal OCT': 'retina',
      'Skin Lesion': 'skin',
    };
    return modalityMap[modality] || modality.toLowerCase();
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patient_medical_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || getModalityType(c.modality) === filterType;
    return matchesSearch && matchesType;
  });

  // Get image URL from database or use placeholder
  const getImageUrl = (diagnosis: Diagnosis): string => {
    // If image_url exists in database, use it
    if (diagnosis.image_url) return diagnosis.image_url;
    
    // Otherwise return a placeholder based on modality
    const placeholders: Record<string, string> = {
      'Chest X-Ray': 'https://images.unsplash.com/photo-1581595220895-b2d2d8b7c86a?w=400&h=300&fit=crop',
      'Brain MRI': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
      'Retinal OCT': 'https://images.unsplash.com/photo-1581595220895-b2d2d8b7c86a?w=400&h=300&fit=crop',
      'Skin Lesion': 'https://images.unsplash.com/photo-1581595220895-b2d2d8b7c86a?w=400&h=300&fit=crop',
    };
    return placeholders[diagnosis.modality] || 'https://images.unsplash.com/photo-1581595220895-b2d2d8b7c86a?w=400&h=300&fit=crop';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Case History</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Review and manage your previous diagnostic analyses</p>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search by patient name, medical ID, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div className="flex items-center gap-2 sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">All Types</SelectItem>
                  <SelectItem value="xray" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">X-Ray</SelectItem>
                  <SelectItem value="skin" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Skin Lesion</SelectItem>
                  <SelectItem value="retina" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Retinal OCT</SelectItem>
                  <SelectItem value="mri" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Brain MRI</SelectItem>
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Cases Grid */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                <CardContent className="py-24">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
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
                  <Card className="h-full border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group bg-white dark:bg-slate-800">
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-slate-700">
                        <img
                          src={getImageUrl(caseItem)}
                          alt={caseItem.diagnosis}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // If image fails to load, use placeholder
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581595220895-b2d2d8b7c86a?w=400&h=300&fit=crop';
                          }}
                        />
                        <Badge className="absolute top-3 right-3 shadow-sm bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white">
                          {caseItem.modality.toUpperCase()}
                        </Badge>
                        <Badge className={`absolute top-3 left-3 shadow-sm border-0 ${
                          caseItem.risk_level === 'High' ? 'bg-red-500' :
                          caseItem.risk_level === 'Moderate' ? 'bg-amber-500' : 'bg-green-500'
                        }`}>
                          {caseItem.risk_level} Risk
                        </Badge>
                      </div>
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {caseItem.diagnosis}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Patient: {caseItem.patient_name} ({caseItem.patient_medical_id})
                          </p>
                          {caseItem.patient_age && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Age: {caseItem.patient_age} • Gender: {caseItem.patient_gender || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                          <Badge 
                            variant={caseItem.confidence > 85 ? 'default' : 'secondary'}
                            className={caseItem.confidence > 85 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white' 
                              : 'bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white'
                            }
                          >
                            {caseItem.confidence}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(caseItem.created_at)}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">{caseItem.model_name}</span>
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
                        onClick={(e) => handleDelete(e, caseItem.id, caseItem.patient_name)}
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
                      onClick={(e) => handleDelete(e, caseItem.id, caseItem.patient_name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 rounded-lg flex items-center justify-center shadow-sm"
                      title="Delete case"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}