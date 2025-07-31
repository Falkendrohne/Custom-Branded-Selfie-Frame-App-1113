import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import FrameSelector from './FrameSelector'
import SocialShare from './SocialShare'
import { useTenant } from '../contexts/TenantContext'
import html2canvas from 'html2canvas'

const { FiCamera, FiRotateCcw, FiDownload, FiShare2, FiX, FiAlertTriangle } = FiIcons

const TenantCameraView = () => {
  const { currentTenant, tenantConfig, isSubscriptionActive } = useTenant()
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [selectedFrame, setSelectedFrame] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [showDownloadInstructions, setShowDownloadInstructions] = useState(false)
  const [downloadImageUrl, setDownloadImageUrl] = useState(null)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const previewRef = useRef(null)

  // Detect iOS device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

  useEffect(() => {
    if (tenantConfig?.frames) {
      const defaultFrame = tenantConfig.frames.find(f => f.isDefault && f.isActive) || 
                          tenantConfig.frames.find(f => f.isActive) ||
                          tenantConfig.frames[0]
      setSelectedFrame(defaultFrame)
    }
  }, [tenantConfig])

  useEffect(() => {
    if (isSubscriptionActive()) {
      startCamera()
    }
    
    return () => {
      stopCamera()
    }
  }, [isSubscriptionActive])

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      setStream(null)
    }
    setCameraReady(false)
  }

  const startCamera = async () => {
    try {
      stopCamera()

      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              setCameraReady(true)
            })
            .catch(err => {
              console.error("Error playing video:", err)
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.play()
                    .then(() => setCameraReady(true))
                    .catch(() => setCameraReady(false))
                }
              }, 500)
            })
        }
      }
    } catch (error) {
      console.error('Fehler beim Zugriff auf die Kamera:', error)
      alert('Kamera-Zugriff fehlgeschlagen. Bitte erlauben Sie den Kamera-Zugriff und aktualisieren Sie die Seite.')
      setCameraReady(false)
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return

    setIsLoading(true)
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const videoWidth = video.videoWidth || video.clientWidth
      const videoHeight = video.videoHeight || video.clientHeight

      if (videoWidth === 0 || videoHeight === 0) {
        throw new Error('Video dimensions are invalid')
      }

      canvas.width = videoWidth
      canvas.height = videoHeight

      // Mirror the video for more natural selfies
      ctx.scale(-1, 1)
      ctx.drawImage(video, -canvas.width, 0)

      const imageData = canvas.toDataURL('image/png')
      setCapturedImage(imageData)

      if (isIOS) {
        stopCamera()
      }
    } catch (error) {
      console.error('Fehler beim Aufnehmen des Fotos:', error)
      alert('Foto konnte nicht aufgenommen werden. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const retakePhoto = async () => {
    setShowDownloadInstructions(false)
    setCapturedImage(null)
    setShowShareModal(false)

    if (downloadImageUrl) {
      URL.revokeObjectURL(downloadImageUrl)
      setDownloadImageUrl(null)
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      await startCamera()
    } catch (error) {
      console.error('Fehler beim Neustarten der Kamera:', error)
      setTimeout(() => {
        startCamera()
      }, 800)
    }
  }

  const downloadImage = async () => {
    if (!previewRef.current) return

    try {
      setIsLoading(true)
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      if (isIOS) {
        canvas.toBlob(blob => {
          const objectUrl = URL.createObjectURL(blob)
          setDownloadImageUrl(objectUrl)
          setShowDownloadInstructions(true)
        }, 'image/png')
      } else {
        const link = document.createElement('a')
        link.download = `selfie-${currentTenant.name}-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    } catch (error) {
      console.error('Fehler beim Download:', error)
      alert('Download fehlgeschlagen. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const shareImage = () => {
    setShowDownloadInstructions(false)
    setShowShareModal(true)
  }

  const closeDownloadInstructions = () => {
    setShowDownloadInstructions(false)
    if (downloadImageUrl) {
      URL.revokeObjectURL(downloadImageUrl)
      setDownloadImageUrl(null)
    }
  }

  const getTextOverlayStyle = () => {
    if (!tenantConfig?.textOverlay?.enabled) return {}

    const { fontSize, colorScheme, position } = tenantConfig.textOverlay

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
    }

    if (position === 'top') {
      styles.top = '1rem'
    } else {
      styles.bottom = '1rem'
    }

    if (fontSize === 'small') {
      styles.fontSize = '0.875rem'
    } else if (fontSize === 'large') {
      styles.fontSize = '1.25rem'
    } else {
      styles.fontSize = '1rem'
    }

    if (colorScheme === 'primary') {
      styles.backgroundColor = currentTenant.settings.primaryColor
      styles.color = currentTenant.settings.secondaryColor
    } else {
      styles.backgroundColor = 'black'
      styles.color = 'white'
    }

    return styles
  }

  // Show subscription expired message
  if (!isSubscriptionActive()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <SafeIcon icon={FiAlertTriangle} className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Abonnement abgelaufen</h2>
          <p className="text-gray-600 mb-6">
            Das Abonnement für {currentTenant.name} ist abgelaufen. 
            Bitte kontaktieren Sie Ihre Fahrschule für weitere Informationen.
          </p>
          <div className="text-sm text-gray-500">
            <p>Kontakt: {currentTenant.email}</p>
            <p>{currentTenant.phone}</p>
          </div>
        </motion.div>
      </div>
    )
  }

  const overlayText = tenantConfig?.textOverlay?.text
  const textOverlayStyle = getTextOverlayStyle()

  return (
    <div 
      className="min-h-screen p-4"
      style={{ 
        background: `linear-gradient(135deg, ${currentTenant.settings.primaryColor}20 0%, ${currentTenant.settings.secondaryColor}20 100%)` 
      }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div 
            className="text-white p-6"
            style={{ 
              background: `linear-gradient(135deg, ${currentTenant.settings.primaryColor} 0%, ${currentTenant.settings.secondaryColor} 100%)` 
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{currentTenant.name}</h1>
                <p className="opacity-90 mt-1">Machen Sie Ihr perfektes Selfie</p>
              </div>
              {currentTenant.settings.logo?.url && (
                <img
                  src={currentTenant.settings.logo.url}
                  alt={currentTenant.name}
                  className="h-12 object-contain"
                />
              )}
            </div>
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
                    style={{ opacity: cameraReady ? 1 : 0.5, transition: 'opacity 0.3s ease-in-out' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />

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
                <div ref={previewRef} className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured selfie"
                    className="w-full h-full object-cover"
                  />

                  {/* Frame Overlay */}
                  {selectedFrame?.url && (
                    <div
                      className="absolute inset-0 bg-center bg-cover pointer-events-none"
                      style={{
                        backgroundImage: `url(${selectedFrame.url})`,
                        mixBlendMode: 'multiply'
                      }}
                    />
                  )}

                  {/* Logo Overlay */}
                  {currentTenant.settings.logo?.url && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <img
                        src={currentTenant.settings.logo.url}
                        alt="Logo"
                        className={`object-contain drop-shadow-lg ${
                          currentTenant.settings.logo.size === 'small' ? 'h-8' :
                          currentTenant.settings.logo.size === 'large' ? 'h-16' : 'h-12'
                        }`}
                      />
                    </div>
                  )}

                  {/* Text Overlay */}
                  {tenantConfig?.textOverlay?.enabled && overlayText && (
                    <div style={textOverlayStyle}>
                      {overlayText}
                    </div>
                  )}
                </div>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                  <div className="bg-white rounded-full p-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              )}

              {/* Live Text Overlay Preview */}
              {!capturedImage && tenantConfig?.textOverlay?.enabled && overlayText && cameraReady && (
                <div style={textOverlayStyle}>
                  {overlayText}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col items-center space-y-4">
              {!capturedImage ? (
                <motion.button
                  onClick={capturePhoto}
                  disabled={isLoading || !cameraReady}
                  className="text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentTenant.settings.primaryColor} 0%, ${currentTenant.settings.secondaryColor} 100%)` 
                  }}
                  whileHover={{ scale: cameraReady ? 1.05 : 1 }}
                  whileTap={{ scale: cameraReady ? 0.95 : 1 }}
                >
                  <SafeIcon icon={FiCamera} className="w-6 h-6" />
                  <span>{cameraReady ? 'Foto aufnehmen' : 'Kamera lädt...'}</span>
                </motion.button>
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
                    className="text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentTenant.settings.primaryColor} 0%, ${currentTenant.settings.secondaryColor} 100%)` 
                    }}
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
          {tenantConfig?.frames && (
            <div className="border-t border-gray-200 p-6">
              <FrameSelector
                frames={tenantConfig.frames.filter(f => f.isActive)}
                selectedFrame={selectedFrame}
                onSelectFrame={setSelectedFrame}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showShareModal && (
          <SocialShare
            image={capturedImage}
            businessName={currentTenant.name}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDownloadInstructions && downloadImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={closeDownloadInstructions}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Bild speichern</h3>
                <button
                  onClick={closeDownloadInstructions}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <a href={downloadImageUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={downloadImageUrl} alt="Your selfie" className="w-full h-auto rounded-lg shadow-md" />
                </a>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">Um das Bild zu speichern:</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Tippen und halten Sie auf das Bild</li>
                  <li>Wählen Sie "Bild speichern" aus dem Menü</li>
                </ol>
                
                <div className="flex justify-center mt-4">
                  <a
                    href={downloadImageUrl}
                    download={`selfie-${currentTenant.name}-${Date.now()}.png`}
                    className="text-white px-6 py-3 rounded-full font-semibold shadow-md transition-colors"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentTenant.settings.primaryColor} 0%, ${currentTenant.settings.secondaryColor} 100%)` 
                    }}
                  >
                    Bild direkt speichern
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TenantCameraView