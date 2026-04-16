import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, ScanLine, UserCog, LogOut, Menu, X } from 'lucide-react';
import GenerateTab from './dashboard/GenerateTab';
import ArchiveTab from './dashboard/ArchiveTab';
import ScannerTab from './dashboard/ScannerTab';
import { auth } from '../config/firebase';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('generate');
  const [config, setConfig] = useState(null);
  const [bills, setBills] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const savedConfig = localStorage.getItem('nexus_config');
    const savedBills = localStorage.getItem('nexus_bills');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedBills) setBills(JSON.parse(savedBills));
  }, []);

  const saveBills = (newBills) => {
    setBills(newBills);
    localStorage.setItem('nexus_bills', JSON.stringify(newBills));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close menu on mobile after selection
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-premium-50 px-4 text-center">
        <h2 className="text-2xl font-display font-bold">Configuration Required</h2>
        <p className="text-premium-700">Please set up your profile and tenant details first.</p>
        <Link to="/profile" className="btn-primary w-full max-w-xs">Go to Configuration</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-premium-50">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-premium-100 z-20">
        <h1 className="text-xl font-display font-bold text-premium-900 tracking-tight">Nexus.</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-premium-900">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-10 transform ${mobileMenuOpen ? "translate-x-0 mt-[65px]" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 w-full md:w-64 bg-white border-r border-premium-100 flex flex-col h-full md:h-screen`}>
        <div className="hidden md:block p-6 border-b border-premium-100">
          <h1 className="text-2xl font-display font-bold text-premium-900 tracking-tight">Nexus.</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => handleTabChange('generate')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'generate' ? 'bg-premium-900 text-white' : 'text-premium-700 hover:bg-premium-50'}`}>
            <LayoutDashboard size={20} /> Generate
          </button>
          <button onClick={() => handleTabChange('archive')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'archive' ? 'bg-premium-900 text-white' : 'text-premium-700 hover:bg-premium-50'}`}>
            <Receipt size={20} /> Archive
          </button>
          <button onClick={() => handleTabChange('scanner')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'scanner' ? 'bg-premium-900 text-white' : 'text-premium-700 hover:bg-premium-50'}`}>
            <ScanLine size={20} /> Scanner
          </button>
        </nav>
        <div className="p-4 border-t border-premium-100 space-y-2 bg-white pb-24 md:pb-4">
          <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-premium-700 hover:bg-premium-50 rounded-lg font-medium transition-colors">
            <UserCog size={20} /> Configuration
          </Link>
          <button onClick={() => auth.signOut()} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'generate' && <GenerateTab config={config} bills={bills} saveBills={saveBills} />}
        {activeTab === 'archive' && <ArchiveTab config={config} bills={bills} saveBills={saveBills} />}
        {activeTab === 'scanner' && <ScannerTab bills={bills} saveBills={saveBills} />}
      </main>
    </div>
  );
}
