import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />
        
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <CheckCircle2 className="text-white w-6 h-6" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-center text-foreground/60 mb-8 text-sm">
          Enter your details to access your dashboard.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              className={cn(
                "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none transition-all focus:border-violet-500/50 focus:bg-foreground/10",
                errors.email && "border-red-500/50 focus:border-red-500/50"
              )}
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label className="block text-sm font-medium">Password</label>
              <a href="#" className="text-xs text-violet-500 hover:text-violet-600 font-medium">Forgot password?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className={cn(
                  "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none transition-all focus:border-violet-500/50 focus:bg-foreground/10 pr-12",
                  errors.password && "border-red-500/50 focus:border-red-500/50"
                )}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message as string}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="primary-button w-full flex justify-center items-center mt-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/60">
          Don't have an account?{" "}
          <Link to="/register" className="text-violet-500 font-semibold hover:text-violet-600">
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
