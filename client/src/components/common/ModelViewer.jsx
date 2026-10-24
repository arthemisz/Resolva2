import React from 'react';
import resolvaModel from '../../../assets/resolva-model.glb';

export default function ModelViewer({ className = "w-full h-64 sm:h-72 md:h-80" }) {
  return (
    <div className="relative w-full max-w-md mx-auto flex items-center justify-center">
      <model-viewer
        src={resolvaModel}
        camera-controls
        disable-zoom
        auto-rotate
        rotation-per-second="12deg"
        min-camera-orbit="-40deg 60deg auto"
        max-camera-orbit="40deg 100deg auto"
        environment-image="neutral"
        shadow-intensity="1"
        interaction-prompt="none"
        className={`${className} outline-none`}
        style={{ width: '100%', height: '320px' }}
      >
      </model-viewer>
    </div>
  );
}
