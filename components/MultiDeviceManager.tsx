import React, { useState, useEffect } from 'react';

interface DeviceConnection {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet' | 'desktop';
  connected: boolean;
  position?: string;
}

interface MultiDeviceManagerProps {
  onDeviceConnect: (device: DeviceConnection, position: string) => void;
  onDeviceDisconnect: (deviceId: string) => void;
  connectedDevices: DeviceConnection[];
}

const MultiDeviceManager: React.FC<MultiDeviceManagerProps> = ({
  onDeviceConnect,
  onDeviceDisconnect,
  connectedDevices
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [simulatedDevices, setSimulatedDevices] = useState<DeviceConnection[]>([
    { id: 'phone-1', name: 'iPhone 14', type: 'phone', connected: false },
    { id: 'laptop-1', name: 'MacBook Pro', type: 'laptop', connected: false },
    { id: 'tablet-1', name: 'iPad Air', type: 'tablet', connected: false },
    { id: 'desktop-1', name: 'Desktop PC', type: 'desktop', connected: false },
  ]);

  const positions = ['center', 'top-left', 'top-right'];
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'phone': return '📱';
      case 'laptop': return '💻';
      case 'tablet': return '📱';
      case 'desktop': return '🖥️';
      default: return '📹';
    }
  };

  const handleConnect = (device: DeviceConnection, position: string) => {
    setSimulatedDevices(prev => 
      prev.map(d => 
        d.id === device.id 
          ? { ...d, connected: true, position }
          : d
      )
    );
    onDeviceConnect({ ...device, connected: true, position }, position);
  };

  const handleDisconnect = (deviceId: string) => {
    setSimulatedDevices(prev => 
      prev.map(d => 
        d.id === deviceId 
          ? { ...d, connected: false, position: undefined }
          : d
      )
    );
    onDeviceDisconnect(deviceId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        📱 Multi-Device Test
        <span className="bg-blue-800 px-2 py-1 rounded-full text-xs">
          {connectedDevices.length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Device Connections</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {simulatedDevices.map(device => (
              <div key={device.id} className="border border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{getDeviceIcon(device.type)}</span>
                    <span className="text-white text-sm">{device.name}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${device.connected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                </div>

                {!device.connected ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">Select position to connect:</p>
                    <div className="grid grid-cols-3 gap-1">
                      {positions.map(position => (
                        <button
                          key={position}
                          onClick={() => handleConnect(device, position)}
                          disabled={connectedDevices.some(d => d.position === position)}
                          className={`px-2 py-1 text-xs rounded ${
                            connectedDevices.some(d => d.position === position)
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {position === 'center' ? 'Center' : 
                           position === 'top-left' ? 'Top-L' : 'Top-R'}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-400">
                      Connected to {device.position}
                    </span>
                    <button
                      onClick={() => handleDisconnect(device.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <p className="text-xs text-gray-300">
              💡 <strong>Real Testing:</strong> Open this URL on different devices to test actual multi-person F2F functionality
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiDeviceManager;