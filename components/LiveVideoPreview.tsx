import React, { useEffect, useRef, useState } from 'react';
import { UserRole } from './UserMenu';

interface LiveVideoPreviewProps {
  currentUser: UserRole;
  userLayout: UserRole[];
  videosVisible: boolean;
}

const LiveVideoPreview: React.FC<LiveVideoPreviewProps> = ({ currentUser, userLayout, videosVisible }) => {
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
  }, []);

  const VideoBox: React.FC<{ user: UserRole; isMain?: boolean; isLive?: boolean }> = ({ 
    user, 
    isMain = false, 
    isLive = false 
  }) => (
    <div className={`
      ${isMain ? 'w-full aspect-video' : 'w-32 h-24'} 
      bg-slate-900 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative
    `}>
      {/* User Label */}
      <div className={`absolute top-2 left-2 z-10 px-2 py-1 ${user.color} text-white text-xs rounded-full font-medium`}>
        {user.name}
      </div>
      
      {/* Video Content */}
      {!videosVisible ? (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-1">
            📺
          </div>
          <span className="text-xs">Video Hidden</span>
        </div>
      ) : isLive && !error ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
      ) : error && isLive ? (
        <p className="text-red-400 text-center p-2 text-xs">{error}</p>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-1">
            👤
          </div>
          <span className="text-xs">{user.name}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
      <h2 className="text-xl font-semibold text-cyan-300 mb-4 text-center">
        DayMaker Live Video
      </h2>
      
      {/* Main video box - DayMaker only */}
      <div className="w-full">
        <VideoBox 
          user={currentUser} 
          isMain={true} 
          isLive={true} 
        />
      </div>

      {/* Current View Indicator */}
      <div className="mt-3 text-center">
        <span className="text-sm text-gray-400">
          Connected as: <span className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs rounded-full ml-1">
            DayMaker
          </span>
        </span>
      </div>
    </div>
  );
};

export default LiveVideoPreview;
