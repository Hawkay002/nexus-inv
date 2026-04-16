import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Calling our custom Vercel Serverless Function
      const res = await fetch('/api/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error('Failed to send request');
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-premium-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl shadow-premium-900/5 border border-premium-100 animate-in slide-in-from-bottom-8 duration-500">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-premium-500 hover:text-premium-900 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to login
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-premium-900">Reset Password</h1>
          <p className="text-premium-700 mt-2">We'll send you a link to reset your credentials.</p>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-2xl border border-green-100">
             <CheckCircle2 size={48} className="text-green-500 mb-4" />
             <h3 className="font-semibold text-green-900 text-lg mb-2">Check your email</h3>
             <p className="text-green-700 text-sm">A custom reset link has been queued for {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                Failed to trigger reset. Please try again later.
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-premium-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-premium-400" size={20} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12" 
                  placeholder="admin@nexus.com" 
                />
              </div>
            </div>

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-4 text-lg mt-4">
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
