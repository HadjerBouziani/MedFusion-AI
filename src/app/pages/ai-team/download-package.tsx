import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Download, FileCode, FileJson, Package, File, CheckCircle, ArrowLeft } from 'lucide-react';

export function DownloadPackage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const packageFiles = [
    { name: 'notebook.ipynb', icon: FileCode, size: '45 KB', description: 'Training notebook with full workflow' },
    { name: 'global_model.pth', icon: Package, size: '87 MB', description: 'Pre-trained global model weights' },
    { name: 'config.json', icon: FileJson, size: '2 KB', description: 'Training configuration and hyperparameters' },
    { name: 'requirements.txt', icon: File, size: '1 KB', description: 'Python dependencies' },
  ];

  const handleDownload = () => {
    // Simulate download
    alert('Downloading fedsara_client_package.zip...');
  };

  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page in history
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Download Training Package
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Download the complete federated learning client package for local training
        </p>
      </div>

      {/* Package Info */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">fedsara_client_package.zip</h2>
              <p className="text-blue-100">Complete training package • 88 MB</p>
            </div>
          </div>
          <Button
            onClick={handleDownload}
            size="lg"
            className="w-full bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Package
          </Button>
        </CardContent>
      </Card>

      {/* Package Contents */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Package Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packageFiles.map((file, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <file.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{file.name}</h3>
                    <Badge variant="outline" className="text-xs">{file.size}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{file.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {[
              'Download and extract the package on your local machine',
              'Install dependencies: pip install -r requirements.txt',
              'Open notebook.ipynb in Jupyter Lab',
              'Load your local dataset (medical images)',
              'Run training cells to fine-tune the global model',
              'Generate submission package using the final cell',
              'Upload the submission_package.zip back to the platform'
            ].map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
        <CardContent className="pt-6 pb-6">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-amber-900 dark:text-amber-200">Important Reminders:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300">
                <li>Training happens locally on your hospital computer</li>
                <li>Never upload datasets - only model weights</li>
                <li>Ensure HIPAA compliance when handling medical data</li>
                <li>Upload deadline: 7 days from download</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}