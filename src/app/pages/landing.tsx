import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Activity,
  Brain,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Users,
  FileText,
  BarChart3,
  Award,
  Sparkles,
  Lock,
  Lightbulb,
  Network,
  GitBranch,
  Settings,
  FileSearch,
  Database,
  ExternalLink,
  Building2,
  FlaskConical,
  Stethoscope,
} from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FedMedAI
                </h1>
                <p className="text-xs text-gray-500 font-medium">Privacy-Preserving Federated AI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-4 py-1.5">
              <Lock className="w-3 h-3 mr-1" />
              Privacy-Preserving Federated Learning
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              FedMedAI
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-6">
              Privacy-Preserving Federated AI for Medical Imaging
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Federated learning platform that enables hospitals to collaboratively train AI models without sharing patient data. Breakthrough RF-Weighted SSL aggregation delivers state-of-the-art accuracy while preserving privacy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>

            {/* Federated Learning Visual */}
            <div className="mt-16 max-w-6xl mx-auto px-4">
              <style>{`
                @keyframes flowParticle {
                  0% { transform: translateX(0); opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { transform: translateX(100%); opacity: 0; }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
              `}</style>

              <div className="flex items-center justify-center gap-8 lg:gap-16">
                {/* Left: Hospitals */}
                <div className="flex flex-col gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      {/* Animated flow */}
                      <div className="hidden lg:block absolute left-full top-1/2 w-24 h-0.5 bg-blue-200">
                        <div
                          className="w-4 h-0.5 bg-blue-500"
                          style={{
                            animation: `flowParticle 2s ease-in-out infinite`,
                            animationDelay: `${i * 0.6}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Center: Server */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-2xl flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>

                  {/* Animated flow out */}
                  <div className="hidden lg:block absolute left-full top-1/2 w-24 h-0.5 bg-purple-200">
                    <div
                      className="w-4 h-0.5 bg-purple-500"
                      style={{ animation: `flowParticle 2s ease-in-out infinite` }}
                    ></div>
                  </div>
                </div>

                {/* Right: Global Model */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Banner */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur">
            <CardContent className="pt-12 pb-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Medical AI is Limited by Data Silos
                </h2>
              </div>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Healthcare institutions worldwide hold vast amounts of valuable medical imaging data, but strict regulations like <span className="font-semibold text-red-600">HIPAA</span> and <span className="font-semibold text-red-600">GDPR</span> prevent them from sharing this data with each other or with researchers.
                </p>
                <p>
                  This creates isolated data silos that limit the effectiveness of AI models. Models trained on data from a single institution often fail to generalize when deployed in different hospitals with different patient demographics and imaging equipment.
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Federated learning solves this.</span> By training models collaboratively without sharing raw patient data, hospitals can build more robust AI systems while maintaining complete privacy and regulatory compliance.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
                  <p className="text-sm text-gray-600">Full regulatory compliance</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Zero Data Sharing</h3>
                  <p className="text-sm text-gray-600">Patient data never leaves hospital</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Collaborative Learning</h3>
                  <p className="text-sm text-gray-600">Better models for everyone</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Makes It Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced features for production-ready federated learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔒 Privacy-First</h3>
                <p className="text-gray-600 leading-relaxed">
                  No raw data leaves the institution. Only encrypted model weights are transmitted, ensuring complete HIPAA/GDPR compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">🧠 SSL-Guided Aggregation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our novel RF-Weighted SSL algorithm intelligently weights client contributions based on representation quality, outperforming traditional FedAvg.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">🏥 Multi-Dataset Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Works seamlessly across diverse medical imaging modalities: X-Ray, MRI, OCT, and dermatoscopy images.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <GitBranch className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">📊 Non-IID Robust</h3>
                <p className="text-gray-600 leading-relaxed">
                  Handles real-world data heterogeneity where different hospitals have different patient populations and imaging equipment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">⚡ Faster Convergence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Reaches high accuracy in fewer training rounds compared to baseline federated methods, reducing computational costs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">State-of-the-Art Performance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Outperforms FedAvg and FedProx baselines across all datasets with superior accuracy and efficiency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three steps to privacy-preserving collaborative AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Training</h3>
              <p className="text-gray-600 leading-relaxed">
                Each hospital trains the AI model locally on their private patient data. No data ever leaves the institution.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Weight Transmission</h3>
              <p className="text-gray-600 leading-relaxed">
                Only encrypted model weights and parameters are sent to the central server, preserving complete privacy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">RF-Weighted SSL Aggregation</h3>
              <p className="text-gray-600 leading-relaxed">
                Server intelligently combines weights using our novel RF-Weighted SSL algorithm, creating a superior global model.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur inline-block">
              <CardContent className="pt-6 pb-6 px-8">
                <p className="text-lg text-gray-700 max-w-3xl">
                  <span className="font-semibold text-gray-900">The result:</span> A global model that learns from diverse datasets across multiple institutions, achieving state-of-the-art accuracy without compromising patient privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Results */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Performance Results
            </h2>
            <p className="text-xl text-gray-600">
              Outperforming federated learning baselines
            </p>
          </div>

          {/* Main comparison table */}
          <div className="max-w-6xl mx-auto mb-12">
            <Card className="border-0 shadow-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 px-8 py-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <h3 className="font-semibold text-gray-900">Dataset</h3>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-600 text-sm">FedAvg</h3>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-600 text-sm">FedProx</h3>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm">RF-Weighted SSL</h3>
                    </div>
                  </div>
                </div>

                {/* Rows */}
                {[
                  { icon: '🫁', name: 'Chest X-Ray', fedavg: 94.65, fedprox: 95.12, ours: 97.87, color: 'blue' },
                  { icon: '🧠', name: 'Brain MRI', fedavg: 96.84, fedprox: 97.31, ours: 99.02, color: 'purple' },
                  { icon: '👁️', name: 'Retinal OCT', fedavg: 94.88, fedprox: 95.67, ours: 97.50, color: 'green' },
                  { icon: '🔬', name: 'Skin Lesion', fedavg: 91.73, fedprox: 92.45, ours: 94.30, color: 'amber' }
                ].map((row, i) => (
                  <div key={i} className={`px-8 py-5 hover:bg-gray-50/50 transition-colors ${i < 3 ? 'border-b border-gray-100' : ''}`}>
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="col-span-1 flex items-center gap-3">
                        <span className="text-4xl">{row.icon}</span>
                        <h4 className="font-bold text-gray-900">{row.name}</h4>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-mono font-semibold text-gray-600">{row.fedavg}%</p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-mono font-semibold text-gray-700">{row.fedprox}%</p>
                      </div>

                      <div className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <p className={`text-3xl font-mono font-bold bg-gradient-to-r from-${row.color}-600 to-${row.color}-700 bg-clip-text text-transparent`}>
                            {row.ours}%
                          </p>
                          <Badge className="mt-1 bg-green-100 text-green-700 border-0 text-xs">
                            +{(row.ours - row.fedavg).toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Comparison Cards Grid - Removed for cleaner design */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 hidden">
            {[
              {
                icon: '🫁',
                name: 'Chest X-Ray',
                subtitle: 'Pneumonia Classification (Non-IID)',
                fedavg: '94.65',
                fedprox: '95.12',
                ours: '97.87',
                improvement: '+3.22',
                color: 'blue',
                bgColor: 'from-blue-50 to-cyan-50'
              },
              {
                icon: '🧠',
                name: 'Brain Tumor MRI',
                subtitle: 'Multi-class Tumor Detection',
                fedavg: '96.84',
                fedprox: '97.31',
                ours: '99.02',
                improvement: '+2.18',
                color: 'purple',
                bgColor: 'from-purple-50 to-indigo-50'
              },
              {
                icon: '👁️',
                name: 'Retinal OCT',
                subtitle: 'CNV, DME, Drusen Classification',
                fedavg: '94.88',
                fedprox: '95.67',
                ours: '97.50',
                improvement: '+2.62',
                color: 'green',
                bgColor: 'from-green-50 to-emerald-50'
              },
              {
                icon: '🔬',
                name: 'Skin Lesion HAM10000',
                subtitle: 'Malignant vs Benign Classification',
                fedavg: '91.73',
                fedprox: '92.45',
                ours: '94.30',
                improvement: '+2.57',
                color: 'amber',
                bgColor: 'from-amber-50 to-orange-50'
              }
            ].map((dataset, i) => (
              <Card
                key={i}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur overflow-hidden"
              >
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-5xl">{dataset.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{dataset.name}</h3>
                      <p className="text-sm text-gray-600">{dataset.subtitle}</p>
                    </div>
                  </div>

                  {/* Progress bars comparison */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">FedAvg</span>
                        <span className="text-lg font-bold text-gray-700">{dataset.fedavg}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-1000"
                          style={{ width: `${dataset.fedavg}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">FedProx</span>
                        <span className="text-lg font-bold text-gray-700">{dataset.fedprox}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full transition-all duration-1000"
                          style={{ width: `${dataset.fedprox}%`, transitionDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold text-${dataset.color}-700`}>
                          RF-Weighted SSL (Ours)
                        </span>
                        <span className={`text-xl font-bold bg-gradient-to-r from-${dataset.color}-600 to-${dataset.color}-700 bg-clip-text text-transparent`}>
                          {dataset.ours}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r from-${dataset.color}-500 to-${dataset.color}-600 rounded-full transition-all duration-1000 shadow-lg`}
                          style={{ width: `${dataset.ours}%`, transitionDelay: '0.4s' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Improvement badge */}
                  <div className="mt-6 flex items-center justify-center">
                    <Badge className={`bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300 px-4 py-2 text-base`}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {dataset.improvement}% improvement vs FedAvg
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition duration-300"></div>
              <Card className="relative border border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mb-1">+2.65%</p>
                  <p className="font-semibold text-gray-900">Avg Improvement</p>
                </CardContent>
              </Card>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition duration-300"></div>
              <Card className="relative border border-purple-200 bg-gradient-to-br from-white to-purple-50 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-purple-600 mb-1">40%</p>
                  <p className="font-semibold text-gray-900">Faster Training</p>
                </CardContent>
              </Card>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition duration-300"></div>
              <Card className="relative border border-green-200 bg-gradient-to-br from-white to-green-50 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-green-600 mb-1">100%</p>
                  <p className="font-semibold text-gray-900">Privacy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Medical Datasets */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Supported Medical Datasets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proven performance across diverse imaging modalities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="text-6xl text-center mb-6">🫁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Chest X-Ray</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Pneumonia Detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>TB Screening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>COVID-19 Classification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="text-6xl text-center mb-6">🧠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Brain Tumor MRI</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Glioma Classification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Meningioma Detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Tumor Segmentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="text-6xl text-center mb-6">👁️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Retinal OCT</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>CNV Detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>DME Diagnosis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Drusen Identification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur">
              <CardContent className="pt-8 pb-8">
                <div className="text-6xl text-center mb-6">🔬</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Skin Lesion HAM10000</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Melanoma Detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Malignant vs Benign</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>Lesion Classification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="border-0 shadow-xl bg-blue-50 backdrop-blur inline-block">
              <CardContent className="pt-6 pb-6 px-8">
                <p className="text-gray-700">
                  Platform architecture supports easy integration of additional medical imaging datasets. Contact us to discuss your specific use case.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Access */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Platform Access
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized portals for different user roles
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur overflow-hidden">
              <CardContent className="pt-10 pb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <FlaskConical className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">AI Team Platform</h3>
                <p className="text-gray-600 mb-6 text-center">Researchers & ML Engineers</p>
                <p className="text-gray-700 mb-6 leading-relaxed text-center">
                  Configure models, define training parameters, and manage federated learning experiments
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">Model Configuration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">Training Settings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">FL Parameters</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">Performance Analytics</span>
                  </li>
                </ul>
                <Link to="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 h-12">
                    Access Portal
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur overflow-hidden">
              <CardContent className="pt-10 pb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Physician Platform</h3>
                <p className="text-gray-600 mb-6 text-center">Doctors & End Users</p>
                <p className="text-gray-700 mb-6 leading-relaxed text-center">
                  Upload medical scans and receive AI-assisted diagnostic predictions and insights
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">Scan Upload</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">AI Diagnosis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">Results Viewer</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">Patient Reports</span>
                  </li>
                </ul>
                <Link to="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 h-12">
                    Access Portal
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Architecture Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simplified view of the federated learning pipeline
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur overflow-hidden">
            <CardContent className="pt-12 pb-12">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-12">
                  {/* Step 1: Local Training */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">1</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Step 1: Local Training</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {['Hospital 1', 'Hospital 2', 'Hospital 3'].map((hospital, i) => (
                        <Card key={i} className="border-2 border-blue-200 bg-blue-50">
                          <CardContent className="pt-6 pb-6 text-center">
                            <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                            <p className="font-semibold text-gray-900">{hospital}</p>
                            <p className="text-sm text-gray-600 mt-2">🏥 Local Data</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                      <p className="text-sm text-gray-600 mt-2 font-medium">Step 2: Upload Model Weights</p>
                    </div>
                  </div>

                  {/* Step 2: Central Server */}
                  <div>
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600">
                      <CardContent className="pt-8 pb-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-2xl">
                            <Network className="w-12 h-12 text-white" />
                          </div>
                          <div className="text-white flex-1 text-center md:text-left">
                            <h3 className="text-3xl font-bold mb-2">Central Server</h3>
                            <p className="text-xl mb-4 text-green-100">RF-Weighted SSL Aggregation</p>
                            <p className="text-green-100">(SSL Score + Val Acc + Size)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-blue-600"></div>
                      <p className="text-sm text-gray-600 mt-2 font-medium">Step 3: Broadcast Global Model</p>
                    </div>
                  </div>

                  {/* Step 3: Global Models */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="border-2 border-purple-200 bg-purple-50">
                        <CardContent className="pt-6 pb-6 text-center">
                          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                          <p className="font-semibold text-gray-900">🧠 Global Model</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                    <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Privacy Preserved</h3>
                    <p className="text-sm text-gray-600">Only model weights transmitted</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
                    <Lightbulb className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Intelligent Weighting</h3>
                    <p className="text-sm text-gray-600">RF-SSL scores guide aggregation</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                    <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Better Accuracy</h3>
                    <p className="text-sm text-gray-600">Global model outperforms local models</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About This Research */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About This Research
            </h2>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur">
            <CardContent className="pt-12 pb-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  FedMedAI is a research platform developed as part of a Master's thesis exploring novel approaches to federated learning in medical imaging. The platform introduces <span className="font-semibold text-indigo-600">RF-Weighted Self-Supervised Learning (SSL) aggregation</span>, a breakthrough method that significantly improves upon traditional federated averaging techniques.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  This work addresses critical challenges in medical AI, particularly the inability to share patient data across institutions due to privacy regulations. By enabling collaborative model training without data sharing, we aim to democratize access to high-quality AI models across healthcare systems worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-10 justify-center">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                  <FileText className="w-5 h-5 mr-2" />
                  Read the Thesis
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-purple-500 text-purple-600 hover:bg-purple-50">
                  <Star className="w-5 h-5 mr-2" />
                  View on GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 overflow-hidden">
            <CardContent className="pt-16 pb-16 text-center relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
              <div className="relative z-10">
                <Lock className="w-16 h-16 text-white mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Join the Federated Learning Revolution?
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Be part of the next generation of privacy-preserving medical AI. Collaborate globally while keeping patient data local.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/login">
                    <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-xl">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg border-2 border-white text-white hover:bg-white/10"
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">FedMedAI</span>
              </div>
              <p className="text-gray-600 text-sm">
                Privacy-preserving federated learning platform for medical imaging research.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/login" className="hover:text-blue-600">AI Team Platform</Link></li>
                <li><Link to="/login" className="hover:text-blue-600">Physician Platform</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-600">Research Paper</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">For Research Purposes Only</p>
                  <p className="text-sm text-amber-800">
                    This platform is not approved for clinical deployment. Results should not be used for medical decision-making without proper validation and regulatory approval.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                © 2026 FedMedAI. Master's Thesis Research Project.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
