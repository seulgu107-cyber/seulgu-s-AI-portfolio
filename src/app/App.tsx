import React, { useState, useMemo, useEffect } from 'react';
import { FilterBar } from './components/FilterBar';
import { ImageGrid, Artwork } from './components/ImageGrid';
import { ImageModal } from './components/ImageModal';
import { UploadModal } from './components/UploadModal';
import { Eyes } from './components/Eyes';
import { CustomCursor } from './components/CustomCursor';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export default function App() {
  const [activeFilter, setActiveFilter] = useState('Home');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [customArtworks, setCustomArtworks] = useState<Artwork[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load custom artworks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customArtworks');
    if (saved) {
      try {
        setCustomArtworks(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load custom artworks:', error);
      }
    }
  }, []);

  // Save custom artworks to localStorage whenever they change
  useEffect(() => {
    if (customArtworks.length > 0) {
      localStorage.setItem('customArtworks', JSON.stringify(customArtworks));
    } else {
      localStorage.removeItem('customArtworks');
    }
  }, [customArtworks]);

  // Filter artworks based on active filter
  const filteredArtworks = useMemo(() => {
    if (activeFilter === 'All') return customArtworks;
    return customArtworks.filter(artwork => artwork.tool === activeFilter);
  }, [activeFilter, customArtworks]);

  const handleUpload = (newArtwork: Omit<Artwork, 'id'>) => {
    const artwork: Artwork = {
      ...newArtwork,
      id: Date.now() // Use timestamp as unique ID
    };
    setCustomArtworks(prev => [artwork, ...prev]);
  };

  const handleDelete = (artworkId: number) => {
    setCustomArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
    // Close modal if the deleted artwork was selected
    if (selectedArtwork?.id === artworkId) {
      setSelectedArtwork(null);
    }
  };

  const handleEdit = (artworkId: number, updatedArtwork: Omit<Artwork, 'id'>) => {
    setCustomArtworks(prev =>
      prev.map(artwork =>
        artwork.id === artworkId
          ? { ...updatedArtwork, id: artworkId }
          : artwork
      )
    );
    // Update selected artwork if it's the one being edited
    if (selectedArtwork?.id === artworkId) {
      setSelectedArtwork({ ...updatedArtwork, id: artworkId });
    }
  };

  const isCustomArtwork = (artworkId: number) => {
    return customArtworks.some(artwork => artwork.id === artworkId);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedArtwork) return;
    
    const currentIndex = filteredArtworks.findIndex(a => a.id === selectedArtwork.id);
    let newIndex: number;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredArtworks.length - 1;
    } else {
      newIndex = currentIndex < filteredArtworks.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedArtwork(filteredArtworks[newIndex]);
  };

  return (
    <div className="min-h-screen bg-white">
      <FilterBar 
        activeFilter={activeFilter} 
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          setShowWelcome(false);
        }}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onHomeClick={() => {
          setActiveFilter('Home');
          setShowWelcome(true);
        }}
      />
      
      {/* Show welcome screen when Home is active */}
      {activeFilter === 'Home' ? (
        <div className="flex items-center justify-between min-h-screen px-16 md:px-32 lg:px-48 relative overflow-hidden">
          {/* Random mouse and cheese emojis */}
          {[...Array(4)].map((_, i) => {
            const emojis = ['🐭', '🧀'];
            const emoji = emojis[i % 2];
            const randomLeft = Math.random() * 80 + 10; // 10-90%
            const randomTop = Math.random() * 80 + 10; // 10-90%
            const randomDelay = Math.random() * 8; // 0-8s
            const randomDuration = Math.random() * 3 + 4; // 4-7s
            
            return (
              <motion.div
                key={i}
                className="absolute text-5xl pointer-events-none z-0"
                style={{
                  left: `${randomLeft}%`,
                  top: `${randomTop}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: randomDuration,
                  delay: randomDelay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 4 + 4,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
          
          {/* Text Content */}
          <div className="flex flex-col items-start z-10 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontWeight: 900 }}
              className="text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] mb-6 md:mb-12 tracking-tighter leading-[0.9]"
            >
              Hello
              <br />
              I'm Aji
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontWeight: 900 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl opacity-50 tracking-tight leading-[0.95]"
            >
              Creation through AI.
            </motion.p>
          </div>

          {/* AI Motion Graphics - Right Side */}
          <Eyes mousePosition={mousePosition} />
        </div>
      ) : (
        <ImageGrid 
          artworks={filteredArtworks} 
          onImageClick={setSelectedArtwork}
          onDelete={handleDelete}
          isCustom={isCustomArtwork}
        />
      )}
      
      <ImageModal
        artwork={selectedArtwork}
        allArtworks={filteredArtworks}
        onClose={() => setSelectedArtwork(null)}
        onNavigate={handleNavigate}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isCustom={isCustomArtwork}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        tool={activeFilter}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
      <CustomCursor mousePosition={mousePosition} />
      
      {/* Mobile Floating Upload Button */}
      {activeFilter !== 'Home' && activeFilter !== 'All' && (
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="md:hidden fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#0CF500] text-black shadow-lg flex items-center justify-center transition-transform active:scale-95"
          aria-label="Upload"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}