import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      await signup(data.email, data.password);
      // Optional: Update profile with name if needed
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
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
        
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <CheckCircle2 className="text-white w-6 h-6" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-center text-foreground/60 mb-8 text-sm">
          Join GenZ To-Do and organize your life today.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Alex Doe"
              className={cn(
                "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none transition-all focus:border-violet-500/50 focus:bg-black/10 dark:focus:bg-white/10 placeholder-black/40 dark:placeholder-white/40",
                errors.name && "border-red-500/50 focus:border-red-500/50"
              )}
              {...register("name", { 
                required: "Name is required"
              })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              className={cn(
                "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none transition-all focus:border-violet-500/50 focus:bg-black/10 dark:focus:bg-white/10 placeholder-black/40 dark:placeholder-white/40",
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
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className={cn(
                  "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 outline-none transition-all focus:border-violet-500/50 focus:bg-black/10 dark:focus:bg-white/10 pr-12 placeholder-black/40 dark:placeholder-white/40",
                  errors.password && "border-red-500/50 focus:border-red-500/50"
                )}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                  className="p-1 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message as string}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="primary-button w-full flex justify-center items-center mt-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-foreground/40 font-medium uppercase">Or continue with</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          type="button"
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1a1a1a] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <div className="mt-8 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-500 font-semibold hover:text-violet-600">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
