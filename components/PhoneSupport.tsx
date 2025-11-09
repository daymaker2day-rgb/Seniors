import React, { useState } from 'react';

interface PhoneSupportProps {
  userInfo?: {
    name: string;
    phone: string;
    plan: string;
  };
}

const PhoneSupport: React.FC<PhoneSupportProps> = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requestType, setRequestType] = useState<'call' | 'voice-only' | 'setup'>('call');

  const handlePhoneRequest = (type: string) => {
    const message = {
      'call': `Hi! This is ${userInfo?.name || 'a user'} requesting a call for today's activities. My number is ${userInfo?.phone || 'not provided'}. Please call me when you're ready!`,
      'voice-only': `Hello! I'd like to participate in voice-only mode. My name is ${userInfo?.name || 'not provided'} and my number is ${userInfo?.phone || 'not provided'}. I don't have a camera but would love to join conversations!`,
      'setup': `Hi! I need help setting up my account for phone-only access. My name is ${userInfo?.name || 'not provided'}. Please call me to help me get started with DayMaker activities.`
    };

    const subject = {
      'call': 'Activity Call Request',
      'voice-only': 'Voice-Only Participation Request',
      'setup': 'Phone Setup Help Needed'
    };

    const mailtoLink = `mailto:daymaker2day@gmail.com?subject=${encodeURIComponent(subject[type as keyof typeof subject])}&body=${encodeURIComponent(message[type as keyof typeof message])}`;
    
    window.location.href = mailtoLink;
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        📞 Phone Support
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Phone Support Options</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Direct Call Request */}
            <div className="border border-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>📞</span>
                <span className="text-white font-medium">Request Activity Call</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                We'll call you for today's activities and conversations
              </p>
              <button
                onClick={() => handlePhoneRequest('call')}
                className="w-full px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                Request Call Now
              </button>
            </div>

            {/* Voice-Only Participation */}
            <div className="border border-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🎤</span>
                <span className="text-white font-medium">Voice-Only Mode</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                Join conversations with voice only - no camera needed
              </p>
              <button
                onClick={() => handlePhoneRequest('voice-only')}
                className="w-full px-3 py-2 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700"
              >
                Join Voice-Only
              </button>
            </div>

            {/* Setup Help */}
            <div className="border border-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🏠</span>
                <span className="text-white font-medium">Family Setup Help</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                Get help setting up phone-only access with family assistance
              </p>
              <button
                onClick={() => handlePhoneRequest('setup')}
                className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                Get Setup Help
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400">📱</span>
              <span className="text-green-300 font-semibold text-sm">Direct Phone Line</span>
            </div>
            <p className="text-xs text-gray-300 mb-1">
              <strong>Call us directly:</strong>
            </p>
            <p className="text-green-300 font-bold text-lg">
              (555) DAYMAKER
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Mon-Fri 8AM-8PM, Sat-Sun 10AM-6PM
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneSupport;