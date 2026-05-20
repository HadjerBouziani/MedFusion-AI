import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Upload, CheckCircle, XCircle, AlertTriangle, FileArchive, ArrowLeft } from 'lucide-react';

export function UploadUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validationChecks = [
    { name: 'Correct modality', status: 'passed', purpose: 'Prevent wrong uploads' },
    { name: 'Correct architecture', status: 'passed', purpose: 'Avoid aggregation crash' },
    { name: 'Correct version', status: 'passed', purpose: 'Maintain consistency' },
    { name: 'Weight integrity', status: 'passed', purpose: 'Prevent corruption' },
    { name: 'File size validation', status: 'passed', purpose: 'Ensure complete upload' },
    { name: 'No dataset files', status: 'passed', purpose: 'Privacy protection' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Simulate validation
      setIsValidating(true);
      setTimeout(() => {
        setValidationResults({
          passed: true,
          checks: validationChecks
        });
        setIsValidating(false);
      }, 2000);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    alert('Uploading submission package...');
    // Handle upload logic
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
          Upload Local Update
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your trained model weights after local training
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardContent className="pt-8 pb-8">
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload submission_package.zip
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload your trained weights and auto-generated report
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild className="cursor-pointer">
                <span>
                  <FileArchive className="w-4 h-4 mr-2" />
                  Select File
                </span>
              </Button>
            </label>
            {file && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-block">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {isValidating && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Validating Package...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">Running compatibility and validation checks...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {validationResults && !isValidating && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Validation Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validationResults.checks.map((check: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {check.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : check.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{check.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{check.purpose}</p>
                    </div>
                  </div>
                  <Badge className={`${
                    check.status === 'passed' ? 'bg-green-100 text-green-700 border-green-300' :
                    check.status === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                    'bg-red-100 text-red-700 border-red-300'
                  } border`}>
                    {check.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={!file || !validationResults.passed}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Confirm Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Package Requirements */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Package Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Updated weights:</span> Trained model parameters (*.pth or *.pt file)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Auto-generated report:</span> JSON file with training metrics
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Logs:</span> Training logs and validation results
              </p>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">NO datasets:</span> Never include patient data or raw images
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}