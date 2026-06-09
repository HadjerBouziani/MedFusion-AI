import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Brain, CheckCircle, AlertTriangle, ArrowRight, Activity, Filter, ChevronDown } from 'lucide-react';

export function ClinicalModels() {
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const models = [
  {
    id: 1,
    name: 'Chest X-Ray',
    subtitle: 'FCEB',
    modality: 'Chest X-Ray',
    status: 'Clinical Approved',
    accuracy: '98.51%',
    trainingRounds: 4,
    lastUpdated: '2026-04-28',
    description: 'Normal, Pneumonia, Tuberculosis',
    color: 'from-blue-500 to-cyan-600',
    iconColor: 'text-blue-500',
  },
  {
    id: 2,
    name: 'Brain MRI',
    subtitle: 'FBDB',
    modality: 'Brain MRI',
    status: 'Experimental',
    accuracy: '99.02%',
    trainingRounds: 5,
    lastUpdated: '2026-05-05',
    description: 'Glioma, Meningioma, No Tumor, Pituitary',
    color: 'from-purple-500 to-indigo-600',
    iconColor: 'text-purple-500',
  },
  {
    id: 3,
    name: 'Retinal OCT',
    subtitle: 'FOCB',
    modality: 'Retinal OCT',
    status: 'Clinical Approved',
    accuracy: '97.50%',
    trainingRounds: 5,
    lastUpdated: '2026-05-05',
    description: 'CNV, DME, Drusen, Normal',
    color: 'from-green-500 to-emerald-600',
    iconColor: 'text-green-500',
  },
  {
    id: 4,
    name: 'Skin Lesion',
    subtitle: 'HEAB',
    modality: 'Skin Lesion',
    status: 'Clinical Approved',
    accuracy: '94.30%',
    trainingRounds: 4,
    lastUpdated: '2026-06-12',
    description: 'Benign, Malignant',
    color: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-500',
  },
];

  const modalityOptions = [
    { id: 'all', label: 'All Models', iconColor: 'text-indigo-500' },
    { id: 'Chest X-Ray', label: 'Chest X-Ray', iconColor: 'text-blue-500' },
    { id: 'Brain MRI', label: 'Brain MRI', iconColor: 'text-purple-500' },
    { id: 'Retinal OCT', label: 'Retinal OCT', iconColor: 'text-green-500' },
    { id: 'Skin Lesion', label: 'Skin Lesion', iconColor: 'text-amber-500' },
  ];

  const selectedOption = modalityOptions.find((o) => o.id === selectedModality)!;

  const filteredModels =
    selectedModality === 'all'
      ? models
      : models.filter((m) => m.modality === selectedModality);

  return (
    <div className="space-y-8">

      {/* Top bar with filter — mirrors ContributionInsights */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Clinical Models
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 min-w-[200px]"
          >
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Brain className={`w-5 h-5 flex-shrink-0 ${selectedOption.iconColor}`} />
            <span className="font-semibold flex-1 text-left text-gray-800 dark:text-gray-100 text-sm">
              {selectedOption.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-1.5">
                {modalityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedModality(opt.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left ${
                      selectedModality === opt.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Brain className={`w-5 h-5 ${opt.iconColor}`} />
                    <span
                      className={`flex-1 font-medium text-sm ${
                        selectedModality === opt.id
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {selectedModality === opt.id && (
                      <svg
                        className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Clinical Models</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select and manage AI models for medical image analysis
        </p>
      </div>

      {/* Models Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredModels.map((model) => (
          <Card
            key={model.id}
            className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur overflow-hidden"
          >
            <CardContent className="pt-6 pb-6">
              {/* Model Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${model.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{model.modality}</p>
                </div>
                <Badge
                  className={`${
                    model.status === 'Clinical Approved'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-amber-100 text-amber-700 border-amber-300'
                  } border`}
                >
                  {model.status === 'Clinical Approved' ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {model.status}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                {model.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {model.accuracy}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accuracy</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {model.trainingRounds}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rounds</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {model.lastUpdated}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updated</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link to={`/diagnosis?modelId=${model.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Use for Diagnosis
                  </Button>
                </Link>
                <Link to={`/model-insights/${model.id}`}>
                  <Button variant="outline" className="border-gray-300 dark:border-slate-600">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}