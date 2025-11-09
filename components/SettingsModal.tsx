import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [botMessage, setBotMessage] = useState('');
  const [botTarget, setBotTarget] = useState('seniors');
  const [botTone, setBotTone] = useState('friendly');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'settings') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const generateBotMessage = () => {
    const templates = {
      seniors: {
        friendly: [
          "🌟 Ready to brighten someone's day? Join thousands of wonderful people making meaningful connections on DayMaker2Day! Share laughs, stories, and create beautiful memories together. Your next friendship is just a click away! 💕",
          "✨ Life gets better when we share it! DayMaker2Day brings people together for fun activities, heartwarming conversations, and genuine connections. Join our caring community today! 🤗",
          "💖 Every day is a gift - make it count! DayMaker2Day helps you connect with amazing people through fun activities and meaningful conversations. Come be part of our family! 🏡"
        ],
        professional: [
          "DayMaker2Day: The premier platform for meaningful social connections through structured activities and video calls. Join a community focused on combating isolation and building lasting relationships.",
          "Experience the future of social connectivity with DayMaker2Day. Our platform offers curated activities designed to foster authentic relationships and reduce social isolation among adults.",
          "Transform your daily routine with DayMaker2Day - where technology meets human connection through purposeful activities and face-to-face interactions."
        ],
        enthusiastic: [
          "🚀 AMAZING connections await you on DayMaker2Day! Join the FUN revolution where every activity sparkles with laughter and friendship! Don't miss out - your BEST conversations start HERE! ⭐🎉",
          "🎊 WOW! DayMaker2Day is THE place where friendships BLOOM! Jump into exciting activities, share incredible moments, and meet your new favorite people! The magic happens NOW! ✨💫",
          "🌈 INCREDIBLE adventures in friendship start at DayMaker2Day! Connect, laugh, create memories, and discover how AMAZING life becomes when shared! Join the excitement TODAY! 🎯🎈"
        ]
      },
      everyone: {
        friendly: [
          "🌟 Make every day brighter! DayMaker2Day connects people of all ages through fun activities and genuine conversations. Whether you're 18 or 80, your perfect connection awaits! 💕",
          "✨ Connection knows no age! Join DayMaker2Day and discover how meaningful relationships bloom through shared activities and heartfelt conversations. All ages welcome! 🤗",
          "💖 From young adults to wise elders - everyone belongs at DayMaker2Day! Share experiences, learn from each other, and create beautiful friendships that span generations! 🌍"
        ],
        professional: [
          "DayMaker2Day: An inclusive platform fostering intergenerational connections through purposeful activities. Designed for individuals seeking authentic relationships across all life stages.",
          "Experience meaningful social connectivity with DayMaker2Day. Our platform bridges generational gaps through structured activities and video-based interactions for users of all ages.",
          "Join a diverse community of connection-seekers on DayMaker2Day. Our age-inclusive platform facilitates genuine relationships through shared interests and activities."
        ],
        enthusiastic: [
          "🚀 EPIC connections for EVERY age! DayMaker2Day brings together the young, the wise, and everyone in between! Experience the POWER of cross-generational friendship! Join NOW! ⭐🎉",
          "🎊 AMAZING people of ALL ages are waiting to meet YOU! DayMaker2Day breaks down barriers and builds bridges through FUN activities! Don't wait - dive into the adventure! ✨💫",
          "🌈 INCREDIBLE diversity, UNLIMITED possibilities! DayMaker2Day celebrates connections across ALL generations! From teens to grandparents - everyone's story matters here! 🎯🎈"
        ]
      },
      families: {
        friendly: [
          "👨‍👩‍👧‍👦 Bring families together with DayMaker2Day! Create precious memories through activities designed to connect parents, kids, and grandparents. Every moment becomes special! 💝",
          "🏠 Family time just got better! DayMaker2Day offers activities perfect for bonding across generations. From virtual game nights to storytelling sessions - strengthen your family bonds! 🌟",
          "💕 Distance can't break family love! DayMaker2Day helps families stay connected through fun activities and meaningful conversations. Make every call count! 👪"
        ],
        professional: [
          "DayMaker2Day: Strengthening family bonds through structured virtual activities. Our platform facilitates meaningful interactions between family members across distances and generations.",
          "Enhance family connectivity with DayMaker2Day's purposeful activity framework. Designed to foster communication and shared experiences among family members of all ages.",
          "Reconnect with family through DayMaker2Day's comprehensive activity platform. Bridge generational gaps and maintain strong family relationships regardless of physical distance."
        ],
        enthusiastic: [
          "🎉 FAMILY FUN like never before! DayMaker2Day turns every call into a CELEBRATION of family love! Games, stories, laughter - create UNFORGETTABLE memories together! 👨‍👩‍👧‍👦✨",
          "🌟 INCREDIBLE family adventures await! DayMaker2Day brings the MAGIC of togetherness to every screen! Grandparents, parents, kids - ALL having a BLAST! Join the family party! 🎊💖",
          "💫 AMAZING family connections start HERE! DayMaker2Day transforms ordinary calls into EXTRAORDINARY family experiences! The FUN never stops! 🚀👪🎈"
        ]
      }
    };

    const messages = templates[botTarget as keyof typeof templates]?.[botTone as keyof typeof templates.seniors];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setBotMessage(randomMessage);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(botMessage);
    alert('Message copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-300">⚙️ Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {!isAuthenticated ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Settings Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter password..."
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Access Settings
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-4">🤖 Bot Advertiser</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={botTarget}
                      onChange={(e) => setBotTarget(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="seniors">Seniors Focus</option>
                      <option value="everyone">All Ages</option>
                      <option value="families">Families</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message Tone
                    </label>
                    <select
                      value={botTone}
                      onChange={(e) => setBotTone(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="friendly">Friendly & Warm</option>
                      <option value="professional">Professional</option>
                      <option value="enthusiastic">Enthusiastic & Energetic</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateBotMessage}
                  className="w-full mb-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg"
                >
                  🎯 Generate Advertisement Message
                </button>

                {botMessage && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Generated Message:
                    </label>
                    <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                      <p className="text-gray-100 leading-relaxed">{botMessage}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        📋 Copy Message
                      </button>
                      <button
                        onClick={generateBotMessage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        🔄 Generate New
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">📱 Social Media</h4>
                  <p className="text-sm text-gray-300">Perfect for Facebook, Instagram, Twitter posts</p>
                </div>
                <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">📧 Email Campaigns</h4>
                  <p className="text-sm text-gray-300">Ready for newsletters and email marketing</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4">
                  <h4 className="text-orange-300 font-semibold mb-2">💬 Forum Posts</h4>
                  <p className="text-sm text-gray-300">Great for community discussions and forums</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setBotMessage('');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  🔒 Lock Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;