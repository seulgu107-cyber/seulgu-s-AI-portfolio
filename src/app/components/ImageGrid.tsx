import React, { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'motion/react';
import { Trash2, ArrowUpRight, ImagePlus } from 'lucide-react';

export interface Artwork {
  id: number;
  imageUrl: string;
  tool: string;
  series: string;
  year: number;
  month: number;
  prompt: string;
}

interface ImageGridProps {
  artworks: Artwork[];
  onImageClick: (artwork: Artwork) => void;
  onDelete?: (artworkId: number) => void;
  isCustom?: (artworkId: number) => boolean;
}

export function ImageGrid({ artworks, onImageClick, onDelete, isCustom }: ImageGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleDelete = (e: React.MouseEvent, artworkId: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      onDelete?.(artworkId);
    }
  };

  // Empty state when no artworks
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <ImagePlus className="w-16 h-16 mb-6 opacity-20" strokeWidth={1.5} />
          <p className="text-xl mb-2 opacity-40">No images yet</p>
          <div className="flex items-center gap-2 opacity-30">
            <p>Click the upload button</p>
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-16 md:px-32 lg:px-48 pt-24 pb-16">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 375: 1, 768: 2, 1024: 3, 1440: 4 }}
      >
        <Masonry gutter="1.5rem">
          {artworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              className="relative cursor-pointer group"
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onImageClick(artwork)}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={artwork.imageUrl}
                alt={`${artwork.tool} artwork`}
                className="w-full h-auto block"
                loading="lazy"
              />
              {hoveredId === artwork.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center p-6"
                >
                  <div className="text-white text-center">
                    <p className="opacity-60 mb-1">{artwork.tool}</p>
                    <p>{artwork.series}</p>
                  </div>
                  
                  {/* Delete button for custom artworks */}
                  {isCustom?.(artwork.id) && onDelete && (
                    <button
                      onClick={(e) => handleDelete(e, artwork.id)}
                      className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title="Delete artwork"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}