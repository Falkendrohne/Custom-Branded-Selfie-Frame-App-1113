import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiShare2, FiFacebook, FiTwitter, FiInstagram } = FiIcons;

const SocialShare = ({ image, businessName, onClose }) => {
  const shareText = `Schaut euch mein tolles Selfie mit ${businessName} an! 📸✨`;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: FiFacebook,
      color: 'bg-blue-600',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Twitter',
      icon: FiTwitter,
      color: 'bg-sky-500',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'Instagram',
      icon: FiInstagram,
      color: 'bg-pink-600',
      action: () => {
        alert('Bitte speichern Sie das Bild und teilen Sie es manuell auf Instagram.');
      }
    },
    {
      name: 'WhatsApp',
      icon: FiShare2,
      color: 'bg-green-600',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`;
        window.open(url, '_blank');
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Selfie teilen</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="aspect-square w-32 mx-auto rounded-lg overflow-hidden shadow-lg">
            <img
              src={image}
              alt="Selfie preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center mb-4">
            Teilen Sie Ihr Selfie auf Ihren sozialen Medien
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <motion.button
                key={option.name}
                onClick={option.action}
                className={`${option.color} text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={option.icon} className="w-5 h-5" />
                <span>{option.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {shareText}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SocialShare;