import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Activity,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  Save,
  Send,
  Brain,
  Eye,
  FileText,
  Sparkles,
  User,
  Calendar,
  Hash,
  ImageIcon,
  Zap,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

type Modality = 'Chest X-Ray' | 'Brain MRI' | 'Retinal OCT' | 'Skin Lesion' | null;

interface Model {
  id: number;
  name: string;
  status: 'Clinical Approved' | 'Experimental';
  accuracy: string;
}

export function DiagnosisTool() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModality, setSelectedModality] = useState<Modality>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    medicalId: ''
  });
  const [doctorNotes, setDoctorNotes] = useState('');

  const modalities = [
    {
      name: 'Chest X-Ray',
      icon: '🫁',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950',
      description: 'Pneumonia, TB, COVID-19'
    },
    {
      name: 'Brain MRI',
      icon: '🧠',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      bg: 'from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950',
      description: 'Tumors, Lesions, Abnormalities'
    },
    {
      name: 'Retinal OCT',
      icon: '👁️',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bg: 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
      description: 'CNV, DME, Drusen'
    },
    {
      name: 'Skin Lesion',
      icon: '🔬',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bg: 'from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950',
      description: 'Melanoma, Malignant Detection'
    },
  ];

  const modelsByModality: Record<string, Model[]> = {
    'Chest X-Ray': [
      { id: 1, name: 'ResNet18 SSL-FL v2.1', status: 'Clinical Approved', accuracy: '97.87%' },
      { id: 2, name: 'DenseNet121 SSL-FL v2.0', status: 'Experimental', accuracy: '96.45%' },
    ],
    'Brain MRI': [
      { id: 3, name: 'DenseNet121 SSL-FL v3.0', status: 'Clinical Approved', accuracy: '99.02%' },
      { id: 4, name: 'EfficientNet-B4 SSL-FL v1.5', status: 'Experimental', accuracy: '98.15%' },
    ],
    'Retinal OCT': [
      { id: 5, name: 'EfficientNet-B3 SSL-FL v1.8', status: 'Clinical Approved', accuracy: '97.50%' },
      { id: 6, name: 'ResNet50 SSL-FL v2.3', status: 'Experimental', accuracy: '96.80%' },
    ],
    'Skin Lesion': [
      { id: 7, name: 'MobileNetV2 SSL-FL v2.5', status: 'Clinical Approved', accuracy: '94.30%' },
      { id: 8, name: 'InceptionV3 SSL-FL v1.9', status: 'Experimental', accuracy: '93.75%' },
    ],
  };

  const steps = [
    { number: 1, title: 'Modality', icon: Activity },
    { number: 2, title: 'Model', icon: Brain },
    { number: 3, title: 'Patient Info', icon: User },
    { number: 4, title: 'Upload', icon: Upload },
    { number: 5, title: 'Results', icon: Sparkles },
    { number: 6, title: 'Explainability', icon: Eye },
    { number: 7, title: 'Report', icon: FileText },
  ];

  const renderProgressBar = () => (
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 -z-10">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center relative">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50'
                    : isCurrent
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/50 scale-110'
                    : 'bg-gray-200 dark:bg-slate-700'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                )}
              </div>
              <p className={`mt-2 text-xs font-medium ${
                isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
          Choose Imaging Modality
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the type of medical scan you want to analyze with AI-powered diagnosis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {modalities.map((modality) => {
          const isSelected = selectedModality === modality.name;
          return (
            <div
              key={modality.name}
              onClick={() => setSelectedModality(modality.name as Modality)}
              className="group relative cursor-pointer"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${modality.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />

              <Card className={`relative border-2 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? `border-transparent shadow-2xl ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900`
                  : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-xl'
              }`}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${modality.bg} opacity-${isSelected ? '100' : '0'} transition-opacity`} />

                <CardContent className="relative pt-8 pb-8">
                  <div className="flex items-center gap-6">
                    {/* Icon */}
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${modality.gradient} rounded-2xl flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110 ${isSelected ? 'scale-110' : ''}`}>
                      <span className="text-4xl">{modality.icon}</span>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-800">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {modality.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {modality.description}
                      </p>
                      {isSelected && (
                        <Badge className="mt-3 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={() => setCurrentStep(2)}
          disabled={!selectedModality}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all px-8"
        >
          Continue to Model Selection
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const availableModels = selectedModality ? modelsByModality[selectedModality] : [];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Select AI Model
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a trained model for {selectedModality} analysis
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {availableModels.map((model) => {
            const isSelected = selectedModel?.id === model.id;
            return (
              <div key={model.id} onClick={() => setSelectedModel(model)} className="group cursor-pointer">
                <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${
                  isSelected
                    ? 'border-blue-500 dark:border-blue-400 shadow-xl ring-2 ring-blue-500/20 dark:ring-blue-400/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                } bg-white dark:bg-slate-800/50`}>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${
                        model.status === 'Clinical Approved' ? 'from-green-500 to-emerald-600' : 'from-amber-500 to-orange-600'
                      } rounded-xl flex items-center justify-center shadow-lg`}>
                        <Brain className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{model.name}</h3>
                            <div className="flex items-center gap-3">
                              <Badge className={`${
                                model.status === 'Clinical Approved'
                                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                                  : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              } border`}>
                                {model.status === 'Clinical Approved' ? (
                                  <Shield className="w-3 h-3 mr-1" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                )}
                                {model.status}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{model.accuracy}</span>
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between max-w-4xl mx-auto pt-6">
          <Button variant="outline" onClick={() => setCurrentStep(1)} size="lg" className="dark:border-slate-600 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={!selectedModel}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-xl"
          >
            Continue to Patient Info
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderProgressBar()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {/* Other steps to be continued... */}
    </div>
  );
}
