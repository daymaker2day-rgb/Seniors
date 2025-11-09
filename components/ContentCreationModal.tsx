import React, { useState, useRef } from 'react';
import type { Activity } from '../types';

interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity;
}

const ContentCreationModal: React.FC<ContentCreationModalProps> = ({ isOpen, onClose, activity }) => {
  const [activeTab, setActiveTab] = useState<'card' | 'photo' | 'note'>('card');
  const [cardText, setCardText] = useState('');
  const [cardStyle, setCardStyle] = useState('birthday');
  const [selectedBackground, setSelectedBackground] = useState('gradient-blue');
  const [selectedTemplate, setSelectedTemplate] = useState('simple');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const cardTemplates = {
    birthday: {
      title: 'Happy Birthday!',
      message: 'Wishing you joy and happiness on your special day',
      colors: ['#FFD700', '#FF69B4', '#87CEEB']
    },
    thankyou: {
      title: 'Thank You!',
      message: 'Your kindness means so much',
      colors: ['#98FB98', '#F0E68C', '#DDA0DD']
    },
    thinking: {
      title: 'Thinking of You',
      message: 'You are in my thoughts and prayers',
      colors: ['#F5DEB3', '#E6E6FA', '#FFE4E1']
    },
    congrats: {
      title: 'Congratulations!',
      message: 'So proud of your achievement',
      colors: ['#FFD700', '#FF6347', '#32CD32']
    }
  };

  const backgrounds = {
    'gradient-blue': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'gradient-pink': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'gradient-green': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'solid-purple': '#8B5CF6',
    'solid-teal': '#14B8A6',
    'floral': 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)'
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, cardTemplates[cardStyle as keyof typeof cardTemplates].colors[0]);
    gradient.addColorStop(1, cardTemplates[cardStyle as keyof typeof cardTemplates].colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    // Add title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(cardTemplates[cardStyle as keyof typeof cardTemplates].title, 200, 100);

    // Add message
    ctx.font = '18px Arial';
    const message = cardText || cardTemplates[cardStyle as keyof typeof cardTemplates].message;
    const words = message.split(' ');
    let line = '';
    let y = 150;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > 350 && n > 0) {
        ctx.fillText(line, 200, y);
        line = words[n] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 200, y);

    // Download
    const link = document.createElement('a');
    link.download = `daymaker-${cardStyle}-card.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
                {activity.emoji} {activity.title}
              </h2>
              <p className="text-gray-300 mt-1">Create beautiful digital content together</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            {[
              { id: 'card', label: '💌 Virtual Card', icon: '💌' },
              { id: 'photo', label: '🖼️ Photo Frame', icon: '🖼️' },
              { id: 'note', label: '📝 Digital Note', icon: '📝' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Virtual Card Creator */}
          {activeTab === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Type
                  </label>
                  <select
                    value={cardStyle}
                    onChange={(e) => setCardStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="birthday">🎂 Birthday Card</option>
                    <option value="thankyou">🙏 Thank You Card</option>
                    <option value="thinking">💭 Thinking of You</option>
                    <option value="congrats">🎉 Congratulations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Message (Optional)
                  </label>
                  <textarea
                    value={cardText}
                    onChange={(e) => setCardText(e.target.value)}
                    placeholder="Add your personal message..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(backgrounds).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedBackground(key)}
                        className={`h-8 rounded border-2 ${
                          selectedBackground === key ? 'border-cyan-400' : 'border-gray-600'
                        }`}
                        style={{ background: value }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  📥 Download Your Card
                </button>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div 
                  className="aspect-[4/3] rounded-lg border border-white/20 flex flex-col justify-center items-center p-6 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${cardTemplates[cardStyle as keyof typeof cardTemplates].colors[0]}, ${cardTemplates[cardStyle as keyof typeof cardTemplates].colors[1]})` 
                  }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {cardTemplates[cardStyle as keyof typeof cardTemplates].title}
                  </h2>
                  <p className="text-white text-sm leading-relaxed">
                    {cardText || cardTemplates[cardStyle as keyof typeof cardTemplates].message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Photo Frame Tab */}
          {activeTab === 'photo' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold text-white mb-4">Photo Frame Creator</h3>
              <p className="text-gray-300 mb-6">Add beautiful frames to your favorite photos</p>
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm text-gray-300">
                  📸 Drag and drop a photo here, or click to browse
                </p>
                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Choose Photo
                </button>
              </div>
            </div>
          )}

          {/* Digital Note Tab */}
          {activeTab === 'note' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Note Style
                  </label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                    <option>📝 Simple Note</option>
                    <option>💌 Love Note</option>
                    <option>📋 Reminder</option>
                    <option>🎁 Gift Message</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                    <option>Extra Large</option>
                  </select>
                </div>
              </div>
              
              <textarea
                placeholder="Write your digital note here..."
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
              />
              
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">
                📝 Create Note
              </button>
            </div>
          )}

          {/* Simple Instructions */}
          <div className="mt-8 p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
            <h4 className="text-green-300 font-semibold mb-2">💡 How to Use Together</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Both create the same type of content at the same time</li>
              <li>• Share your screen to show your creation process</li>
              <li>• Download and email your creations to each other</li>
              <li>• Vote on whose is most creative or funny!</li>
            </ul>
          </div>

          {/* Hidden canvas for downloads */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};

export default ContentCreationModal;