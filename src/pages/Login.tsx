import { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', result.user.email || '');
        localStorage.setItem('userName', result.user.displayName || 'Parent');
        localStorage.setItem('userPhoto', result.user.photoURL || '');
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-api-key') {
         setError('Firebase API Key is missing. Add it in Vercel env vars (VITE_FIREBASE_API_KEY).');
      } else {
         setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated WebGL Shader Background Mockup */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-sky-500 rounded-full blur-[120px] mix-blend-screen" style={{ animationDelay: '2s' }} />
      </div>

      <div className="glass-card bg-white/10 border-white/20 p-8 w-full max-w-md z-10 text-center text-white backdrop-blur-2xl">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-headline font-bold mb-2">JEE Guardian</h1>
        <p className="text-slate-300 font-label text-sm mb-8">Parent Monitoring Dashboard</p>

        <div className="space-y-5 text-left">
          {error && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 text-sm p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="break-words w-full">{error}</span>
            </div>
          )}
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {loading ? 'Authenticating...' : 'Sign in with Google'}
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-400 font-label">
          End-to-end encrypted connection. Secure parent access.
        </div>
      </div>
    </div>
  );
}
