import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  CheckSquare, 
  Settings, 
  X,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Circle,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { Sidebar } from '../components/Sidebar';
import { AIAssistant } from '../components/AIAssistant';
import toast from 'react-hot-toast';
import { markTaskCompletedToday } from '../utils/streakUtils';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
  completed: boolean;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  
  const location = useLocation();
  const state = location.state as { filterDate?: string; filterStatus?: 'completed' | 'pending' } | null;
  
  // Local State
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('genz_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Persist Tasks
  useEffect(() => {
    try {
      localStorage.setItem('genz_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, [tasks]);
  
  // Listen for tasks updates from Settings (Import/Clear All)
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('genz_tasks');
        setTasks(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error('Failed to sync tasks:', error);
      }
    };
    window.addEventListener('tasks_updated', handleSync);
    return () => window.removeEventListener('tasks_updated', handleSync);
  }, []);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');

  // Category Tabs
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('genz_custom_categories');
    return saved ? JSON.parse(saved) : ['Personal', 'Work', 'Technical Work', 'Long Term Goal'];
  });
  
  const allCategoriesMap = new Map<string, string>();
  customCategories.forEach(c => allCategoriesMap.set(c.toLowerCase(), c));
  tasks.forEach(t => {
    if (t.category && !allCategoriesMap.has(t.category.toLowerCase())) {
      const niceCase = t.category.charAt(0).toUpperCase() + t.category.slice(1);
      allCategoriesMap.set(t.category.toLowerCase(), niceCase);
    }
  });
  const categories = ['All', ...Array.from(allCategoriesMap.values())];

  const submitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName && newCategoryName.trim()) {
      const trimmed = newCategoryName.trim();
      const existing = categories.find(c => c.toLowerCase() === trimmed.toLowerCase());
      if (!existing) {
        const updated = [...customCategories, trimmed];
        setCustomCategories(updated);
        localStorage.setItem('genz_custom_categories', JSON.stringify(updated));
        setActiveCategory(trimmed);
      } else {
        setActiveCategory(existing);
      }
    }
    setIsCategoryModalOpen(false);
    setNewCategoryName('');
  };

  const deleteCategory = (cat: string) => {
    const updated = customCategories.filter(c => c !== cat);
    setCustomCategories(updated);
    localStorage.setItem('genz_custom_categories', JSON.stringify(updated));
    if (activeCategory === cat) setActiveCategory('All');
    toast.success(`Category "${cat}" deleted`);
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'All Time' | 'Today' | 'Upcoming' | 'Past Due'>('All Time');
  const [specificDateFilter, setSpecificDateFilter] = useState<string | null>(state?.filterDate || null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>(state?.filterStatus || 'all');

  useEffect(() => {
    if (state?.filterDate || state?.filterStatus) {
      if (state.filterDate) setSpecificDateFilter(state.filterDate);
      if (state.filterStatus) setStatusFilter(state.filterStatus);
      // Clear the state from history so it doesn't persist on reload
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  // Notifications
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(() => {
    return localStorage.getItem('genz_notifications_read') !== 'true';
  });
  const notifications = [
    { id: 1, title: 'Welcome to GenZ To-Do!', time: 'Just now', read: false },
    { id: 2, title: 'Complete your pending tasks today.', time: '2 hours ago', read: false },
  ];

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('');
    setDueDate('');
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleOpenForm = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate);
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? {
        ...t, title, description, priority, category, dueDate
      } : t));
      toast.success('Task updated successfully!');
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        priority,
        category,
        dueDate,
        completed: false,
      };
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully! 🚀');
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (!t.completed) {
          toast.success('Task completed! 🎉');
          markTaskCompletedToday();
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
  
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks
    .filter(t => activeCategory === 'All' || t.category?.toLowerCase() === activeCategory.toLowerCase())
    .filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(t => {
      if (statusFilter === 'completed') return t.completed;
      if (statusFilter === 'pending') return !t.completed;
      return true;
    })
    .filter(t => {
      if (specificDateFilter) {
        return t.dueDate === specificDateFilter;
      }
      if (dateFilter === 'All Time') return true;
      if (!t.dueDate) return false;
      if (dateFilter === 'Today') return t.dueDate === todayStr;
      if (dateFilter === 'Upcoming') return t.dueDate > todayStr;
      if (dateFilter === 'Past Due') return t.dueDate < todayStr && !t.completed;
      return true;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };



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
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 glass-card rounded-none border-b border-[var(--card-border)] flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)] lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">Task Management</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..." 
                className="bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 w-48 lg:w-64 focus:w-72"
              />
            </div>
            
            {/* Notification Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  if (!isNotificationOpen) {
                    setHasUnread(false);
                    localStorage.setItem('genz_notifications_read', 'true');
                  }
                }}
                className="relative p-2 rounded-full hover:bg-[var(--card-bg)] text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Bell size={20} />
                {hasUnread && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </>
                )}
              </button>
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0b0c10] rounded-2xl shadow-2xl border border-[var(--card-border)] overflow-hidden z-[60] origin-top-right"
                  >
                    <div className="p-4 border-b border-[var(--card-border)]">
                      <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 border-b border-[var(--card-border)] hover:bg-[var(--card-bg)] cursor-pointer transition-colors">
                          <p className="text-sm font-medium text-[var(--foreground)]">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Your Tasks</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and organize your day.</p>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {(specificDateFilter || statusFilter !== 'all') && (
                  <button 
                    onClick={() => {
                      setSpecificDateFilter(null);
                      setStatusFilter('all');
                    }}
                    className="text-sm text-fuchsia-500 hover:text-fuchsia-600 font-medium px-2 whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                )}
                <select 
                  value={dateFilter}
                  onChange={(e: any) => {
                    setDateFilter(e.target.value);
                    setSpecificDateFilter(null); // Reset specific date if standard filter used
                  }}
                  className="bg-[var(--background)] border border-[var(--card-border)] text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-[var(--foreground)]"
                >
                  <option value="All Time">All Time</option>
                  <option value="Today">Today</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past Due">Past Due</option>
                </select>
                <button 
                  onClick={() => handleOpenForm()}
                  className="primary-button flex items-center justify-center flex-1 sm:flex-none space-x-2 whitespace-nowrap shadow-lg shadow-violet-500/20"
                >
                  <Plus size={18} />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Category Navigation Bar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => {
                const isCustom = customCategories.includes(cat);
                return (
                  <div key={cat} className="relative group/cat flex-shrink-0">
                    <div
                      onClick={() => setActiveCategory(cat)}
                      className={`cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                        activeCategory === cat 
                          ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                          : 'bg-[var(--card-bg)] text-gray-500 hover:bg-violet-500/10 hover:text-violet-500 border border-[var(--card-border)]'
                      }`}
                    >
                      <span>{cat}</span>
                      {isCustom && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); deleteCategory(cat); }}
                          className={`p-0.5 rounded-full transition-all ${
                            activeCategory === cat ? 'hover:bg-white/20' : 'hover:bg-red-500 hover:text-white'
                          }`}
                          title="Delete Category"
                        >
                          <X size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all bg-[var(--card-bg)] text-gray-500 hover:bg-violet-500/10 hover:text-violet-500 border border-dashed border-gray-400 dark:border-gray-600 hover:border-violet-500 flex items-center justify-center flex-shrink-0"
                title="Add Category"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Content Container */}
            <div className="glass-card p-6 min-h-[400px]">
              {isLoading ? (
                /* Loading State */
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center p-4 border border-[var(--card-border)] rounded-xl relative overflow-hidden bg-[var(--card-bg)]"
                    >
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/5" />
                      <div className="w-5 h-5 rounded-full bg-gray-200/50 dark:bg-gray-700/50 mr-4 animate-pulse"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded-md w-1/3 animate-pulse"></div>
                        <div className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-md w-1/2 animate-pulse"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                /* Empty State */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, type: 'spring', bounce: 0.5 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-32 h-32 mb-8"
                  >
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-violet-100 to-indigo-50 dark:from-violet-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner border border-white/50 dark:border-white/10">
                      <CheckSquare size={56} className="text-violet-500 dark:text-violet-400" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold gradient-text mb-3 tracking-tight">No tasks found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 text-lg">
                    {searchQuery ? 'Try adjusting your search criteria.' : 'You have a clean slate! Add a new task to get started.'}
                  </p>
                  {!searchQuery && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenForm()}
                      className="primary-button flex items-center shadow-lg shadow-violet-500/25"
                    >
                      <Plus size={20} className="mr-2" /> Create your first task
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                /* Task List */
                <motion.div layout className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={task.id}
                        className={`group p-4 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:items-center ${
                          task.completed 
                            ? 'bg-gray-50/50 dark:bg-gray-900/20 border-transparent opacity-75' 
                            : 'bg-[var(--background)] border-[var(--card-border)] hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex-1 flex items-start sm:items-center gap-4 min-w-0">
                          <button 
                            onClick={() => toggleComplete(task.id)}
                            className="mt-1 sm:mt-0 flex-shrink-0 text-gray-400 hover:text-violet-500 transition-colors"
                          >
                            {task.completed ? (
                              <CheckCircle className="text-green-500" size={22} />
                            ) : (
                              <Circle size={22} />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-lg truncate transition-all ${
                              task.completed ? 'line-through text-gray-500' : 'text-[var(--foreground)]'
                            }`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              {task.dueDate && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar size={12} className="mr-1" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              )}
                              {task.category && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Tag size={12} className="mr-1" />
                                  {task.category}
                                </div>
                              )}
                              <div className={`text-xs px-2 py-0.5 rounded-full border flex items-center font-medium capitalize ${getPriorityColor(task.priority)}`}>
                                <AlertCircle size={10} className="mr-1" />
                                {task.priority}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-100 transition-opacity justify-end sm:justify-start">
                          <button 
                            onClick={() => handleOpenForm(task)}
                            className="p-2 rounded-lg text-gray-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(task.id)}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* AI Assistant Section */}
            <div className="mt-6">
              <AIAssistant tasks={tasks} />
            </div>

          </div>
        </main>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={resetForm}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar bg-[var(--background)] rounded-2xl shadow-2xl border border-fuchsia-500/20 flex flex-col"
            >
              {/* Energetic Header */}
              <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 p-6 text-white flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
                  {editingTask ? '✨ Edit Task' : '🚀 Create New Task'}
                </h2>
                <button onClick={resetForm} className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Task Title *</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-[var(--card-border)] text-[var(--foreground)] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all font-medium"
                    placeholder="e.g., Complete the React project"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-[var(--card-border)] text-[var(--foreground)] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all min-h-[100px] resize-none"
                    placeholder="Add more details about this task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-[var(--card-border)] text-[var(--foreground)] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all cursor-pointer font-medium"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority 🔥</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                    <input 
                      type="date" 
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-[var(--card-border)] text-[var(--foreground)] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                  <input 
                    type="text" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-[var(--card-border)] text-[var(--foreground)] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
                    placeholder="e.g., Work, Personal, Shopping"
                  />
                </div>

                <div className="pt-6 mt-2 border-t border-[var(--card-border)] flex justify-end gap-3 shrink-0">
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task 🚀'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsCategoryModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[var(--background)] rounded-2xl shadow-2xl border border-[var(--card-border)] flex flex-col"
            >
              <div className="p-6 border-b border-[var(--card-border)] flex justify-between items-center">
                <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Tag size={18} className="text-violet-500" />
                  New Category
                </h2>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={submitCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category Name</label>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-[var(--card-border)] text-[var(--foreground)] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="e.g., Fitness, Groceries"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-600 transition-colors">
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
