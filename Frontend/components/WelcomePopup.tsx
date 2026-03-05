
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface WelcomePopupProps {
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <div className="w-12 h-12 bg-[#ff5c62] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
               <span className="font-bold text-xl">PKT</span>
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Xin chào!</h3>
          <div className="space-y-1 mb-10">
            <p className="text-xl font-bold text-[#ff5c62]">2274802010776</p>
            <p className="text-xl font-bold text-slate-800">Phạm Khánh Tài</p>
          </div>

          <button 
            onClick={handleClose}
            className="w-full bg-[#ff5c62] text-white py-4 rounded-2xl font-bold hover:bg-[#ee4b51] transition-all shadow-xl shadow-red-100"
          >
            Khám phá ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
