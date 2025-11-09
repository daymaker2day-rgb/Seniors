import React, { useState, useRef } from 'react';

interface SpecialServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: { name: string; phone: string; email?: string };
}

const categories = [
  { id: 'handyman', name: 'Handyman', icon: '🔧' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
  { id: 'personal-care', name: 'Personal Care', icon: '💇' },
  { id: 'yard-work', name: 'Yard Work', icon: '🌱' },
  { id: 'other', name: 'Other', icon: '❓' }
];

const SpecialServiceModal: React.FC<SpecialServiceModalProps> = ({ isOpen, onClose, userInfo }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (photos.length + files.length > 3) {
      alert('Maximum 3 photos allowed');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !description) {
      alert('Please select a category and describe your request.');
      return;
    }
    // Save request locally (demo)
    const request = {
      category: selectedCategory,
      description,
      photos: photos.map(photo => ({ name: photo.name, size: photo.size, type: photo.type })),
      userInfo,
      timestamp: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('special_requests') || '[]');
    existing.push(request);
    localStorage.setItem('special_requests', JSON.stringify(existing));
    alert('Request submitted! We will contact you soon with a price.');
    setSelectedCategory('');
    setDescription('');
    setPhotos([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Special On-Site Service</h2>
          <button onClick={onClose} className="text-white text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Category *</label>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full w-12 h-12 flex items-center justify-center text-2xl border-2 ${selectedCategory === cat.id ? 'border-cyan-400 bg-cyan-900/30' : 'border-white/20 bg-white/5'}`}
                  title={cat.name}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Description *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you need help with..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-20"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Add Photos (max 3)</label>
            <div className="flex gap-2 mb-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-blue-600 text-white rounded-lg">Upload</button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
            </div>
            <div className="flex gap-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative">
                  <img src={URL.createObjectURL(photo)} alt="preview" className="w-16 h-16 object-cover rounded-lg border" />
                  <button type="button" onClick={() => removePhoto(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default SpecialServiceModal;
