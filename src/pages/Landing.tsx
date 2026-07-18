import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ListTodo, 
  Timer, 
  BarChart3, 
  Sparkles, 
  Flame, 
  ArrowRight,
  Menu,
  X,
  PlayCircle,
  Star
} from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16.11 7.66v.01" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 px-6 py-4 flex items-center justify-between !rounded-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <CheckCircle2 className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">GenZ To-Do</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-violet-500 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-violet-500 transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-violet-500 transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-violet-500 transition-colors">
            Login
          </Link>
          <Link to="/register" className="primary-button !px-5 !py-2 !rounded-full text-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-4 right-4 z-40 glass-card p-6 flex flex-col gap-4 md:hidden"
        >
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="block py-2">Features</a>
          <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="block py-2">Testimonials</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block py-2">Pricing</a>
          <hr className="border-white/10" />
          <Link to="/login" className="block py-2">Login</Link>
          <Link to="/register" className="primary-button text-center mt-2">Get Started</Link>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <motion.div 
          className="flex-1 text-center lg:text-left z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm font-medium text-violet-500 shadow-sm border-violet-500/20">
            <Sparkles className="w-4 h-4" />
            <span>The #1 Productivity App for Gen-Z</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Organize Your Life.<br />
            <span className="gradient-text">Achieve More.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
            Take control of your day with smart task management, habit tracking, and personalized productivity insights designed for the modern workflow.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link to="/register" className="primary-button flex items-center gap-2 w-full sm:w-auto justify-center">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="glass-button flex items-center gap-2 w-full sm:w-auto justify-center">
              <PlayCircle className="w-5 h-5 text-violet-500" /> View Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Cards Graphic */}
        <motion.div 
          className="flex-1 relative w-full h-[500px] hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[100px] -z-10" />
          
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-20 right-10 glass-card p-6 w-64 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">7 Day Streak!</p>
                <p className="text-xs text-foreground/60">Keep it up 🔥</p>
              </div>
            </div>
            <div className="w-full bg-foreground/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-violet-500 to-indigo-500 w-3/4 h-2 rounded-full" />
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-10 glass-card p-6 w-72 shadow-2xl"
          >
            <h3 className="font-semibold mb-4 text-sm">Today's Focus</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${i === 1 ? 'bg-violet-500 border-violet-500 text-white' : 'border-foreground/20'}`}>
                    {i === 1 && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <div className={`h-2 rounded-full ${i === 1 ? 'bg-foreground/20 w-3/4' : 'bg-foreground/10 w-full'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-y border-foreground/5 bg-foreground/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Tasks Managed', value: '10K+' },
            { label: 'Active Users', value: '2K+' },
            { label: 'Productivity Boost', value: '95%' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-foreground/70 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to <span className="gradient-text">succeed</span></h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">Stop juggling between multiple apps. GenZ To-Do brings all your productivity tools into one beautiful, focused space.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: ListTodo, title: 'Smart Task Management', desc: 'Organize tasks with custom tags, priorities, and smart folders.', path: '/dashboard' },
            { icon: Flame, title: 'Habit Tracking', desc: 'Build lasting routines with daily tracking and visual progress charts.', path: '/habits' },
            { icon: Timer, title: 'Pomodoro Focus Timer', desc: 'Stay in the zone with built-in customizable focus sessions.', path: '/focus' },
            { icon: BarChart3, title: 'Productivity Analytics', desc: 'Understand your work patterns with beautiful, detailed insights.', path: '/analytics' },
            { icon: Sparkles, title: 'AI Task Suggestions', desc: 'Let our AI break down large projects into manageable steps.', path: '/dashboard' },
            { icon: CheckCircle2, title: 'Streak Tracking', desc: 'Stay motivated by maintaining daily activity streaks.', path: '/streak' },
          ].map((feature, i) => (
            <Link to={feature.path} key={i}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8 group cursor-pointer border-transparent hover:border-violet-500/20 transition-all h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-violet-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Loved by <span className="gradient-text">doers</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah J.', role: 'Student', content: 'This app completely changed how I handle my university assignments. The Pomodoro timer is a lifesaver!' },
              { name: 'Mike T.', role: 'Freelancer', content: 'Finally, a productivity app that looks good and actually works. The analytics help me bill hours accurately.' },
              { name: 'Emma R.', role: 'Designer', content: 'The UI is just gorgeous. It makes me want to use it every day, which is exactly what I needed for my habits.' },
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-violet-500 text-violet-500" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-6 italic">"{testimonial.content}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent <span className="gradient-text">pricing</span></h2>
          <p className="text-foreground/70">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="mb-6"><span className="text-4xl font-bold">$0</span><span className="text-foreground/60">/mo</span></div>
            <p className="text-sm text-foreground/70 mb-8 h-10">Perfect for getting started and organizing your personal tasks.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 50 tasks/day', 'Basic habit tracking', 'Standard Pomodoro timer', '7-day history'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" /> {feature}
                </li>
              ))}
            </ul>
            <Link to="/register" className="glass-button w-full block text-center">Get Started Free</Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 relative overflow-hidden border-violet-500/30 flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
            <div className="absolute inset-0 bg-violet-500/5 -z-10" />
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="mb-6"><span className="text-4xl font-bold">$4.99</span><span className="text-foreground/60">/mo</span></div>
            <p className="text-sm text-foreground/70 mb-8 h-10">For power users who want AI insights and unlimited tracking.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited tasks', 'Advanced analytics', 'AI Task Suggestions', 'Unlimited history', 'Priority support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-violet-500" /> {feature}
                </li>
              ))}
            </ul>
            <Link to="/register" className="primary-button w-full block text-center">Upgrade to Pro</Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">GenZ To-Do</span>
            </div>
            <p className="text-foreground/60 text-sm max-w-xs">
              Making productivity aesthetically pleasing and powerfully simple.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#features" className="hover:text-violet-500">Features</a></li>
              <li><a href="#pricing" className="hover:text-violet-500">Pricing</a></li>
              <li><a href="#" className="hover:text-violet-500">Download App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-violet-500">About Us</a></li>
              <li><a href="#" className="hover:text-violet-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-500">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-foreground/5">
          <p className="text-xs text-foreground/40">© 2026 GenZ To-Do. All rights reserved.</p>
          <div className="flex items-center gap-4 text-foreground/40">
            <a href="#" className="hover:text-foreground transition-colors"><TwitterIcon className="w-4 h-4" /></a>
            <a href="#" className="hover:text-foreground transition-colors"><InstagramIcon className="w-4 h-4" /></a>
            <a href="#" className="hover:text-foreground transition-colors"><GithubIcon className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
