import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function CustomModal({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => document.body.style.overflow = 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-premium-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} flex flex-col max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-premium-100">
          <h2 className="text-xl font-display font-semibold text-premium-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-premium-700 hover:bg-premium-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
