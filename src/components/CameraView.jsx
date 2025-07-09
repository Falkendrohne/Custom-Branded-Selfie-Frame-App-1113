import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import FrameSelector from './FrameSelector';
import SocialShare from './SocialShare';
import html2canvas from 'html2canvas';

const { FiCamera, FiRotateCcw, FiDownload, FiShare2, FiX, FiMapPin } = FiIcons;

const CameraView = ({ appConfig }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(appConfig.frames.find(f => f.isDefault) || appConfig.frames[0]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);

  // Get the text to display in the overlay
  const getOverlayText = () => {
    if (!appConfig.textOverlay || !appConfig.textOverlay.enabled) return null;
    
    if (appConfig.textOverlay.useLocation) {
      if (locationError) {
        return "Standort nicht verfügbar";
      } else if (!userLocation) {
        return "Standort wird ermittelt...";
      } else {
        return `${appConfig.textOverlay.locationPrefix} ${userLocation}`;
      }
    } else {
      return appConfig.textOverlay.text || "";
    }
  };

  useEffect(() => {
    startCamera();
    
    // If location is enabled, get user's location
    if (appConfig.textOverlay?.enabled && appConfig.textOverlay?.useLocation) {
      getUserLocation();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [appConfig.textOverlay]);

  const getUserLocation = () => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation wird von Ihrem Browser nicht unterstützt");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use reverse geocoding to get a readable location
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          // Extract city/town or suburb name as a readable location
          const locationName = data.address?.city || 
                              data.address?.town || 
                              data.address?.village || 
                              data.address?.suburb || 
                              "Unbekannter Ort";
          
          setUserLocation(locationName);
        } catch (error) {
          console.error("Error fetching location name:", error);
          setUserLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(
          error.code === 1 
            ? "Standortzugriff verweigert" 
            : "Standortermittlung fehlgeschlagen"
        );
      }
    );
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Fehler beim Zugriff auf die Kamera:', error);
      alert('Kamera-Zugriff fehlgeschlagen. Bitte erlauben Sie den Kamera-Zugriff.');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Spiegeln des Videos für natürlichere Selfies
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0);

    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    setIsLoading(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowShareModal(false);
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `selfie-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Fehler beim Download:', error);
      alert('Download fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  };

  const shareImage = () => {
    setShowShareModal(true);
  };

  // Function to determine text overlay style
  const getTextOverlayStyle = () => {
    if (!appConfig.textOverlay || !appConfig.textOverlay.enabled) return {};
    
    const { fontSize, colorScheme, position } = appConfig.textOverlay;
    
    // Base styles
    const styles = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      textAlign: 'center',
      maxWidth: '90%',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };
    
    // Position
    if (position === 'top') {
      styles.top = '1rem';
    } else {
      styles.bottom = '1rem';
    }
    
    // Font size
    if (fontSize === 'small') {
      styles.fontSize = '0.875rem';
    } else if (fontSize === 'large') {
      styles.fontSize = '1.25rem';
    } else {
      styles.fontSize = '1rem';
    }
    
    // Colors
    if (colorScheme === 'primary') {
      styles.backgroundColor = appConfig.primaryColor;
      styles.color = appConfig.secondaryColor;
    } else {
      styles.backgroundColor = 'black';
      styles.color = 'white';
    }
    
    return styles;
  };

  const overlayText = getOverlayText();
  const textOverlayStyle = getTextOverlayStyle();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold text-center">
              Selfie mit {appConfig.businessName}
            </h1>
            <p className="text-center text-indigo-100 mt-2">
              Wählen Sie einen Rahmen und machen Sie Ihr perfektes Selfie
            </p>
          </div>

          {/* Camera/Preview Area */}
          <div className="p-6">
            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-[3/4] max-w-md mx-auto">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div ref={previewRef} className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured selfie"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Frame Overlay */}
                  <div 
                    className="absolute inset-0 bg-center bg-cover pointer-events-none"
                    style={{ 
                      backgroundImage: `url(${selectedFrame.url})`,
                      mixBlendMode: 'multiply'
                    }}
                  />
                  
                  {/* Logo Overlay */}
                  {appConfig.logo.url && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <img
                        src={appConfig.logo.url}
                        alt="Logo"
                        className={`
                          ${appConfig.logo.size === 'small' ? 'h-8' : 
                            appConfig.logo.size === 'large' ? 'h-16' : 'h-12'}
                          object-contain drop-shadow-lg
                        `}
                      />
                    </div>
                  )}
                  
                  {/* Text Overlay */}
                  {appConfig.textOverlay?.enabled && overlayText && (
                    <div style={textOverlayStyle}>
                      {appConfig.textOverlay.useLocation && (
                        <SafeIcon icon={FiMapPin} className="inline-block mr-1" />
                      )}
                      {overlayText}
                    </div>
                  )}
                </div>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-full p-4">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              )}
              
              {/* Live Text Overlay Preview */}
              {!capturedImage && appConfig.textOverlay?.enabled && overlayText && (
                <div style={textOverlayStyle}>
                  {appConfig.textOverlay.useLocation && (
                    <SafeIcon icon={FiMapPin} className="inline-block mr-1" />
                  )}
                  {overlayText}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col items-center space-y-4">
              {!capturedImage ? (
                <>
                  <motion.button
                    onClick={capturePhoto}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiCamera} className="w-6 h-6" />
                    <span>Foto aufnehmen</span>
                  </motion.button>
                </>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  <motion.button
                    onClick={retakePhoto}
                    className="bg-gray-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
                    <span>Wiederholen</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={downloadImage}
                    className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiDownload} className="w-5 h-5" />
                    <span>Download</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={shareImage}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiShare2} className="w-5 h-5" />
                    <span>Teilen</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Frame Selector */}
          <div className="border-t border-gray-200 p-6">
            <FrameSelector
              frames={appConfig.frames}
              selectedFrame={selectedFrame}
              onSelectFrame={setSelectedFrame}
            />
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <SocialShare
            image={capturedImage}
            businessName={appConfig.businessName}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraView;