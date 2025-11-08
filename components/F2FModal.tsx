import React, { useEffect, useRef, useState, MouseEvent } from 'react';
import type { Activity } from '../types';

interface F2FModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity;
}

// Draggable Element State
interface Position {
  x: number;
  y: number;
}

type CallStatus = 'idle' | 'connecting' | 'connected' | 'error';

const F2FModal: React.FC<F2FModalProps> = ({ isOpen, onClose, activity }) => {
  // Video and WebRTC refs
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const friendVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<{ local: RTCPeerConnection | null; remote: RTCPeerConnection | null }>({ local: null, remote: null });
  
  // Draggable element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

  // UI State
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSelfInMainView, setIsSelfInMainView] = useState(false);
  const [isSelfViewVisible, setIsSelfViewVisible] = useState(true);
  const [isActivityDetailsVisible, setIsActivityDetailsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [speakerVolume, setSpeakerVolume] = useState(1);
  const lastVolumeRef = useRef(1);


  // Drag-and-Drop State
  const [pipPosition, setPipPosition] = useState<Position>({ x: 0, y: 0 });
  const [activityPosition, setActivityPosition] = useState<Position>({ x: 20, y: 20 });
  
  const [draggedElement, setDraggedElement] = useState<'pip' | 'activity' | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // WebRTC and state setup useEffect
  useEffect(() => {
    if (isOpen) {
      // Reset all states when modal opens
      setCallStatus('idle');
      setError(null);
      setIsMuted(false);
      setIsVideoOff(false);
      setIsSelfInMainView(false);
      setIsSelfViewVisible(true);
      setIsActivityDetailsVisible(true);
      setSpeakerVolume(1);
      
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const pipWidth = Math.min(containerWidth * 0.25, 250);
        setPipPosition({ x: containerWidth - pipWidth - 20, y: 20 });
      }

      // Start local video preview immediately
      const startPreview = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          if (selfVideoRef.current) {
            selfVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error getting user media.", err);
          setError("Could not access camera and microphone. Please check permissions in your browser settings.");
          setCallStatus('error');
        }
      };
      startPreview();
    }

    // Cleanup function runs when isOpen becomes false or component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (peerConnectionsRef.current.local) {
        peerConnectionsRef.current.local.close();
        peerConnectionsRef.current.local = null;
      }
      if (peerConnectionsRef.current.remote) {
        peerConnectionsRef.current.remote.close();
        peerConnectionsRef.current.remote = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (friendVideoRef.current) {
      friendVideoRef.current.volume = speakerVolume;
    }
  }, [speakerVolume]);


  const handleJoinCall = async () => {
    if (!streamRef.current) {
      setError("Local video stream is not available.");
      setCallStatus('error');
      return;
    }

    setCallStatus('connecting');
    setError(null);

    try {
      const stream = streamRef.current;
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      const localConnection = new RTCPeerConnection(configuration);
      const remoteConnection = new RTCPeerConnection(configuration);
      peerConnectionsRef.current = { local: localConnection, remote: remoteConnection };

      localConnection.onicecandidate = e => 
        !e.candidate || remoteConnection.addIceCandidate(e.candidate).catch(err => console.error("Error adding remote ICE candidate", err));
      
      remoteConnection.onicecandidate = e => 
        !e.candidate || localConnection.addIceCandidate(e.candidate).catch(err => console.error("Error adding local ICE candidate", err));

      remoteConnection.ontrack = e => {
        if (friendVideoRef.current) {
          friendVideoRef.current.srcObject = e.streams[0];
        }
      };
      
      stream.getTracks().forEach(track => localConnection.addTrack(track, stream));

      const offer = await localConnection.createOffer();
      await localConnection.setLocalDescription(offer);
      await remoteConnection.setRemoteDescription(offer);

      const answer = await remoteConnection.createAnswer();
      await remoteConnection.setLocalDescription(answer);
      await localConnection.setRemoteDescription(answer);
      
      setCallStatus('connected');

    } catch (err) {
      console.error("Error starting call.", err);
      setError("Failed to establish video connection. Please try again.");
      setCallStatus('error');
    }
  };

  // Call Control Handlers
  const handleToggleMute = () => {
    if (streamRef.current) {
      const newMutedState = !isMuted;
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMutedState; // A track is enabled when it's NOT muted
      });
      setIsMuted(newMutedState);
    }
  };

  const handleToggleVideo = () => {
    if (streamRef.current) {
      const newVideoOffState = !isVideoOff;
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !newVideoOffState; // A track is enabled when video is NOT off
      });
      setIsVideoOff(newVideoOffState);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setSpeakerVolume(newVolume);
    if (newVolume > 0) {
      lastVolumeRef.current = newVolume;
    }
  };

  const handleToggleSpeakerMute = () => {
    if (speakerVolume > 0) {
      lastVolumeRef.current = speakerVolume;
      setSpeakerVolume(0);
    } else {
      setSpeakerVolume(lastVolumeRef.current > 0 ? lastVolumeRef.current : 1);
    }
  };


  // Drag and Drop Logic
  const handleDragStart = (e: MouseEvent<HTMLDivElement>, element: 'pip' | 'activity') => {
    if ((e.target as HTMLElement).closest('button')) return; // Don't drag if clicking a button
    setDraggedElement(element);
    const targetRect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - targetRect.left,
      y: e.clientY - targetRect.top,
    });
  };

  const handleDragMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggedElement || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    let newX = e.clientX - containerRect.left - dragOffset.x;
    let newY = e.clientY - containerRect.top - dragOffset.y;
    let elWidth = 0, elHeight = 0;
    if (draggedElement === 'pip' && pipRef.current) {
        elWidth = pipRef.current.offsetWidth;
        elHeight = pipRef.current.offsetHeight;
    } else if (draggedElement === 'activity' && activityRef.current) {
        elWidth = activityRef.current.offsetWidth;
        elHeight = activityRef.current.offsetHeight;
    }
    if (elWidth > 0 && elHeight > 0) {
      newX = Math.max(0, Math.min(newX, containerRect.width - elWidth));
      newY = Math.max(0, Math.min(newY, containerRect.height - elHeight));
    }
    if (draggedElement === 'pip') setPipPosition({ x: newX, y: newY });
    else if (draggedElement === 'activity') setActivityPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => setDraggedElement(null);

  if (!isOpen) return null;

  const handleSwapViews = () => setIsSelfInMainView(prev => !prev);
  const isSelfInPip = !isSelfInMainView;
  
  const PipVideo = isSelfInMainView ? 
    <video ref={friendVideoRef} autoPlay playsInline className="w-full h-full object-cover" /> : 
    <video ref={selfVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />;

  const MainVideo = isSelfInMainView ? 
    <video ref={selfVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" /> : 
    <video ref={friendVideoRef} autoPlay playsInline className="w-full h-full object-cover" />;
    
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog" onMouseUp={handleDragEnd}>
      <div className="bg-slate-800/50 border border-white/20 rounded-2xl shadow-2xl w-full max-w-5xl text-white p-6 relative flex flex-col h-[90vh]">
        <div className="-mx-6 -mt-6 mb-4 px-6 py-4 rounded-t-2xl bg-gradient-to-r from-cyan-800/20 to-purple-800/20 border-b border-white/10 flex-shrink-0">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            F2F Chat: {activity.title}
          </h2>
        </div>

        <div 
          ref={containerRef}
          className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative flex-grow"
          onMouseMove={draggedElement ? handleDragMove : undefined}
          onMouseLeave={handleDragEnd}
        >
          {callStatus === 'error' ? (
            <p className="text-red-400 text-center p-4">{error}</p>
          ) : (
            <>
              {callStatus === 'connected' && (
                <div className="absolute top-0 left-0 w-full h-full">{MainVideo}</div>
              )}

              {(callStatus === 'idle' || callStatus === 'connecting') && (
                <div className="z-10 flex flex-col items-center justify-center text-center">
                  {callStatus === 'connecting' ? (
                      <>
                          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="mt-4 text-lg">Connecting...</p>
                      </>
                  ) : (
                      <>
                          <p className="text-xl mb-4">You're ready to start the chat!</p>
                          <button 
                              onClick={handleJoinCall}
                              className="bg-cyan-500/80 hover:bg-cyan-500 border border-cyan-400 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg hover:shadow-cyan-500/30"
                          >
                              Join Call
                          </button>
                      </>
                  )}
                </div>
              )}
              
              {isSelfViewVisible && (
                 <div
                  ref={pipRef}
                  className="absolute w-1/4 max-w-[250px] rounded-lg border-2 border-white/20 z-20 group"
                  style={{ transform: `translate(${pipPosition.x}px, ${pipPosition.y}px)`, cursor: draggedElement === 'pip' ? 'grabbing' : 'grab' }}
                  onMouseDown={(e) => handleDragStart(e, 'pip')}
                 >
                    {callStatus !== 'connected' ? (
                      <video ref={selfVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                    ) : (
                      PipVideo
                    )}
                    {callStatus === 'connected' && (
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button onClick={handleSwapViews} className="w-10 h-10 bg-slate-900/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors" aria-label="Swap views">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                         </button>
                         {isSelfInPip && (
                           <button onClick={() => setIsSelfViewVisible(false)} className="w-10 h-10 bg-slate-900/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors" aria-label="Hide self view">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                         )}
                      </div>
                    )}
                 </div>
              )}

              {isActivityDetailsVisible && (
                 <div
                  ref={activityRef}
                  id="activity-details-box"
                  className="absolute w-1/4 max-w-[250px] bg-slate-900/50 backdrop-blur-md border border-white/20 rounded-lg p-3 z-10 group"
                  style={{ transform: `translate(${activityPosition.x}px, ${activityPosition.y}px)`, cursor: draggedElement === 'activity' ? 'grabbing' : 'grab' }}
                  onMouseDown={(e) => handleDragStart(e, 'activity')}
                 >
                    <h4 className="font-bold text-cyan-300 text-sm mb-1">Activity Details</h4>
                    <p className="text-xs text-gray-200">{activity.description}</p>
                    <button onClick={() => setIsActivityDetailsVisible(false)} className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all" aria-label="Hide activity details">
                      &times;
                    </button>
                 </div>
              )}
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
                 {callStatus === 'connected' && (
                   <>
                    <div className="flex items-center gap-2 bg-slate-700/60 backdrop-blur-sm rounded-full py-2 px-4 shadow-lg text-white">
                        <button
                            onClick={handleToggleSpeakerMute}
                            aria-label={speakerVolume === 0 ? 'Unmute speaker' : 'Mute speaker'}
                        >
                            {speakerVolume === 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-4-4m0 4l4-4" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 20V4L7 9H4a2 2 0 00-2 2v2a2 2 0 002 2h3l5 5z" /></svg>
                            )}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={speakerVolume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            aria-label="Volume control"
                        />
                    </div>
                    <button
                      onClick={handleToggleMute}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 text-white shadow-lg ${isMuted ? 'bg-red-600/80 hover:bg-red-600' : 'bg-slate-700/60 hover:bg-slate-700/90 backdrop-blur-sm'}`}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5l14 14" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      )}
                    </button>
                    <button
                      onClick={handleToggleVideo}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 text-white shadow-lg ${isVideoOff ? 'bg-red-600/80 hover:bg-red-600' : 'bg-slate-700/60 hover:bg-slate-700/90 backdrop-blur-sm'}`}
                      aria-label={isVideoOff ? 'Turn video on' : 'Turn video off'}
                    >
                      {isVideoOff ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                   </>
                 )}
                 <button onClick={onClose} className="bg-red-600/80 hover:bg-red-600 text-white font-bold w-16 h-16 rounded-full transition-colors duration-300 flex items-center justify-center shadow-lg" aria-label="End Call">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(135deg)'}}>
                     <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.22-3.75-6.57-6.57l1.97-1.57c.27-.27.36-.66.24-1.01-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.75 0 .99-.65.99-1.19v-2.43c0-.54-.45-.99-.99-.99z"/>
                   </svg>
                 </button>
                 {!isSelfViewVisible && callStatus === 'connected' && (
                   <button onClick={() => setIsSelfViewVisible(true)} className="bg-slate-900/50 backdrop-blur-sm border border-white/20 text-white py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition-colors">
                     Show Self View
                   </button>
                 )}
                 {!isActivityDetailsVisible && (
                   <button onClick={() => setIsActivityDetailsVisible(true)} className="bg-slate-900/50 backdrop-blur-sm border border-white/20 text-white py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition-colors">
                     Show Activity
                   </button>
                 )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default F2FModal;