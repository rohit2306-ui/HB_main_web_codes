import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
// replace icons with your own if needed
import { FaDollarSign } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { CiWarning } from 'react-icons/ci';

const DEFAULT_ITEMS = [
  {
    title: 'Code Fussion 2024',
    description: 'Innovate and Win prizes.Join Now to know more about that.',
    id: 1,
    imgUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tagTextColor: "green",
    tagText: "Highest prize",
    icon: <FaDollarSign className="h-[16px] w-[16px] text-white" />
  },
  {
    title: 'SIH 2024',
    description: 'Join Now to know more about that.',
    id: 2,
    imgUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tagText: "Going to END!!",
    tagTextColor: "red",
    icon: <CiWarning className="h-[16px] w-[16px] text-white" />
  },
  {
    title: 'Agra Hacks',
    description: 'Interesting hackathon with prizes in Agra.',
    id: 3,
    imgUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tagText: "In Agra",
    icon: <FaMapLocationDot className="h-[16px] w-[16px] text-white" />
  }
  
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const containerRef = useRef(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, items.length, carouselItems.length, pauseOnHover]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(prev => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0
        }
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 h-[30rem] bg-white dark:bg-gray-800 ${
        round ? 'rounded-full border border-[#222] dark:border-white' : 'rounded-[24px] border border-[#222] dark:border-gray-700'
      }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` })
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
          const outputRange = [90, 0, -90];
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const rotateY = useTransform(x, range, outputRange, { clamp: false });
          return (
            <motion.div
              key={index}
              className={`relative shrink-0 flex flex-col h-[26rem] ${
                round
                  ? 'items-center justify-center text-center bg-[#060010] dark:bg-gray-900 border-0'
                  : 'items-start justify-between bg-gray-200 dark:bg-gray-700 border border-[#222] dark:border-gray-600 rounded-[12px]'
              } overflow-hidden `}
              style={{
                width: itemWidth,
                rotateY: rotateY,
                backgroundImage: `url(${item.imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...(round && { borderRadius: '50%' })
              }}
              transition={effectiveTransition}
            >
              <div className={`${round ? 'p-0 m-0' : 'mb-4 p-5'}`}>
                <span className={`absolute z-20 flex h-[28px] w-auto p-2 items-center justify-center rounded-full ${item.tagTextColor === "green" ? "bg-green-400" : (item.tagTextColor === "red" ? "bg-red-400" : "bg-yellow-400")} `}>
                  <span className='mr-2'>{item.icon}</span>
                  <p className={`inline text-white text-base `}>{item.tagText}</p>
                </span>
              </div>
              <div className="p-5 absolute flex flex-col items-start justify-end inset-0 bg-transparent backdrop-blur-md dark:backdrop-blur-sm dark:bg-black/50">
                <div className="mb-1 font-black text-lg text-white dark:text-gray-100">{item.title}</div>
                <p className="text-sm text-white dark:text-gray-300">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <div className={`flex w-full justify-center ${round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : ''}`}>
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index
                  ? round
                    ? 'bg-white dark:bg-gray-100'
                    : 'bg-[#333333] dark:bg-gray-100'
                  : round
                    ? 'bg-[#555] dark:bg-gray-600'
                    : 'bg-[rgba(51,51,51,0.4)] dark:bg-gray-500'
              }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}