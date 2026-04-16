import { useState, useRef, useEffect } from 'react';
import Quagga from '@ericblade/quagga2';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Camera, Maximize, Upload, CheckCircle2, ScanLine } from 'lucide-react';
import CustomModal from '../../components/ui/CustomModal';

const scanAudio = new Audio('/scan-sound.mp3'); 

export default function ScannerTab({ bills, saveBills }) {
  const [activeMode, setActiveMode] = useState(null); 
  const [imageSrc, setImageSrc] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [resultModal, setResultModal] = useState(false);
  
  const imageElementRef = useRef(null);
  const cropperInstance = useRef(null);
  const scannerRef = useRef(null);

  // Initialize CropperJS native instance when image source changes
  useEffect(() => {
    if (activeMode === 'upload' && imageSrc && imageElementRef.current) {
      if (cropperInstance.current) {
        cropperInstance.current.destroy();
      }
      cropperInstance.current = new Cropper(imageElementRef.current, {
        viewMode: 1,
        autoCropArea: 0.3,
        responsive: true,
        background: false,
        guides: true
      });
    }
    return () => {
      if (cropperInstance.current) {
        cropperInstance.current.destroy();
        cropperInstance.current = null;
      }
    };
  }, [activeMode, imageSrc]);

  const startCamera = () => {
    setActiveMode('camera');
    setScanResult(null);
    
    // Slight delay to ensure the DOM node is ready before Quagga binds to it
    setTimeout(() => {
      Quagga.init({
        inputStream: { 
          name: "Live", 
          type: "LiveStream", 
          target: scannerRef.current, 
          constraints: { facingMode: "environment" } 
        },
        decoder: { readers: ["code_128_reader"] },
      }, (err) => {
        if (!err) {
          Quagga.start();
        } else {
          console.error("Camera access error:", err);
          alert("Could not access camera. Please ensure permissions are granted.");
        }
      });

      Quagga.onDetected(handleDetection);
    }, 100);
  };

  const stopCamera = () => {
    Quagga.stop();
    setActiveMode(null);
  };

  const handleDetection = (result) => {
    const code = result.codeResult.code;
    processScannedCode(code);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (activeMode === 'camera') stopCamera();
      setActiveMode('upload');
      setImageSrc(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  const scanCroppedArea = () => {
    if (!cropperInstance.current) return;
    
    const canvas = cropperInstance.current.getCroppedCanvas();
    Quagga.decodeSingle({
      decoder: { readers: ["code_128_reader"] },
      locate: true,
      src: canvas.toDataURL('image/png')
    }, (result) => {
      if (result && result.codeResult) {
        processScannedCode(result.codeResult.code);
      } else {
        alert("No barcode detected in selected area. Please adjust the crop box and try again.");
      }
    });
  };

  const processScannedCode = (code) => {
    const id = Number(code);
    const invoiceIndex = bills.findIndex(b => b.id === id);
    
    if (invoiceIndex > -1) {
      scanAudio.play().catch(e => console.log("Audio play prevented:", e));
      
      const updatedBills = [...bills];
      updatedBills[invoiceIndex].status = 'paid';
      updatedBills[invoiceIndex].paidDate = new Date().toISOString();
      
      saveBills(updatedBills);
      setScanResult(`Invoice #${id} successfully marked as PAID.`);
      setResultModal(true);
      
      if (activeMode === 'camera') stopCamera();
    } else {
      alert("Invalid or unrecognized invoice code.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Invoice Scanner</h2>
        <p className="text-premium-700 mt-1">Scan physical invoice barcodes to instantly mark them as paid.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button 
          onClick={startCamera} 
          className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${activeMode === 'camera' ? 'border-accent-600 bg-accent-50 text-accent-700 shadow-sm' : 'border-premium-100 bg-white text-premium-700 hover:border-premium-300'}`}
        >
          <Camera size={48} />
          <span className="font-semibold text-lg">Use Camera</span>
        </button>
        
        <label 
          className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center gap-4 transition-all cursor-pointer ${activeMode === 'upload' ? 'border-accent-600 bg-accent-50 text-accent-700 shadow-sm' : 'border-premium-300 bg-white text-premium-700 hover:border-accent-400 hover:bg-premium-50'}`}
        >
          <Upload size={48} />
          <span className="font-semibold text-lg">Upload Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      {activeMode === 'camera' && (
        <div className="bg-premium-900 rounded-2xl overflow-hidden relative h-[400px] flex items-center justify-center border-4 border-premium-900 shadow-xl">
           <div className="absolute w-[300px] h-[100px] border-2 border-accent-500 z-20 flex items-center justify-center bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
             <div className="w-full h-0.5 bg-accent-500/50 animate-pulse shadow-[0_0_10px_#6366F1]"></div>
           </div>
           <div ref={scannerRef} className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />
           <button onClick={stopCamera} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 btn-secondary bg-white/90 backdrop-blur border-none shadow-lg px-8">
             Stop Scanner
           </button>
        </div>
      )}

      {activeMode === 'upload' && imageSrc && (
        <div className="bg-white p-6 rounded-2xl border border-premium-100 shadow-sm space-y-6">
           <div className="flex items-center gap-2 text-premium-700 mb-2">
             <Maximize size={18} className="text-accent-500" /> 
             <span className="font-medium">Align the cropper tightly around the barcode.</span>
           </div>
           <div className="h-[400px] w-full bg-premium-100 rounded-lg overflow-hidden border border-premium-200">
             <img ref={imageElementRef} src={imageSrc} alt="Upload for scanning" className="max-w-full hidden" />
           </div>
           <button onClick={scanCroppedArea} className="btn-primary w-full py-4 text-lg shadow-accent-500/30">
             <ScanLine size={20} /> Scan Selection
           </button>
        </div>
      )}

      <CustomModal isOpen={resultModal} onClose={() => setResultModal(false)} title="Scan Successful" maxWidth="max-w-md">
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 size={64} className="text-green-500 mb-4" />
          <h3 className="text-xl font-display font-semibold mb-2 text-premium-900">Payment Recorded</h3>
          <p className="text-premium-700 font-medium">{scanResult}</p>
          <button onClick={() => setResultModal(false)} className="btn-primary w-full mt-8 py-3">Continue to Dashboard</button>
        </div>
      </CustomModal>
    </div>
  );
}
