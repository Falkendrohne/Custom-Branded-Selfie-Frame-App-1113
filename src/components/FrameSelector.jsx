import React from 'react';
import { motion } from 'framer-motion';

const FrameSelector = ({ frames, selectedFrame, onSelectFrame }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Rahmen auswählen
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {frames.map((frame) => (
          <motion.div
            key={frame.id}
            onClick={() => onSelectFrame(frame)}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden aspect-[3/4] border-4 transition-all duration-200
              ${selectedFrame.id === frame.id 
                ? 'border-indigo-600 shadow-lg' 
                : 'border-gray-200 hover:border-indigo-300'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${frame.url})` }}
            />
            
            {selectedFrame.id === frame.id && (
              <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                <div className="bg-white rounded-full p-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-sm font-medium text-center">
                {frame.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FrameSelector;