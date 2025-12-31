import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onUploadClick: () => void;
  onHomeClick: () => void;
}

const filters = ['All', 'Midjourney', 'Nanobanana'];

// Custom Home Icon Component with Door
function HomeIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors duration-300"
    >
      {/* House outline */}
      <path 
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
        stroke="currentColor"
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="currentColor"
      />
      {/* Roof line */}
      <path 
        d="M9 22V12H15V22" 
        stroke="currentColor"
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="currentColor"
      />
    </svg>
  );
}

export function FilterBar({ activeFilter, onFilterChange, onUploadClick, onHomeClick }: FilterBarProps) {
  const isHomeActive = activeFilter === 'Home';
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <div className="relative flex items-center overflow-x-auto no-scrollbar py-6">
          <div className="flex gap-8 md:gap-12 items-center">
            {/* Home Icon */}
            <button
              onClick={onHomeClick}
              className="transition-colors duration-300 text-black hover:text-[#0CF500]"
              aria-label="Home"
            >
              <HomeIcon isActive={isHomeActive} />
            </button>
            
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`
                  whitespace-nowrap transition-all duration-300 flex items-center gap-2
                  ${activeFilter === filter 
                    ? 'text-black opacity-100' 
                    : 'text-black opacity-100 hover:text-[#0CF500]'
                  }
                `}
              >
                {filter}
                {activeFilter === filter && (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </button>
            ))}
          </div>
          
          <button
            onClick={onUploadClick}
            disabled={activeFilter === 'All' || activeFilter === 'Home'}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2
              md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg whitespace-nowrap
              transition-opacity duration-300 bg-white hidden
              ${activeFilter === 'All' || activeFilter === 'Home'
                ? 'opacity-0 pointer-events-none' 
                : 'opacity-60 hover:opacity-100'
              }
            `}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-sm">Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}