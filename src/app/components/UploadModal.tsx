import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  tool: string;
  onClose: () => void;
  onUpload: (artwork: {
    imageUrl: string;
    tool: string;
    series: string;
    year: number;
    month: number;
    prompt: string;
  }) => void;
}

export function UploadModal({ isOpen, tool, onClose, onUpload }: UploadModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [series, setSeries] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !series || !prompt) return;

    onUpload({
      imageUrl: imagePreview,
      tool,
      series,
      year,
      month,
      prompt
    });

    // Reset form
    setImagePreview(null);
    setSeries('');
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
    setPrompt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Dimmed Background */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 bg-white border border-gray-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto p-8 upload-modal-scroll">
              {/* Title */}
              <h2 className="mb-8">Upload to {tool}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block opacity-40 mb-3">Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain mx-auto"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Upload className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="opacity-40">Click to upload image</p>
                        <p className="opacity-20 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Series */}
                <div>
                  <label className="block opacity-40 mb-3">Series</label>
                  <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    placeholder="e.g., Digital Dreams"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                    required
                  />
                </div>

                {/* Year and Month */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block opacity-40 mb-3">Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      min="2020"
                      max="2030"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block opacity-40 mb-3">Month</label>
                    <input
                      type="number"
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      min="1"
                      max="12"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <label className="block opacity-40 mb-3">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the prompt used to generate this artwork..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!imagePreview || !series || !prompt}
                  className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Upload Artwork
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}