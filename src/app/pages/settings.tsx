import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { User, Bell, Globe, Shield, Lock } from 'lucide-react';

export function Settings() {
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Johnson',
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-2">Manage your account and application preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and professional details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
              <Input
                id="specialization"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license" className="text-sm font-medium">License Number</Label>
              <Input
                id="license"
                value={profile.licenseNumber}
                onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
          <Separator />
          <Button onClick={handleSaveProfile} size="lg">Save Profile</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="analysis-complete" className="text-sm font-medium">Analysis Complete</Label>
                <p className="text-sm text-gray-600">Notify when image analysis is finished</p>
              </div>
              <Switch
                id="analysis-complete"
                checked={notifications.analysisComplete}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, analysisComplete: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="low-confidence" className="text-sm font-medium">Low Confidence Alerts</Label>
                <p className="text-sm text-gray-600">Alert for predictions below 80% confidence</p>
              </div>
              <Switch
                id="low-confidence"
                checked={notifications.lowConfidence}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, lowConfidence: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="model-updates" className="text-sm font-medium">Model Updates</Label>
                <p className="text-sm text-gray-600">Notify when the AI model is updated</p>
              </div>
              <Switch
                id="model-updates"
                checked={notifications.modelUpdates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, modelUpdates: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="similar-cases" className="text-sm font-medium">Similar Cases Found</Label>
                <p className="text-sm text-gray-600">Alert when similar cases are detected</p>
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
          <Separator />
          <Button onClick={handleSaveNotifications} size="lg">Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Select your preferred language</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="w-full md:w-80 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <Button onClick={() => toast.success('Language preference saved!')} size="lg">
            Save Language
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Manage your data and security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
            <div className="flex gap-3 mb-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="font-medium text-blue-900">Data Privacy Notice</p>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed mb-2">
              All patient data and medical images are stored securely and comply with HIPAA regulations.
            </p>
            <p className="text-sm text-blue-700 leading-relaxed">
              Your cases are currently stored locally in this browser. For production use, connect to a secure 
              backend database with encryption and access controls.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="lg" className="gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
            <Button variant="outline" size="lg">Export Data</Button>
            <Button variant="destructive" size="lg">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}