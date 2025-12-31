import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react';
import { Artwork } from './ImageGrid';

interface ImageModalProps {
  artwork: Artwork | null;
  allArtworks: Artwork[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onDelete?: (artworkId: number) => void;
  onEdit?: (artworkId: number, updatedArtwork: Omit<Artwork, 'id'>) => void;
  isCustom?: (artworkId: number) => boolean;
}

export function ImageModal({ artwork, allArtworks, onClose, onNavigate, onDelete, onEdit, isCustom }: ImageModalProps) {
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    series: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    prompt: '',
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!artwork) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artwork, onClose, onNavigate]);

  useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [artwork]);

  if (!artwork) return null;

  const currentIndex = allArtworks.findIndex(a => a.id === artwork.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allArtworks.length - 1;

  const truncatedPrompt = artwork.prompt.length > 100 
    ? artwork.prompt.substring(0, 100) + '...' 
    : artwork.prompt;

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Blurred Background */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" />

          {/* Desktop Layout */}
          {!isMobile && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 max-w-7xl w-full mx-8 flex gap-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image */}
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.series}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              {/* Right: Info */}
              <div className="w-80 flex flex-col justify-center gap-8">
                {!isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <p className="opacity-40 mb-1">Tool</p>
                      <p>{artwork.tool}</p>
                    </div>
                    <div>
                      <p className="opacity-40 mb-1">Series</p>
                      <p>{artwork.series}</p>
                    </div>
                    <div>
                      <p className="opacity-40 mb-1">Date</p>
                      <p>{artwork.year}. {String(artwork.month).padStart(2, '0')}</p>
                    </div>
                    <div>
                      <p className="opacity-40 mb-2">Prompt</p>
                      <p className="opacity-70">
                        {showFullPrompt ? artwork.prompt : truncatedPrompt}
                      </p>
                      {artwork.prompt.length > 100 && (
                        <button
                          onClick={() => setShowFullPrompt(!showFullPrompt)}
                          className="mt-2 opacity-40 hover:opacity-100 transition-opacity"
                        >
                          {showFullPrompt ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="opacity-40 mb-1">Tool</p>
                      <p>{artwork.tool}</p>
                    </div>
                    <div>
                      <label className="block opacity-40 mb-2">Series</label>
                      <input
                        type="text"
                        value={editForm.series}
                        onChange={(e) => setEditForm({ ...editForm, series: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block opacity-40 mb-2">Year</label>
                        <input
                          type="number"
                          value={editForm.year}
                          onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) || new Date().getFullYear() })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block opacity-40 mb-2">Month</label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={editForm.month}
                          onChange={(e) => setEditForm({ ...editForm, month: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block opacity-40 mb-2">Prompt</label>
                      <textarea
                        value={editForm.prompt}
                        onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black resize-none"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEdit) {
                            onEdit(artwork.id, {
                              imageUrl: artwork.imageUrl,
                              tool: artwork.tool,
                              series: editForm.series,
                              year: editForm.year,
                              month: editForm.month,
                              prompt: editForm.prompt,
                            });
                            setIsEditing(false);
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-0 right-0 p-4 opacity-40 hover:opacity-100 transition-opacity"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation Arrows */}
              {hasPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('prev');
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-4 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
              {hasNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('next');
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-4 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}

              {/* Edit and Delete Buttons */}
              {onDelete && isCustom && isCustom(artwork.id) && (
                <div className="absolute bottom-0 right-0 flex gap-6 p-4">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setEditForm({
                        series: artwork.series,
                        year: artwork.year,
                        month: artwork.month,
                        prompt: artwork.prompt,
                      });
                    }}
                    className="opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-6 h-6" />
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this artwork?')) {
                        onDelete(artwork.id);
                      }
                    }}
                    className="opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Mobile Layout - Full Screen */}
          {isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white overflow-y-auto z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Fixed Header with Close Button */}
                <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
                  <div className="flex justify-end items-center h-16 px-6">
                    <button
                      onClick={onClose}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Image Section - Light Gray Background */}
                <div className="w-full min-h-[50vh] flex items-center justify-center bg-gray-100 p-4 pt-20">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.series}
                    className="w-full h-auto object-contain max-h-[60vh]"
                  />
                </div>

                {/* Info Section */}
                <div className="p-6 pb-24">
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <p className="opacity-40 mb-1">Tool</p>
                        <p>{artwork.tool}</p>
                      </div>
                      <div>
                        <p className="opacity-40 mb-1">Series</p>
                        <p>{artwork.series}</p>
                      </div>
                      <div>
                        <p className="opacity-40 mb-1">Date</p>
                        <p>{artwork.year}. {String(artwork.month).padStart(2, '0')}</p>
                      </div>
                      <div>
                        <p className="opacity-40 mb-2">Prompt</p>
                        <p className="opacity-70">
                          {showFullPrompt ? artwork.prompt : truncatedPrompt}
                        </p>
                        {artwork.prompt.length > 100 && (
                          <button
                            onClick={() => setShowFullPrompt(!showFullPrompt)}
                            className="mt-2 opacity-40 hover:opacity-100 transition-opacity"
                          >
                            {showFullPrompt ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <p className="opacity-40 mb-1">Tool</p>
                        <p>{artwork.tool}</p>
                      </div>
                      <div>
                        <label className="block opacity-40 mb-2">Series</label>
                        <input
                          type="text"
                          value={editForm.series}
                          onChange={(e) => setEditForm({ ...editForm, series: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block opacity-40 mb-2">Year</label>
                          <input
                            type="number"
                            value={editForm.year}
                            onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) || new Date().getFullYear() })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block opacity-40 mb-2">Month</label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={editForm.month}
                            onChange={(e) => setEditForm({ ...editForm, month: parseInt(e.target.value) || 1 })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block opacity-40 mb-2">Prompt</label>
                        <textarea
                          value={editForm.prompt}
                          onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black resize-none"
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEdit) {
                              onEdit(artwork.id, {
                                imageUrl: artwork.imageUrl,
                                tool: artwork.tool,
                                series: editForm.series,
                                year: editForm.year,
                                month: editForm.month,
                                prompt: editForm.prompt,
                              });
                              setIsEditing(false);
                            }
                          }}
                          className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <div className="flex gap-4 mt-8">
                    {hasPrev && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('prev');
                        }}
                        className="flex-1 py-3 border border-gray-200 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                      >
                        Previous
                      </button>
                    )}
                    {hasNext && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('next');
                        }}
                        className="flex-1 py-3 border border-gray-200 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                      >
                        Next
                      </button>
                    )}
                  </div>

                  {/* Mobile Edit and Delete Buttons */}
                  {onDelete && isCustom && isCustom(artwork.id) && !isEditing && (
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setEditForm({
                            series: artwork.series,
                            year: artwork.year,
                            month: artwork.month,
                            prompt: artwork.prompt,
                          });
                        }}
                        className="flex-1 py-3 border border-gray-200 rounded-lg opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-5 h-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this artwork?')) {
                            onDelete(artwork.id);
                          }
                        }}
                        className="flex-1 py-3 border border-gray-200 rounded-lg opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}