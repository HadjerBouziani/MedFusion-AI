
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Eye, EyeOff, Shield, Stethoscope, FlaskConical, Check,
  Mail, Lock, Building2, MapPin, Phone, User
} from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../context/user-context';
import { supabase } from './../../lib/supabaseClient'
import logo from './image.png';

type Mode = 'login' | 'signup';

export function Login() {
  const navigate = useNavigate();
  const { setRole } = useUser();
  const [mode, setMode] = useState<Mode>('login');

  // Login-only
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'ai-team'>('doctor');

  // Shared
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Signup-only (hospital fields)
  const [hospitalName, setHospitalName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setHospitalName('');
    setAdminName('');
    setContactPhone('');
    setCountry('');
    setCity('');
    setFullAddress('');
    setConfirmPassword('');
    setShowConfirm(false);
  };

  // ── LOGIN ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      setRole(selectedRole);
      toast.success(
        selectedRole === 'doctor' ? 'Welcome back, Doctor!' : 'Welcome to AI Team Platform!'
      );
      navigate('/');
    }

    setIsLoading(false);
  };

  // ── SIGNUP (hospital) ──
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      toast.error(authError.message);
      setIsLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      toast.error('Signup failed — no user ID returned.');
      setIsLoading(false);
      return;
    }

    // 2. Insert hospital row
    const { error: insertError } = await supabase.from('hospitals').insert({
      id: userId,
      name: hospitalName,
      contact_email: email,
      admin_name: adminName,
      admin_email: email,
      contact_phone: contactPhone || null,
      country: country || null,
      city: city || null,
      full_address: fullAddress || null,
      status: 'pending',         // default status awaiting approval
      plan: null,
      number_of_doctors: null,
      number_of_ai_team: null,
      location: null,
    });

    if (insertError) {
      toast.error(`Hospital profile setup failed: ${insertError.message}`);
      setIsLoading(false);
      return;
    }

    toast.success('Hospital registered! Check your email to confirm your account.');
    switchMode('login');
    setIsLoading(false);
  };

  const roles = [
    {
      id: 'doctor' as const,
      name: 'Doctor Platform',
      description: 'Clinical diagnosis and patient care',
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'ai-team' as const,
      name: 'AI Team Platform',
      description: 'Federated learning & model training',
      icon: FlaskConical,
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src={logo} alt="MedFusion-AI Logo" className="w-12 h-12 rounded-xl shadow-lg object-cover" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MedFusion-AI
            </h1>
          </div>
          <p className="text-gray-600">Federated Learning Platform for Medical AI</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            {/* Toggle tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-2">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register Hospital
              </button>
            </div>

            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome back' : 'Register your hospital'}
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Select your platform and enter credentials'
                : 'Create a hospital account to join the platform'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ── LOGIN FORM ── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label>Select Platform</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-lg flex items-center justify-center mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{role.name}</h3>
                          <p className="text-xs text-gray-600">{role.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me for 30 days
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Signing in...'
                    : `Sign In to ${selectedRole === 'doctor' ? 'Doctor' : 'AI Team'} Platform`}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  New hospital?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Register here
                  </button>
                </p>
              </form>
            )}

            {/* ── SIGNUP FORM (hospital) ── */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Hospital info */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hospital Info</p>

                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="hospitalName"
                      type="text"
                      placeholder="City General Hospital"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      required
                      className="h-11 pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country <span className="text-gray-400 text-xs">(optional)</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="country"
                        type="text"
                        placeholder="Algeria"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-gray-400 text-xs">(optional)</span></Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Algiers"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullAddress">Full Address <span className="text-gray-400 text-xs">(optional)</span></Label>
                  <Input
                    id="fullAddress"
                    type="text"
                    placeholder="123 Medical Ave, Algiers"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Admin info */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Admin Contact</p>

                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="adminName"
                      type="text"
                      placeholder="John Doe"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                      className="h-11 pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="admin@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone <span className="text-gray-400 text-xs">(optional)</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+213 555 000 000"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Account Password</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 pl-9 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-11 pl-9 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering hospital...' : 'Register Hospital'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>HIPAA Compliant • End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
}