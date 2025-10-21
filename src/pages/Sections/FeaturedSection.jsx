import LogoLoop from "../../components/Rbits/LogoLoop.jsx";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
import { SpotlightCard } from "./AchievementsSection.jsx";
import Col1 from "../../assets/Colleges/Col1.png";
import Col2 from "../../assets/Colleges/Col2.png";
import Col3 from "../../assets/Colleges/Col3.png";
import Col4 from "../../assets/Colleges/Col4.png";
import Col5 from "../../assets/Colleges/Col5.png";

// Alternative with image sources
const imageLogos = [
  // {
  //   src: Col1,
  //   alt: "Company 1",
  //   href: "https://en.wikipedia.org/wiki/Dayalbagh_Educational_Institute",
  // },
  { src: Col2, alt: "Company 2", href: "https://dbrau.ac.in/" },
  // { src: Col3, alt: "Company 3", href: "https://rbscollegeagra.edu.in/" },
  // { src: Col5, alt: "Company 5", href: "https://sjcagra.ac.in/" },
];
function FeaturedSection() {
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-12 text-black">
      <div className="mb-10">
        <div className="flex justify-center items-center flex-col ">
          <h2 className="font-bold text-7xl  block ml-20 z-20 mb-5 text-white">
            Our Network
          </h2>
          <p className="font-semibold text-base text-slate-200 z-20 text-center max-w-5xl block ml-20 mb-20">
            Hackbase is proud to collaborate with top colleges and companies,
            building a strong community for developers, innovators, and
            learners.This Opens New Doors for Us the Students
          </p>
        </div>
        <div className="grid mx-24 self-center  sm:grid-cols-1 lg:grid-cols-2 gap-8 text-black">
          <SpotlightCard
            spotlightColor="rgba(59, 130, 246, 0.25)"
            className="bg-slate-500/10 hover:-translate-y-1 transition-all border-1 border-neutral-100 hover:border-blue-800 "
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-500 mb-4">10+</div>
              <div className="text-lg font-medium ">College Connections</div>
            </div>
          </SpotlightCard>
          <SpotlightCard
            spotlightColor="rgba(90, 192, 180, 0.25)"
            className="bg-slate-500/10 hover:-translate-y-1 transition-all border-1 border-neutral-100 hover:border-blue-800 "
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-green-500 mb-4">1</div>
              <div className="text-lg font-medium ">
                Major Company Partnerships
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
      <div
        style={{
          height: "200px",
          width: "100%",
          position: "absolute",
          left: 0,

          overflow: "hidden",
        }}
      >
        <LogoLoop
          logos={imageLogos}
          speed={120}
          direction="left"
          logoHeight={150}
          gap={40}
          pauseOnHover={false}
          scaleOnHover
          fadeOut
          fadeOutColor="#00000099"
          // className="bg-black/20"
          ariaLabel="Technology partners"
        />
      </div>
    </div>
  );
}
export default FeaturedSection;
