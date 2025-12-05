import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import img1 from "../../assets/images_hack_agra_chapter_1/image5.jpg";
import img2 from "../../assets/images_hack_agra_chapter_1/image7.jpg";
import img3 from "../../assets/images_hack_agra_chapter_1/image8.jpg";

const TwoSectionShowcase = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((sec, i) => {
      gsap.fromTo(
        sec,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: i * 0.25,
        }
      );
    });
  }, []);

  return (
    <div className="w-full min-h-screen text-white px-[50px] py-[70px] space-y-[120px]">

      {/* SECTION 1 */}
      <div
        ref={(el) => (sectionRefs.current[0] = el)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center"
      >
        {/* Image */}
        <div className="w-full flex justify-center">
          <img
            src={img1}
            className="w-[570px] h-[380px] object-cover rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
          />
        </div>

        {/* Text */}
        <div className="space-y-5">
  <h2 className="text-4xl lg:text-5xl font-semibold leading-tight">
    Building the Future of Tech From Tier 2 & 3 India
  </h2>

  <p className="text-xl opacity-80 leading-relaxed max-w-[600px]">
    We're on a mission to unlock world-class opportunities for students in
    Tier 2 and Tier 3 cities. Talent is everywhere—access isn’t.  
    And it’s our responsibility to bridge that gap by bringing real tools,
    real exposure, and real community support where it’s needed the most.
  </p>
</div>

      </div>

      {/* SECTION 2 */}
      <div
        ref={(el) => (sectionRefs.current[1] = el)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center"
      >
        {/* Text */}
        <div className="space-y-5">
  <h2 className="text-4xl lg:text-5xl font-semibold leading-tight">
    Empowering Tier 2 & 3 Talent With Real Opportunities
  </h2>

  <p className="text-xl opacity-80 leading-relaxed max-w-[600px]">
    India’s Tier 2 and Tier 3 cities are full of talented students—what they 
    lack isn’t skill, it’s exposure. Our mission is simple: bring real 
    opportunities, guidance, and tech culture to the places where it’s needed 
    the most, and help these students reach the level they truly deserve.
  </p>
</div>

        {/* Image */}
        <div className="w-full flex justify-center">
          <img
            src={img2}
            className="w-[550px] h-[380px] object-cover rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
          />
        </div>
        
      </div>
      
      

    </div>
  );
};

export default TwoSectionShowcase;
