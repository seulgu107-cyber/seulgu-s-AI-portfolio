import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface EyesProps {
  mousePosition: { x: number; y: number };
}

export const Eyes: React.FC<EyesProps> = ({ mousePosition }) => {
  const eyeContainerRef = useRef<HTMLDivElement>(null);
  const [eyePositions, setEyePositions] = useState({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 }
  });
  const [isBlinking, setIsBlinking] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [hoveredEye, setHoveredEye] = useState<'left' | 'right' | null>(null);

  const handleBlink = () => {
    if (isBlinking) return;
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 1000);
    }, 400);
  };

  useEffect(() => {
    if (!eyeContainerRef.current) return;

    const containerRect = eyeContainerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    // Calculate positions for left and right eyes
    const leftEyeCenterX = containerCenterX - 110;
    const rightEyeCenterX = containerCenterX + 110;
    const eyeCenterY = containerCenterY;

    // Calculate pupil positions for left eye
    const leftAngle = Math.atan2(
      mousePosition.y - eyeCenterY,
      mousePosition.x - leftEyeCenterX
    );
    const leftDistance = Math.min(
      Math.sqrt(
        Math.pow(mousePosition.x - leftEyeCenterX, 2) +
        Math.pow(mousePosition.y - eyeCenterY, 2)
      ) / 20,
      50 // Maximum distance pupils can move from center
    );
    const leftPupilX = Math.cos(leftAngle) * leftDistance;
    const leftPupilY = Math.sin(leftAngle) * leftDistance;

    // Calculate pupil positions for right eye
    const rightAngle = Math.atan2(
      mousePosition.y - eyeCenterY,
      mousePosition.x - rightEyeCenterX
    );
    const rightDistance = Math.min(
      Math.sqrt(
        Math.pow(mousePosition.x - rightEyeCenterX, 2) +
        Math.pow(mousePosition.y - eyeCenterY, 2)
      ) / 20,
      50 // Maximum distance pupils can move from center
    );
    const rightPupilX = Math.cos(rightAngle) * rightDistance;
    const rightPupilY = Math.sin(rightAngle) * rightDistance;

    setEyePositions({
      left: { x: leftPupilX, y: leftPupilY },
      right: { x: rightPupilX, y: rightPupilY }
    });
  }, [mousePosition]);

  return (
    <div 
      ref={eyeContainerRef}
      className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex items-center gap-16 relative"
      >
        {/* Left Eye */}
        <motion.div 
          className="relative cursor-pointer" 
          style={{ transform: 'rotate(16deg)' }}
          onClick={handleBlink}
          onMouseEnter={() => setHoveredEye('left')}
          onMouseLeave={() => setHoveredEye(null)}
        >
          {/* Tooltip */}
          {hoveredEye === 'left' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg whitespace-nowrap"
              style={{ transform: 'rotate(-16deg) translateX(-50%)' }}
            >
              <span style={{ fontWeight: 600 }}>Click me!</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </motion.div>
          )}
          {/* Heart animation for left eye */}
          {showHearts && (
            <motion.div
              className="absolute -top-24 left-1/2 -translate-x-1/2 text-5xl"
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: -40, scale: 1.2 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ color: '#0CF500' }}
            >
              ♥
            </motion.div>
          )}
          {/* Eye white/background - half circle shape */}
          <motion.div 
            className="w-44 bg-white border-[24px] border-black relative overflow-hidden"
            style={{ 
              borderRadius: '0 0 9999px 9999px',
            }}
            animate={{
              height: isBlinking ? '24px' : '112px',
              borderRadius: isBlinking ? '60px' : '0 0 9999px 9999px',
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Pupil */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-20 h-20 bg-black rounded-full"
              style={{
                x: eyePositions.left.x,
                y: eyePositions.left.y,
                marginLeft: -40,
              }}
              animate={{
                opacity: isBlinking ? 0 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              {/* Highlight/reflection on pupil */}
              <motion.div 
                className="absolute top-4 left-4 w-5 h-5 rounded-full"
                style={{ backgroundColor: '#0CF500' }}
                animate={{
                  boxShadow: [
                    '0 0 8px #0CF500, 0 0 16px #0CF500',
                    '0 0 16px #0CF500, 0 0 32px #0CF500, 0 0 48px #0CF500',
                    '0 0 8px #0CF500, 0 0 16px #0CF500',
                  ],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ㅅ character in the middle */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-4 text-8xl font-black text-black"
          style={{ 
            WebkitTextStroke: '4px black',
            fontWeight: 900
          }}
          animate={{
            scale: showHearts ? [1, 1.3, 1] : 1,
            y: showHearts ? [0, -10, 0] : 0,
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut"
          }}
        >
          ㅅ
        </motion.div>

        {/* Right Eye */}
        <motion.div 
          className="relative cursor-pointer" 
          style={{ transform: 'rotate(-16deg)' }}
          onClick={handleBlink}
          onMouseEnter={() => setHoveredEye('right')}
          onMouseLeave={() => setHoveredEye(null)}
        >
          {/* Tooltip */}
          {hoveredEye === 'right' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg whitespace-nowrap"
              style={{ transform: 'rotate(16deg) translateX(-50%)' }}
            >
              <span style={{ fontWeight: 600 }}>Click me!</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </motion.div>
          )}
          {/* Heart animation for right eye */}
          {showHearts && (
            <motion.div
              className="absolute -top-24 left-1/2 -translate-x-1/2 text-5xl"
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: -40, scale: 1.2 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ color: '#0CF500' }}
            >
              ♥
            </motion.div>
          )}
          {/* Eye white/background - half circle shape */}
          <motion.div 
            className="w-44 bg-white border-[24px] border-black relative overflow-hidden"
            style={{ 
              borderRadius: '0 0 9999px 9999px',
            }}
            animate={{
              height: isBlinking ? '24px' : '112px',
              borderRadius: isBlinking ? '60px' : '0 0 9999px 9999px',
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Pupil */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-20 h-20 bg-black rounded-full"
              style={{
                x: eyePositions.right.x,
                y: eyePositions.right.y,
                marginLeft: -40,
              }}
              animate={{
                opacity: isBlinking ? 0 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              {/* Highlight/reflection on pupil */}
              <motion.div 
                className="absolute top-4 left-4 w-5 h-5 rounded-full"
                style={{ backgroundColor: '#0CF500' }}
                animate={{
                  boxShadow: [
                    '0 0 8px #0CF500, 0 0 16px #0CF500',
                    '0 0 16px #0CF500, 0 0 32px #0CF500, 0 0 48px #0CF500',
                    '0 0 8px #0CF500, 0 0 16px #0CF500',
                  ],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};