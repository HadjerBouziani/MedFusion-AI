import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { User, Bell, Globe, Shield, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: 'Dr. Hadjer Bouziani',
    email: 'sarah.johnson@hospital.com',
    specialization: 'Radiology',
    licenseNumber: 'MD-123456',
  });

  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    lowConfidence: true,
    modelUpdates: true,
    similarCases: false,
  });

  const [language, setLanguage] = useState('en');

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-8">
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

      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account and application preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Update your personal and professional details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</Label>
              <Input
                id="specialization"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license" className="text-sm font-medium text-gray-700 dark:text-gray-300">License Number</Label>
              <Input
                id="license"
                value={profile.licenseNumber}
                onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                className="h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-700" />
          <Button onClick={handleSaveProfile} size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Notifications</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Configure when and how you receive notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="analysis-complete" className="text-sm font-medium text-gray-900 dark:text-white">Analysis Complete</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notify when image analysis is finished</p>
              </div>
              <Switch
                id="analysis-complete"
                checked={notifications.analysisComplete}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, analysisComplete: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="low-confidence" className="text-sm font-medium text-gray-900 dark:text-white">Low Confidence Alerts</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alert for predictions below 80% confidence</p>
              </div>
              <Switch
                id="low-confidence"
                checked={notifications.lowConfidence}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, lowConfidence: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="model-updates" className="text-sm font-medium text-gray-900 dark:text-white">Model Updates</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notify when the AI model is updated</p>
              </div>
              <Switch
                id="model-updates"
                checked={notifications.modelUpdates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, modelUpdates: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="similar-cases" className="text-sm font-medium text-gray-900 dark:text-white">Similar Cases Found</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alert when similar cases are detected</p>
              </div>
              <Switch
                id="similar-cases"
                checked={notifications.similarCases}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, similarCases: checked })
                }
              />
            </div>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-700" />
          <Button onClick={handleSaveNotifications} size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Language & Region</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Select your preferred language</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="w-full md:w-80 h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <SelectItem value="en" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">English</SelectItem>
                <SelectItem value="es" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Español</SelectItem>
                <SelectItem value="fr" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Français</SelectItem>
                <SelectItem value="de" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">Deutsch</SelectItem>
                <SelectItem value="zh" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator className="bg-gray-200 dark:bg-slate-700" />
          <Button onClick={() => toast.success('Language preference saved!')} size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Save Language
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Privacy & Security</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Manage your data and security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex gap-3 mb-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="font-medium text-blue-900 dark:text-blue-300">Data Privacy Notice</p>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed mb-2">
              All patient data and medical images are stored securely and comply with HIPAA regulations.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-500 leading-relaxed">
              Your cases are currently stored locally in this browser. For production use, connect to a secure 
              backend database with encryption and access controls.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="lg" className="gap-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
            <Button variant="outline" size="lg" className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">Export Data</Button>
            <Button variant="destructive" size="lg" className="bg-red-600 hover:bg-red-700 text-white">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}