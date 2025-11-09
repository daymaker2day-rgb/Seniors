import React, { useEffect, useRef, useState } from 'react';
import { UserRole } from './UserMenu';

interface LiveVideoPreviewProps {
  currentUser: UserRole;
  userLayout: UserRole[];
  videosVisible: boolean;
  cameraEnabled?: boolean;
}

interface VideoStream {
  id: string;
  stream: MediaStream;
  position: string;
  deviceInfo: string;
}

const LiveVideoPreview: React.FC<LiveVideoPreviewProps> = ({ currentUser, userLayout, videosVisible, cameraEnabled = true }) => {
  const [videoStreams, setVideoStreams] = useState<VideoStream[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOnly, setAudioOnly] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  // Get available video devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
        const audioDevices = deviceList.filter(device => device.kind === 'audioinput');
        
        setDevices(videoDevices);
        setHasCamera(videoDevices.length > 0);
        
        // If no camera but has microphone, suggest audio-only mode
        if (videoDevices.length === 0 && audioDevices.length > 0) {
          setAudioOnly(true);
        }
      } catch (err) {
        console.error("Error getting devices:", err);
        setHasCamera(false);
      }
    };

    getDevices();
  }, []);

  // Start video streams for current user position
  useEffect(() => {
    let streams: MediaStream[] = [];

    const startVideoStreams = async () => {
      try {
        setError(null);
        
        // Clear existing streams
        videoStreams.forEach(vs => {
          vs.stream.getTracks().forEach(track => track.stop());
        });
        setVideoStreams([]);

        if (cameraEnabled && (devices.length > 0 || audioOnly)) {
          // For testing multiple devices, try to get stream from available cameras
          const newStreams: VideoStream[] = [];
          
          // Primary camera for current position (or audio-only)
          try {
            const constraints = audioOnly ? 
              { audio: true, video: false } : 
              { 
                audio: true,
                video: { 
                  deviceId: devices[0]?.deviceId,
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                } 
              };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streams.push(stream);
            
            newStreams.push({
              id: `stream-${currentUser.position}`,
              stream,
              position: currentUser.position || 'center',
              deviceInfo: audioOnly ? 'Audio Only' : (devices[0]?.label || 'Default Camera')
            });
          } catch (err) {
            console.error("Error accessing media:", err);
            setError(audioOnly ? "Could not access microphone" : "Could not access camera. Trying audio-only...");
            
            // Fallback to audio-only if camera fails
            if (!audioOnly) {
              try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                streams.push(audioStream);
                setAudioOnly(true);
                newStreams.push({
                  id: `audio-stream-${currentUser.position}`,
                  stream: audioStream,
                  position: currentUser.position || 'center',
                  deviceInfo: 'Audio Only (Camera Failed)'
                });
                setError(null);
              } catch (audioErr) {
                console.error("Audio fallback failed:", audioErr);
                setError("Could not access camera or microphone. Please check permissions.");
              }
            }
          }

          // For multi-device testing - simulate additional streams if multiple devices available
          if (devices.length > 1 && userLayout.length > 1) {
            for (let i = 1; i < Math.min(devices.length, userLayout.length); i++) {
              try {
                const testStream = await navigator.mediaDevices.getUserMedia({ 
                  video: { 
                    deviceId: devices[i]?.deviceId,
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                  } 
                });
                streams.push(testStream);
                
                newStreams.push({
                  id: `test-stream-${i}`,
                  stream: testStream,
                  position: userLayout[i]?.position || 'top-left',
                  deviceInfo: devices[i]?.label || `Camera ${i + 1}`
                });
              } catch (err) {
                console.log(`Could not access camera ${i + 1}:`, err);
              }
            }
          }

          setVideoStreams(newStreams);
        }
      } catch (err) {
        console.error("Error starting video streams:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    if (videosVisible) {
      startVideoStreams();
    }

    return () => {
      // Cleanup: stop all video streams when component unmounts or camera disabled
      streams.forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
    };
  }, [cameraEnabled, videosVisible, currentUser.position, devices]);

  const VideoBox: React.FC<{ 
    user?: UserRole; 
    isMain?: boolean; 
    position: string;
    isEmpty?: boolean;
  }> = ({ user, isMain = false, position, isEmpty = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoStream = videoStreams.find(vs => vs.position === position);

    useEffect(() => {
      if (videoRef.current && videoStream) {
        videoRef.current.srcObject = videoStream.stream;
      }
    }, [videoStream]);

    return (
      <div className={`
        w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative
        ${isMain ? 'aspect-video' : 'aspect-video'}
      `}>
        {/* User Label */}
        {user && (
          <div className={`absolute top-2 left-2 z-10 px-2 py-1 ${user.color} text-white text-xs rounded-full font-medium shadow-lg`}>
            {user.name}
          </div>
        )}

        {/* Device Info for testing */}
        {videoStream && (
          <div className="absolute bottom-2 left-2 z-10 px-2 py-1 bg-black/50 text-white text-xs rounded font-medium">
            {videoStream.deviceInfo}
          </div>
        )}
        
        {/* Video Content */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
              📹
            </div>
            <span className="text-sm">Empty Spot</span>
            <span className="text-xs opacity-75">Click M → Select Position</span>
          </div>
        ) : !videosVisible ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              📺
            </div>
            <span className="text-sm">Video Hidden</span>
          </div>
        ) : !cameraEnabled ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              📷
            </div>
            <span className="text-sm">Camera Off</span>
          </div>
        ) : videoStream && !error ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : audioOnly ? (
          <div className="flex flex-col items-center justify-center text-cyan-400">
            <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mb-3 animate-pulse">
              🎤
            </div>
            <span className="text-lg font-semibold">Audio Connected</span>
            <span className="text-sm opacity-75">Voice-only mode</span>
            {videoStream && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Microphone active</span>
              </div>
            )}
          </div>
        ) : error && videoStream ? (
          <div className="flex flex-col items-center justify-center text-red-400 p-4">
            <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mb-2">
              ⚠️
            </div>
            <p className="text-center text-sm">{error}</p>
          </div>
        ) : user ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2">
              👤
            </div>
            <span className="text-sm">{user.name}</span>
            <span className="text-xs opacity-75">Waiting for video...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
              📹
            </div>
            <span className="text-sm">Empty Spot</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-cyan-300">
          Live Video Conference
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            {devices.length > 0 ? `${devices.length} camera(s) detected` : 'No cameras detected'}
          </div>
          {!hasCamera && (
            <button
              onClick={() => setAudioOnly(!audioOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                audioOnly 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              🎤 Audio Only
            </button>
          )}
        </div>
      </div>
      
      {/* Multi-position video layout - All positions fill their containers */}
      <div className="space-y-4">
        {/* Top Row - Two equal columns */}
        <div className="grid grid-cols-2 gap-4 h-48">
          {/* Top Left */}
          <VideoBox 
            user={userLayout.find(u => u.position === 'top-left')}
            position="top-left"
            isEmpty={!userLayout.find(u => u.position === 'top-left')}
          />
          
          {/* Top Right */}
          <VideoBox 
            user={userLayout.find(u => u.position === 'top-right')}
            position="top-right"
            isEmpty={!userLayout.find(u => u.position === 'top-right')}
          />
        </div>
        
        {/* Center - Main Video - Full width and larger */}
        <div className="w-full h-80">
          <VideoBox 
            user={userLayout.find(u => u.position === 'center')}
            isMain={true}
            position="center"
            isEmpty={!userLayout.find(u => u.position === 'center')}
          />
        </div>
      </div>

      {/* Multi-device testing info */}
      {devices.length > 1 && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">Multi-Device Testing Available</h3>
          <div className="text-xs text-gray-300 space-y-1">
            {devices.map((device, index) => (
              <div key={device.deviceId} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>{device.label || `Camera ${index + 1}`}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💡 Connect with different devices (phone, laptop, tablet) to test multi-person F2F functionality
          </p>
        </div>
      )}

      {/* Voice-Only Support Info */}
      {!hasCamera && (
        <div className="mt-4 p-4 bg-orange-900/20 border border-orange-400/30 rounded-lg">
          <h3 className="text-sm font-semibold text-orange-300 mb-2">📞 Voice-Only Mode Available</h3>
          <div className="text-xs text-gray-300 space-y-2">
            <p>• No camera needed - just your microphone</p>
            <p>• Perfect for users without smartphones</p>
            <p>• Full conversation participation</p>
            <p>• Call support: <span className="text-orange-300 font-semibold">(555) DAYMAKER</span></p>
          </div>
        </div>
      )}

      {/* No Device Support */}
      {!hasCamera && devices.length === 0 && (
        <div className="mt-4 p-4 bg-purple-900/20 border border-purple-400/30 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">🏠 Family Helper Available</h3>
          <div className="text-xs text-gray-300 space-y-2">
            <p>• Have family member or friend set up your account</p>
            <p>• We'll call you directly for activities</p>
            <p>• No internet or devices required</p>
            <p>• Human support: <span className="text-purple-300 font-semibold">daymaker2day@gmail.com</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveVideoPreview;
