import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import FrameSelector from './FrameSelector';
import SocialShare from './SocialShare';
import html2canvas from 'html2canvas';

const { FiCamera, FiRotateCcw, FiShare2, FiX, FiMapPin } = FiIcons;

const CameraView = ({ appConfig }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(appConfig.frames.find(f => f.isDefault) || appConfig.frames[0]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);

  // Detect iOS device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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
      stopCamera();
    };
  }, [appConfig.textOverlay]);

  // Separate function to stop camera stream
  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    setCameraReady(false);
  };

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
      // Stop any existing stream first
      stopCamera();
      
      // Request camera access with specific constraints for better iOS compatibility
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              setCameraReady(true);
            })
            .catch(err => {
              console.error("Error playing video:", err);
              // Try again with a timeout
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.play()
                    .then(() => setCameraReady(true))
                    .catch(() => setCameraReady(false));
                }
              }, 500);
            });
        };
      }
    } catch (error) {
      console.error('Fehler beim Zugriff auf die Kamera:', error);
      alert('Kamera-Zugriff fehlgeschlagen. Bitte erlauben Sie den Kamera-Zugriff und aktualisieren Sie die Seite.');
      setCameraReady(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    setIsLoading(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Ensure video has valid dimensions
      const videoWidth = video.videoWidth || video.clientWidth;
      const videoHeight = video.videoHeight || video.clientHeight;
      
      if (videoWidth === 0 || videoHeight === 0) {
        throw new Error('Video dimensions are invalid');
      }

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Spiegeln des Videos für natürlichere Selfies
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0);

      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      // Stop camera stream after taking photo to prevent iOS issues
      if (isIOS) {
        stopCamera();
      }
    } catch (error) {
      console.error('Fehler beim Aufnehmen des Fotos:', error);
      alert('Foto konnte nicht aufgenommen werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const retakePhoto = async () => {
    // Clear captured image state
    setCapturedImage(null);
    setShowShareModal(false);
    
    try {
      // Force a small delay before restarting camera (helps on iOS)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Start the camera again
      await startCamera();
    } catch (error) {
      console.error('Fehler beim Neustarten der Kamera:', error);
      
      // Final fallback for iOS
      setTimeout(() => {
        startCamera();
      }, 800);
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
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 10
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
                    style={{ 
                      opacity: cameraReady ? 1 : 0.5,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Camera loading indicator */}
                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm">Kamera wird geladen...</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div ref={previewRef} className="relative w-full h-full" data-preview="true">
                  <img
                    src={capturedImage}
                    alt="Captured selfie"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Text Overlay */}
                  {appConfig.textOverlay?.enabled && overlayText && (
                    <div style={textOverlayStyle}>
                      {appConfig.textOverlay.useLocation && (
                        <SafeIcon icon={FiMapPin} className="inline-block mr-1" />
                      )}
                      {overlayText}
                    </div>
                  )}
                  
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
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                  
                  {/* Frame Overlay - only show if frame has URL */}
                  {selectedFrame.url && (
                    <div 
                      className="absolute inset-0 bg-center bg-cover pointer-events-none"
                      style={{ 
                        backgroundImage: `url(${selectedFrame.url})`,
                        mixBlendMode: 'multiply'
                      }}
                    />
                  )}
                </div>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                  <div className="bg-white rounded-full p-4">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              )}
              
              {/* Live Text Overlay Preview */}
              {!capturedImage && appConfig.textOverlay?.enabled && overlayText && cameraReady && (
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
                    disabled={isLoading || !cameraReady}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: cameraReady ? 1.05 : 1 }}
                    whileTap={{ scale: cameraReady ? 0.95 : 1 }}
                    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                  >
                    <SafeIcon icon={FiCamera} className="w-6 h-6" />
                    <span>{cameraReady ? 'Foto aufnehmen' : 'Kamera lädt...'}</span>
                  </motion.button>
                </>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  <motion.button
                    onClick={retakePhoto}
                    className="bg-gray-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      touchAction: 'manipulation', 
                      WebkitTapHighlightColor: 'transparent',
                      WebkitAppearance: 'none'
                    }}
                  >
                    <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
                    <span>Wiederholen</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={shareImage}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      touchAction: 'manipulation', 
                      WebkitTapHighlightColor: 'transparent',
                      WebkitAppearance: 'none'
                    }}
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
            selectedFrame={selectedFrame}
            previewRef={previewRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraView;