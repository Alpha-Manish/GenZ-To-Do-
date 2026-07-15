import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  LayoutDashboard, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  X,
  Plus 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToTodos, addTodo, updateTodo, type Todo } from '../lib/firestore';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToTodos(currentUser.uid, (fetchedTodos) => {
      setTodos(fetchedTodos);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentUser) return;
    try {
      await addTodo({
        title: newTaskTitle.trim(),
        completed: false,
        priority: 'medium',
        userId: currentUser.uid,
      });
      setNewTaskTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    if (!todo.id) return;
    await updateTodo(todo.id, { completed: !todo.completed });
  };

  // Stats calculation
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Tasks', icon: CheckSquare, active: false },
    { name: 'Analytics', icon: BarChart2, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-card rounded-none border-r border-[var(--card-border)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--card-border)]">
            <span className="text-xl font-bold gradient-text tracking-wider">GenZ To-Do</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-violet-600 dark:text-violet-400 font-medium' 
                      : 'text-[var(--foreground)] hover:bg-[var(--card-bg)]'
                  }`}
                >
                  <Icon size={20} className={item.active ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'} />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* User Profile Summary (Sidebar Bottom) */}
          <div className="p-4 border-t border-[var(--card-border)]">
            <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[var(--card-bg)] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase">
                {currentUser?.email?.charAt(0) || 'U'}
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 glass-card rounded-none border-b border-[var(--card-border)] flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)] lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 w-64 focus:w-80"
              />
            </div>
            
            <button className="md:hidden p-2 rounded-full hover:bg-[var(--card-bg)] text-gray-600 dark:text-gray-300">
              <Search size={20} />
            </button>

            {/* Notification */}
            <button className="relative p-2 rounded-full hover:bg-[var(--card-bg)] text-gray-600 dark:text-gray-300 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--background)]"></span>
            </button>

            {/* Profile Dropdown Trigger */}
            <button className="p-1 rounded-full hover:bg-[var(--card-bg)] transition-colors uppercase">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {currentUser?.email?.charAt(0) || 'U'}
              </div>
            </button>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Greeting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Welcome back! 👋</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what's happening with your tasks today.</p>
              </div>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="primary-button flex items-center space-x-2 whitespace-nowrap"
              >
                <Plus size={18} />
                <span>New Task</span>
              </button>
            </div>

            {/* Mock Data Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Tasks', value: totalTasks, color: 'from-blue-500 to-cyan-500' },
                { label: 'Completed', value: completedTasks, color: 'from-green-500 to-emerald-500' },
                { label: 'In Progress', value: inProgressTasks, color: 'from-orange-500 to-yellow-500' },
              ].map((stat, idx) => (
                <div key={idx} className="glass-card p-6 flex flex-col justify-center relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 z-10">{stat.label}</p>
                  <p className="text-3xl font-bold text-[var(--foreground)] z-10">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Mock Chart & Recent Tasks Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart Area */}
              <div className="lg:col-span-2 glass-card p-6 min-h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Activity Overview</h3>
                  <select className="bg-[var(--background)] border border-[var(--card-border)] text-sm rounded-lg px-3 py-1 outline-none text-[var(--foreground)]">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="flex-1 border-2 border-dashed border-[var(--card-border)] rounded-xl flex flex-col items-center justify-center text-gray-400 bg-black/5 dark:bg-white/5">
                  <BarChart2 size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">Chart Visualization Placeholder</span>
                  <span className="text-xs opacity-75">Analytics data will appear here</span>
                </div>
              </div>

              {/* Recent Tasks List */}
              <div className="glass-card p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Your Tasks</h3>
                  <span className="text-sm text-violet-600 dark:text-violet-400">{todos.length} Tasks</span>
                </div>
                
                {isAdding && (
                  <form onSubmit={handleAddTask} className="mb-4">
                    <input 
                      type="text" 
                      autoFocus
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="What needs to be done?" 
                      className="w-full bg-[var(--background)] border border-violet-500/30 text-[var(--foreground)] px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </form>
                )}

                <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {todos.length === 0 && !isAdding ? (
                    <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Create one!</p>
                  ) : (
                    todos.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTodo(task)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--card-bg)] transition-colors cursor-pointer border border-transparent hover:border-[var(--card-border)]"
                      >
                        <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full border-2 transition-colors ${task.completed ? 'border-green-500 bg-green-500' : 'border-violet-500'}`}></div>
                        <div>
                          <p className={`text-sm font-medium transition-all ${task.completed ? 'text-gray-500 line-through opacity-70' : 'text-[var(--foreground)]'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {task.createdAt ? new Date(task.createdAt?.toDate?.() || task.createdAt).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
