import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Brain,
  History,
  Settings as SettingsIcon,
  Bell,
  User,
  ChevronRight,
  Menu,
  X,
  Search,
  ChevronLeft,
  Home,
  Network,
  Moon,
  Sun,
  Globe,
  Check,
  LogOut,
  TrendingUp,
  Package,
  Sparkles
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

export function AITeamLayout() {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, language, toggleTheme, setLanguage } = useTheme();

  const navItems = [
    { path: '/ai', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ai/training', label: 'Training', icon: Brain },
    { path: '/ai/history', label: 'FL Models', icon: History },
    { path: '/ai/contribution-insights', label: 'Contribution', icon: TrendingUp },
    { path: '/ai/model-versions', label: 'Versions', icon: Package },
    { path: '/ai/ai-insights', label: 'AI Insights', icon: Sparkles },
    { path: '/ai/notifications', label: 'Notifications', icon: Bell },
    { path: '/ai/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const isActive = (path: string) => {
    if (path === '/ai') return location.pathname === '/ai';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex relative transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-300/10 dark:bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
        <div className="h-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-white/30 dark:border-slate-700/50 shadow-2xl shadow-black/5">
          {/* Logo & Collapse Toggle */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/50 dark:border-slate-700/50">
            <div className={`flex items-center gap-3 transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white tracking-tight text-lg">FedMedAI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Team Portal</p>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
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
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/40'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:translate-x-1'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}
                    <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`} />
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

          {/* Switch to Doctor Platform */}
          {!isCollapsed && (
            <div className="px-3 pb-3">
              <Link to="/">
                <Button variant="outline" className="w-full border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Switch to Doctor Platform
                </Button>
              </Link>
            </div>
          )}

          {/* User Info */}
          <div className="p-4 border-t border-gray-200/50 dark:border-slate-700/50">
            <div className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-slate-800/50 transition-all cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}>
              <Avatar className="ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold">AT</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">AI Team Member</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">ML Engineer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 relative z-10 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Bar */}
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
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Network className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">FedMedAI</span>
              </div>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                <span className="text-gray-600 dark:text-gray-400 font-medium capitalize">
                  {location.pathname === '/ai' ? 'Dashboard' : location.pathname.split('/').pop()?.replace('-', ' ')}
                </span>
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
                      {language === lang.code && <Check className="w-4 h-4 text-purple-600" />}
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
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-purple-500 to-indigo-600 border-0 shadow-lg shadow-purple-500/40">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                  <DropdownMenuLabel className="font-semibold text-base">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-3 hover:bg-purple-50/70 dark:hover:bg-slate-800/70 cursor-pointer border-b border-gray-100 dark:border-slate-700 transition-all rounded-md mx-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">New global model assigned</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">CXR-RN18-v2.2 ready for download</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">1 hour ago</p>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile */}
              <Avatar className="w-8 h-8 ring-2 ring-purple-500/30 cursor-pointer hover:ring-purple-500/50 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-sm font-semibold">AT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
