import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Activity,
  FileText,
  ClipboardList,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  User,
  ChevronRight,
  Menu,
  X,
  Search,
  ChevronLeft,
  Home,
  Stethoscope,
  Lightbulb,
  Moon,
  Sun,
  Globe,
  Check,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState } from 'react';
import { useTheme } from '../context/theme-context';
import logoImage from './image.png'; // Import your logo image

export function Layout() {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, language, toggleTheme, setLanguage } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/diagnosis', label: 'Diagnosis Tool', icon: Activity },
    { path: '/models', label: 'Clinical Models', icon: Lightbulb },
    { path: '/history', label: 'Case History', icon: FileText },
    { path: '/reports', label: 'Reports', icon: ClipboardList },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex relative transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 dark:bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
        {/* Glassmorphism sidebar */}
        <div className="h-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-white/30 dark:border-slate-700/50 shadow-2xl shadow-black/5">
          {/* Logo & Collapse Toggle */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/50 dark:border-slate-700/50">
            <div className={`flex items-center gap-3 transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              {/* Replace the Stethoscope icon with your logo image */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="MedFusion AI Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white tracking-tight text-lg">MedFusion AI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Diagnostics Pro</p>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          {!isCollapsed && (
            <div className="px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:translate-x-1'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}
                    <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {active && <ChevronRight className="w-4 h-4 animate-pulse" />}
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Switch Platform Button */}
          {!isCollapsed && (
            <div className="px-3 pb-3">
              <Link to="/ai">
                <Button variant="outline" className="w-full border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Switch to AI Team
                </Button>
              </Link>
            </div>
          )}

          {/* User Info */}
          <div className="p-4 border-t border-gray-200/50 dark:border-slate-700/50">
            <Link to="/profile">
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-slate-800/50 transition-all cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}>
                <Avatar className="ring-2 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">SJ</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Dr. Hadjer Bouziani</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Radiology Specialist</p>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsMobileSidebarOpen(false)}>
          <div className="w-72 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                {/* Replace mobile logo icon with your image */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoImage} 
                    alt="MedFusion AI Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white">MedFusion AI</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Diagnostics Pro</p>
                </div>
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-4 py-6 space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileSidebarOpen(false)}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                      active ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}>
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95">
              <Link to="/profile" onClick={() => setIsMobileSidebarOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800">
                  <Avatar className="ring-2 ring-blue-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Dr. Hadjer Bouziani</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Radiology</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 relative z-10 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Bar with glassmorphism */}
        <header className="h-16 sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/30 dark:border-slate-700/50 shadow-sm">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                {/* Replace mobile top bar logo */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoImage} 
                    alt="MedFusion AI Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">MedFusion AI</span>
              </div>
              
              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                <span className="text-gray-600 dark:text-gray-400 font-medium capitalize">{location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-white/80 dark:hover:bg-slate-800 transition-all">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl w-48">
                  <DropdownMenuLabel>Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {language === lang.code && <Check className="w-4 h-4 text-blue-600" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dark/Light Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-white/80 dark:hover:bg-slate-800 transition-all">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-pink-600 border-0 shadow-lg shadow-red-500/40">
                      2
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                  <DropdownMenuLabel className="font-semibold text-base">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/70 cursor-pointer border-b border-gray-100 dark:border-slate-700 transition-all rounded-md mx-1">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Model Updated</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Version v2.3.1 with improved accuracy</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/70 cursor-pointer transition-all rounded-md mx-1">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Analysis Complete</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Case P-001240 ready for review</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hidden lg:flex hover:bg-white/80 dark:hover:bg-slate-800 transition-all">
                    <Avatar className="w-8 h-8 ring-2 ring-blue-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">SJ</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Dr. Hadjer</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link to="/login">
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">Log out</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Profile Icon */}
              <Link to="/profile" className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-white/80 dark:hover:bg-slate-800">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-t border-white/30 dark:border-slate-700/50 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <button
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all ${
                    active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 scale-105 shadow-lg shadow-blue-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}