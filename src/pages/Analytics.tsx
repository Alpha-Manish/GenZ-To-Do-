import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  CheckSquare, 
  Settings, 
  X,
  BarChart2,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(() => localStorage.getItem('genz_user_avatar') || '');

  useEffect(() => {
    const handleAvatarSync = () => setAvatar(localStorage.getItem('genz_user_avatar') || '');
    window.addEventListener('avatar_updated', handleAvatarSync);
    return () => window.removeEventListener('avatar_updated', handleAvatarSync);
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { name: 'Tasks', icon: CheckSquare, active: false, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart2, active: true, path: '/analytics' },
    { name: 'Settings', icon: Settings, active: false, path: '/settings' },
  ];

  // Load Tasks
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('genz_tasks');
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const productivityScore = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const metrics = {
    totalTasks,
    completedTasks,
    pendingTasks,
    productivityScore
  };

  // Compute Weekly Data
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekMap = new Map();
  weekDays.forEach(day => weekMap.set(day, { name: day, completed: 0, pending: 0 }));

  tasks.forEach(task => {
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      if (!isNaN(date.getTime())) {
        const day = weekDays[date.getDay()];
        const entry = weekMap.get(day);
        if (task.completed) {
          entry.completed += 1;
        } else {
          entry.pending += 1;
        }
      }
    }
  });
  
  const weeklyData = [
    weekMap.get('Mon'), weekMap.get('Tue'), weekMap.get('Wed'), 
    weekMap.get('Thu'), weekMap.get('Fri'), weekMap.get('Sat'), weekMap.get('Sun')
  ];

  // Compute Category Data
  const catMap = new Map();
  tasks.forEach(task => {
    const cat = task.category || 'Uncategorized';
    catMap.set(cat, (catMap.get(cat) || 0) + 1);
  });
  const categoryData = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));
  if (categoryData.length === 0) categoryData.push({ name: 'No Data', value: 1 });

  const COLORS = ['#8b5cf6', '#d946ef', '#f97316', '#06b6d4', '#10b981'];

  return (
    <div className="min-h-screen bg-[var(--background)] flex overflow-hidden">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 glass-card rounded-none border-b border-[var(--card-border)] flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)] lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">Analytics Hub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 w-48 lg:w-64 focus:w-72"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-[var(--card-bg)] text-gray-600 dark:text-gray-300 transition-colors">
              <Bell size={20} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                  <TrendingUp className="text-fuchsia-500" />
                  Your Performance
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track your productivity and task completion trends.</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Tasks</p>
                    <p className="text-3xl font-bold text-[var(--foreground)]">{metrics.totalTasks}</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><CheckSquare size={24} /></div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-[var(--foreground)]">{metrics.completedTasks}</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-xl text-green-500"><Award size={24} /></div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-[var(--foreground)]">{metrics.pendingTasks}</p>
                  </div>
                  <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500"><Target size={24} /></div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-pink-500 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Productivity Score</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">{metrics.productivityScore}%</p>
                  </div>
                  <div className="p-2 bg-fuchsia-500/10 rounded-xl text-fuchsia-500"><TrendingUp size={24} /></div>
                </div>
              </motion.div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              
              {/* Weekly Progress Chart */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <BarChart2 className="text-violet-500" size={20} /> Weekly Progress
                </h3>
                <div className="h-72 w-full relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-end justify-between px-4 pb-8 space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-t-md animate-pulse relative overflow-hidden" style={{ height: `${Math.random() * 60 + 20}%` }}>
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" vertical={false} />
                        <XAxis dataKey="name" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                          cursor={{fill: 'rgba(139, 92, 246, 0.1)'}}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                        <Bar dataKey="completed" name="Completed Tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="pending" name="Pending Tasks" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

              {/* Category Distribution Chart */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="glass-card p-6 group hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-300">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <PieChart className="text-fuchsia-500" size={20} /> Category Distribution
                </h3>
                <div className="h-72 w-full flex justify-center items-center relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border-[16px] border-gray-200/50 dark:border-gray-700/50 animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
                      </div>
                      <div className="absolute right-4 space-y-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-24 h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded animate-pulse" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                      />
                      <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                      <Pie
                        data={categoryData}
                        cx="40%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
