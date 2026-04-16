import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, FileText, ScanLine, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const { currentUser } = useAuth();

  // Redirect to dashboard if already logged in
  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-premium-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-block px-4 py-2 bg-premium-100 text-premium-800 rounded-full font-semibold text-sm tracking-wide mb-4">
          Nexus Invoicing v2.0
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-premium-900 tracking-tight leading-tight">
          Premium property <br/> billing, simplified.
        </h1>
        <p className="text-lg md:text-xl text-premium-700 max-w-2xl mx-auto leading-relaxed">
          Generate strict, high-fidelity rent and utility invoices. Built with advanced barcode scanning, instant WhatsApp sharing, and secure cloud archiving.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link to="/login" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
            Access Dashboard <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left">
          <div className="bg-white p-6 rounded-2xl border border-premium-100 shadow-sm">
            <FileText className="text-accent-600 mb-4" size={32} />
            <h3 className="font-display font-semibold text-xl mb-2">Smart Generation</h3>
            <p className="text-premium-700 text-sm">Automated calculations for electricity, AC, and flat utilities with premium landscape layouts.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-premium-100 shadow-sm">
            <ScanLine className="text-accent-600 mb-4" size={32} />
            <h3 className="font-display font-semibold text-xl mb-2">Barcode Scanner</h3>
            <p className="text-premium-700 text-sm">Instantly mark physical bills as paid using your device's camera or by uploading an image.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-premium-100 shadow-sm">
            <ShieldCheck className="text-accent-600 mb-4" size={32} />
            <h3 className="font-display font-semibold text-xl mb-2">Secure Syncing</h3>
            <p className="text-premium-700 text-sm">Configurable tenant wiping and Telegram API integration for secure cloud backups.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
