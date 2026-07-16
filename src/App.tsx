import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

// Placeholders for pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <PageWrapper><Analytics /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <PageWrapper><Settings /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <div className="relative min-h-screen isolate overflow-hidden">
            <div className="gradient-bg" />
            
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--card-bg)',
                  color: 'var(--foreground)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                },
              }}
            />

            <div className="relative z-10 flex flex-col min-h-screen">
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </div>
          </div>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
