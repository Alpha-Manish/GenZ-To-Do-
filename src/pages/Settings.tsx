import React, { useState, useRef } from 'react';
import { 
  Menu, X, Settings as SettingsIcon, User, Palette, 
  Clock, Bell as BellIcon, Database, Shield, Info,
  CheckSquare, BarChart2, Sun, Moon, Monitor, Upload, Download, Trash2, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { productivity, setProductivity, notifications, setNotifications } = useSettings();

  const [avatar, setAvatar] = useState(() => localStorage.getItem('genz_user_avatar') || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'productivity', label: 'Productivity', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleExport = () => {
    try {
      const data = localStorage.getItem('genz_tasks') || '[]';
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `genz_tasks_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Tasks exported successfully!');
    } catch (e) {
      toast.error('Failed to export tasks.');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          localStorage.setItem('genz_tasks', JSON.stringify(parsed));
          window.dispatchEvent(new Event('tasks_updated'));
          toast.success('Tasks imported successfully!');
        } else {
          toast.error('Invalid backup file format.');
        }
      } catch (err) {
        toast.error('Failed to read backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
      localStorage.setItem('genz_tasks', '[]');
      window.dispatchEvent(new Event('tasks_updated'));
      toast.success('All tasks cleared.');
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('genz_settings_productivity');
      localStorage.removeItem('genz_settings_notifications');
      localStorage.removeItem('genz_user_avatar');
      localStorage.removeItem('theme');
      window.location.reload();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('genz_user_avatar', base64String);
        window.dispatchEvent(new Event('avatar_updated'));
        toast.success('Avatar updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Profile Settings</h3>
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-violet-500/20 overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.email?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div>
                <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" ref={avatarInputRef} onChange={handleAvatarChange} />
                <button className="primary-button text-sm py-2 px-4" onClick={() => avatarInputRef.current?.click()}>Change Avatar</button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" defaultValue="GenZ User" className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" disabled defaultValue={currentUser?.email || ''} className="w-full bg-gray-100 dark:bg-gray-800 border border-[var(--card-border)] rounded-xl px-4 py-3 opacity-70 cursor-not-allowed" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
              <textarea rows={3} placeholder="Tell us a little about yourself..." className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"></textarea>
            </div>
            
            <div className="pt-4">
              <button className="primary-button" onClick={() => toast.success('Profile updated successfully!')}>Save Changes</button>
            </div>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Appearance</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Customize the look and feel of your workspace.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => setTheme('light')}
                className={`p-1 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-violet-500' : 'border-transparent hover:border-[var(--card-border)]'}`}
              >
                <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center gap-3 h-32 justify-center">
                  <Sun size={32} className="text-yellow-500" />
                  <span className="font-medium text-gray-900">Light</span>
                </div>
              </button>
              
              <button 
                onClick={() => setTheme('dark')}
                className={`p-1 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-violet-500' : 'border-transparent hover:border-[var(--card-border)]'}`}
              >
                <div className="bg-gray-900 rounded-xl p-4 flex flex-col items-center gap-3 h-32 justify-center">
                  <Moon size={32} className="text-violet-400" />
                  <span className="font-medium text-white">Dark</span>
                </div>
              </button>

              <button 
                onClick={() => setTheme('system')}
                className={`p-1 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-violet-500' : 'border-transparent hover:border-[var(--card-border)]'}`}
              >
                <div className="bg-gradient-to-r from-gray-100 to-gray-900 rounded-xl p-4 flex flex-col items-center gap-3 h-32 justify-center">
                  <Monitor size={32} className="text-gray-500 mix-blend-difference" />
                  <span className="font-medium text-gray-500 mix-blend-difference">System</span>
                </div>
              </button>
            </div>
          </motion.div>
        );

      case 'productivity':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Productivity Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-[var(--foreground)]">Task Defaults</h4>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Default Priority</label>
                  <select 
                    value={productivity.defaultPriority}
                    onChange={(e) => setProductivity({...productivity, defaultPriority: e.target.value as 'low'|'medium'|'high'})}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Start of Week</label>
                  <select 
                    value={productivity.startDayOfWeek}
                    onChange={(e) => setProductivity({...productivity, startDayOfWeek: e.target.value as 'monday'|'sunday'})}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3"
                  >
                    <option value="monday">Monday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-[var(--foreground)]">Timer Settings</h4>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Pomodoro Duration (minutes)</label>
                  <input 
                    type="number" 
                    value={productivity.pomodoroDuration}
                    onChange={(e) => setProductivity({...productivity, pomodoroDuration: parseInt(e.target.value) || 25})}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Break Duration (minutes)</label>
                  <input 
                    type="number" 
                    value={productivity.breakDuration}
                    onChange={(e) => setProductivity({...productivity, breakDuration: parseInt(e.target.value) || 5})}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3" 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button className="primary-button" onClick={() => toast.success('Preferences saved!')}>Save Settings</button>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Notification Settings</h3>
            
            <div className="space-y-4">
              {Object.entries({
                taskReminders: 'Task Reminders',
                dueDateNotifications: 'Due Date Notifications',
                habitReminders: 'Habit Reminders',
                achievements: 'Achievement Unlock Alerts',
                emailNotifications: 'Email Digest (Weekly)'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-4 glass-card">
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">{label}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications for {label.toLowerCase()}.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = { ...notifications, [key]: !notifications[key as keyof typeof notifications] };
                      setNotifications(updated);
                      toast(updated[key as keyof typeof notifications] ? `${label} Enabled` : `${label} Disabled`);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${notifications[key as keyof typeof notifications] ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <motion.div 
                      layout
                      initial={false}
                      animate={{ x: notifications[key as keyof typeof notifications] ? 24 : 2 }}
                      className="w-5 h-5 bg-white rounded-full mt-0.5 shadow-sm"
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'data':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Data Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Download size={32} />
                </div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Export Backup</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">Download a JSON copy of all your tasks and data.</p>
                <button onClick={handleExport} className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors">Export JSON</button>
              </div>

              <div className="glass-card p-6 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Import Backup</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">Restore your tasks from a previously exported JSON file.</p>
                <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-green-500 text-white font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">Import JSON</button>
              </div>
            </div>

            <div className="glass-card p-6 border-red-200 dark:border-red-900/50">
              <h4 className="font-semibold text-lg text-red-500 flex items-center gap-2 mb-2"><Trash2 size={20} /> Danger Zone</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Permanently delete your data or reset settings. This action cannot be reversed.</p>
              <div className="flex gap-4">
                <button onClick={handleClearData} className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium">Clear All Tasks</button>
                <button onClick={handleFactoryReset} className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg transition-colors font-medium flex items-center gap-2"><RotateCcw size={16} /> Factory Reset</button>
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Security Settings</h3>
            
            <div className="glass-card p-6 space-y-4">
              <h4 className="font-semibold text-[var(--foreground)]">Change Password</h4>
              <div className="space-y-4">
                <input type="password" placeholder="Current Password" className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3" />
                <input type="password" placeholder="New Password" className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3" />
                <button className="primary-button" onClick={() => toast.success('Password updated (Mock)')}>Update Password</button>
              </div>
            </div>

            <div className="glass-card p-6 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account.</p>
              </div>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-medium">Enable 2FA</button>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-semibold text-[var(--foreground)] mb-4">Recent Activity</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--foreground)]">Login from Windows PC (Chrome)</span>
                  <span className="text-gray-500">Just now</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-[var(--card-border)] pt-4">
                  <span className="text-[var(--foreground)]">Password Changed</span>
                  <span className="text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'about':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex flex-col items-center text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl shadow-xl shadow-violet-500/30 flex items-center justify-center mb-6 transform rotate-12 hover:rotate-0 transition-all duration-500">
              <CheckSquare size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold gradient-text">GenZ To-Do List</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">The ultimate, portfolio-ready task management SaaS built for the modern era.</p>
            
            <div className="flex gap-8 my-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">v1.2.0</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Version</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">14+</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Features</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">100%</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">SaaS Quality</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-400">Designed and built with ❤️ by the GenZ Dev Team.</p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const navItems = [
    { name: 'Tasks', icon: CheckSquare, active: false, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart2, active: false, path: '/analytics' },
    { name: 'Settings', icon: SettingsIcon, active: true, path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden w-full">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-card rounded-none border-r border-[var(--card-border)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--card-border)]">
            <span className="text-xl font-bold gradient-text tracking-wider">GenZ To-Do</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)]"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-violet-600 dark:text-violet-400 font-medium' 
                      : 'text-[var(--foreground)] hover:bg-[var(--card-bg)]'
                  }`}
                >
                  <Icon size={20} className={item.active ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[var(--card-border)]">
            <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[var(--card-bg)] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.email?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{currentUser?.email}</p>
                <button onClick={logout} className="text-xs text-red-500 hover:text-red-600">Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[var(--card-border)] glass-card rounded-none z-10 sticky top-0">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 mr-2 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)]"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[var(--foreground)] hidden sm:block">Settings</h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
            
            {/* Settings SidebarNav */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="glass-card p-2 sticky top-8">
                <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal ${
                          isActive 
                            ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-[var(--card-bg)]'
                        }`}
                      >
                        <Icon size={18} className={isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400'} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Settings Content Area */}
            <div className="flex-1 glass-card p-6 sm:p-8 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
