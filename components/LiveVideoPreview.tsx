import React, { useEffect, useRef, useState } from 'react';

const LiveVideoPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideoStream = async () => {
      try {
        setError(null);
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera.", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startVideoStream();

    return () => {
      // Cleanup: stop video stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-cyan-300 mb-4 text-center">My Live Video</h2>
      <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
        {error ? (
          <p className="text-red-400 text-center p-4">{error}</p>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
        )}
      </div>
    </div>
  );
};

export default LiveVideoPreview;
