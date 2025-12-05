import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import RG1 from "../../../src/assets/RollingGallery/RG1.webp";
import RG2 from "../../../src/assets/RollingGallery/RG2.webp";
import RG3 from "../../../src/assets/RollingGallery/RG3.webp";
import RG4 from "../../../src/assets/RollingGallery/RG4.webp";
import RG5 from "../../../src/assets/RollingGallery/RG5.webp";
import RG6 from "../../../src/assets/RollingGallery/RG6.webp";
import RG7 from "../../../src/assets/RollingGallery/RG7.webp";
import RG8 from "../../../src/assets/images_hack_agra_chapter_1/image8.jpg";
import RG9 from "../../../src/assets/images_hack_agra_chapter_1/image7.jpg";
import RG10 from "../../../src/assets/images_hack_agra_chapter_1/image2.jpg";

const IMGS = [ RG10, RG9,RG8 ,RG1,RG2, RG3, RG4, RG5, RG6, RG7];

const RollingGallery = ({ autoplay = true, images = [] }) => {
  const imagesToRender = images.length > 0 ? images : IMGS;
  const scrollRef = useRef(null);

  // Smooth Auto-scroll
  useEffect(() => {
    if (!autoplay) return;

    const container = scrollRef.current;
    let x = 0;

    const animate = () => {
      if (!container) return;

      x += 0.35; // slow & premium speed
      container.scrollLeft = x;

      if (x >= container.scrollWidth - container.clientWidth) {
        x = 0;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [autoplay]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Gentle fade left */}
      <div className="absolute left-0 top-0 h-full w-36 bg-gradient-to-r from-black to-transparent z-20" />

      {/* Gentle fade right */}
      <div className="absolute right-0 top-0 h-full w-36 bg-gradient-to-l from-black to-transparent z-20" />

      {/* Smooth container */}
      <div
        ref={scrollRef}
        className="flex gap-10 px-14 overflow-x-auto scrollbar-hide items-center"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {imagesToRender.map((url, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.06,
              y: -6,
              transition: { type: "spring", stiffness: 180, damping: 18 },
            }}
            className="
              w-[320px] h-[420px] 
              rounded-3xl overflow-hidden
              bg-[#0A0A0F] border border-white/10 
              shadow-[0_12px_35px_rgba(0,0,0,0.35)]
              hover:shadow-[0_20px_55px_rgba(0,0,0,0.55)]
              shrink-0
            "
          >
            <img
              src={url}
              alt="gallery"
              className="w-full h-full object-cover transition-all duration-500"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RollingGallery;
