import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock AI Logic
function generateSuggestions(tasks: any[]) {
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const highPriority = pendingTasks.filter(t => t.priority === 'high');
  
  const suggestions = [];

  if (tasks.length === 0) {
    suggestions.push({
      id: 'empty',
      icon: Sparkles,
      text: "You have a clean slate! Add some tasks to get AI-powered insights.",
      color: "text-violet-500"
    });
    return suggestions;
  }

  // 1. High Priority Insight
  if (highPriority.length > 0) {
    suggestions.push({
      id: 'high-priority',
      icon: AlertCircle,
      text: `Focus on your ${highPriority.length} high-priority tasks first, starting with "${highPriority[0].title}".`,
      color: "text-red-500"
    });
  } else if (pendingTasks.length > 0) {
    suggestions.push({
      id: 'next-up',
      icon: Zap,
      text: `You have ${pendingTasks.length} pending tasks. Let's knock out "${pendingTasks[0].title}"!`,
      color: "text-amber-500"
    });
  }

  // 2. Completion Pattern Insight
  const catMap = new Map();
  completedTasks.forEach(t => catMap.set(t.category, (catMap.get(t.category) || 0) + 1));
  let topCat = '';
  let topCount = 0;
  catMap.forEach((count, cat) => {
    if (count > topCount) {
      topCount = count;
      topCat = cat;
    }
  });

  if (topCount > 0) {
    suggestions.push({
      id: 'pattern',
      icon: TrendingUp,
      text: `You're very productive with "${topCat}" tasks! You've completed ${topCount} of them.`,
      color: "text-green-500"
    });
  }

  // 3. Due Date Insight
  const today = new Date().toISOString().split('T')[0];
  const dueToday = pendingTasks.filter(t => t.dueDate === today);
  if (dueToday.length > 0) {
    suggestions.push({
      id: 'due-today',
      icon: CheckCircle2,
      text: `You have ${dueToday.length} task(s) due today. Don't let them slip!`,
      color: "text-blue-500"
    });
  }

  // Pad with generic if needed
  if (suggestions.length < 3 && pendingTasks.length > 0) {
    const generic = [
      "Try using the Pomodoro technique in Settings to boost focus.",
      "Break down large tasks into smaller, manageable steps.",
      "Take a 5-minute break if you've been working for over an hour.",
      "A clear workspace leads to a clear mind. Stay organized!",
      "Review your upcoming tasks to plan your week effectively."
    ];
    // Pick unique random generics
    const shuffled = generic.sort(() => 0.5 - Math.random());
    for (let i = 0; i < generic.length && suggestions.length < 3; i++) {
      suggestions.push({
        id: `generic-${Date.now()}-${i}`,
        icon: Sparkles,
        text: shuffled[i],
        color: "text-violet-500"
      });
    }
  }

  return suggestions.slice(0, 3);
}

export function AIAssistant({ tasks }: { tasks: any[] }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setSuggestions(generateSuggestions(tasks));
  }, [tasks]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network delay for AI processing
    setTimeout(() => {
      setSuggestions(generateSuggestions(tasks));
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="glass-card p-6 mb-6 relative overflow-hidden group border border-violet-500/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -z-10 group-hover:bg-violet-500/20 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold gradient-text flex items-center gap-2">
          <Sparkles className="text-violet-500" size={20} />
          AI Assistant
        </h3>
        <button 
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-[var(--card-bg)] text-gray-500 transition-all ${isRefreshing ? 'animate-spin text-violet-500' : ''}`}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:border-violet-500/30 transition-colors"
              >
                <div className={`mt-0.5 ${s.color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {s.text}
                </p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
