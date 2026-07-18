import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { HabitFrequency } from '../types/habit';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: { name: string; category: string; frequency: HabitFrequency; target: number; color: string }) => void;
}

const CATEGORIES: string[] = ['Exercise', 'Reading'];
const FREQUENCIES: HabitFrequency[] = ['daily', 'weekly', 'monthly'];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export function HabitForm({ isOpen, onClose, onAdd }: HabitFormProps) {
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Exercise');
  const [customCategory, setCustomCategory] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [target, setTarget] = useState(1);
  const [color, setColor] = useState(COLORS[4]); // Blue default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const finalCategory = customCategory.trim() ? customCategory.trim() : (selectedCategory || 'Custom');
    onAdd({ name: name.trim(), category: finalCategory, frequency, target, color });
    setName('');
    setSelectedCategory('Exercise');
    setCustomCategory('');
    setFrequency('daily');
    setTarget(1);
    setColor(COLORS[4]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold gradient-text">Create New Habit</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--foreground)] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Habit Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Morning Jog"
                    className="w-full bg-white/50 dark:bg-black/50 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 transition-colors text-[var(--foreground)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Category</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCustomCategory('');
                        }}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                          selectedCategory === cat && !customCategory
                            ? 'bg-violet-500/20 border-violet-500 text-violet-700 dark:text-violet-300' 
                            : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--foreground)] hover:bg-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      setSelectedCategory('');
                    }}
                    placeholder="Or enter custom category..."
                    className="w-full bg-white/50 dark:bg-black/50 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 transition-colors text-[var(--foreground)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                      className="w-full bg-white/50 dark:bg-black/50 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 text-[var(--foreground)]"
                    >
                      {FREQUENCIES.map((freq) => (
                        <option key={freq} value={freq} className="bg-white dark:bg-gray-800">
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Target Times</label>
                    <input
                      type="number"
                      min="1"
                      value={target}
                      onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                      className="w-full bg-white/50 dark:bg-black/50 border border-[var(--card-border)] rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 text-[var(--foreground)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Color Theme</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-violet-500 dark:ring-offset-gray-900' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full primary-button mt-4">
                  Create Habit
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
