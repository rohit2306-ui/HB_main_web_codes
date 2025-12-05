import React, { lazy, Suspense } from "react";
import { BgOrb1 } from "../../components/Rbits/Orbs.jsx";

// Lazy-load expensive components
import LandingNav from "../../components/Layout/LandingNav.jsx";
import ProfileCard from "../../components/Rbits/ProfileCard/ProfileCard.jsx";
import ChromaGridCard from "../../components/Rbits/ProfileCard/ChromaGridCard.jsx";

// Assets
import Bgicon from "../../assets/ProfileCard/Bgicon.png";
import rohit from "../../assets/ProfileCard/rohit.png";
import adinath from "../../assets/ProfileCard/SecTeam/adinath.jpg";
import person2 from "../../assets/ProfileCard/SecTeam/person2.jpg";
import person3 from "../../assets/ProfileCard/SecTeam/person3.jpg";
import person4 from "../../assets/ProfileCard/SecTeam/person4.jpg";
import person5 from "../../assets/ProfileCard/SecTeam/person5.jpg";

// --- SVG Icons for Mission & Vision ---
const MissionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-indigo-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const VisionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-teal-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

// Memoized Components
const ExpensiveProfileCard = React.memo(({ profile }) => (
  <ProfileCard
    name={profile.name}
    title={profile.title}
    handle={profile.handle}
    status={profile.status}
    contactText={profile.contactText}
    avatarUrl={profile.avatarUrl}
    grainUrl="https://reactbits.dev/assets/grain.webp"
    iconUrl={Bgicon}
    showUserInfo={true}
    enableTilt={true}
    enableMobileTilt={false}
    onContactClick={() => window.open(profile.link, "_blank")}
  />
));

export default function AboutSection() {
  const navItems = [
    { path: "/", label: "Gallery" },
    { path: "/aboutus", label: "About Us" },
  ];

  const IMPProfileCardInfo = [
    {
      name: "Rohit Thakur",
      title: "Founder & CEO",
      handle: "rohitthakur",
      status: "Online",
      contactText: "Contact Me",
      avatarUrl: rohit,
      link: "https://www.linkedin.com/in/rohit-thakur-0853b0335/",
    },
  ];

  const items = [
    {
      image: adinath,
      title: "Adinath R",
      subtitle: "Full Stack Developer",
      handle: "@radinath",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg,#4F46E5,#000)",
      url: "https://www.linkedin.com/in/radinath/",
    },
    {
      image: person2,
      title: "Jai Vardhan Parmar",
      subtitle: "management team",
      handle: "@jaivardhanparmar",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg,#10B981,#000)",
      url: "https://www.linkedin.com/in/jai-vardhan-parmar-268b7a318/",
    },
    {
      image: person3,
      title: "Srishti Dubey",
      subtitle: "Technical team",
      handle: "@srishtidubey",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg,#F59E0B,#000)",
      url: "https://www.linkedin.com/in/srishti-dubey-705358337/",
    },
    {
      image: person4,
      title: "Karan Pathak",
      subtitle: "Technical team",
      handle: "@karanpathak",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg,#EF4444,#000)",
      url: "https://www.linkedin.com/in/karan-pathak-888043331/",
    },
    {
      image: person5,
      title: " ",
      subtitle: "managing director",
      handle: " ",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg,#EF4444,#000)",
      url: " ",
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden overflow-y-auto font-sans bg-black/80">
      <Suspense
        fallback={<div className="text-white text-center p-12">Loading...</div>}
      >
        {/* Background Orbs */}
        <div className="absolute -z-10 min-h-screen w-full">
          <BgOrb1 />
        </div>

        {/* Navbar */}
        <LandingNav navItems={navItems} />

        <div className="absolute z-10 w-full flex flex-col items-center pt-24 md:pt-32">
          {/* =========== About Us, Mission, and Vision Start =========== */}
          <div className="w-full flex flex-col items-center px-6 md:px-10">
            {/* About Us Section */}
            <div className="text-center max-w-4xl mx-auto mb-24">
              <p className="text-indigo-400 font-semibold mb-2">Our Story</p>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 first-letter:text-7xl">
                About Us
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed font-sans">
                Welcome to our creative space, where innovation meets expertise.
                We are a passionate team of developers, designers, and
                visionaries dedicated to building next-generation digital
                experiences. Our journey began with a simple idea: to transform
                complex problems into elegant, user-centric solutions. We thrive
                on collaboration, pushing the boundaries of technology to create
                products that are not only functional but also beautiful and
                intuitive.
              </p>
            </div>

            {/* Mission and Vision Section */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Mission Card */}
              <div className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50">
                <div className="flex items-center gap-4 mb-4">
                  <MissionIcon />
                  <h3 className="text-2xl font-bold font-sans text-white">
                    Our Mission
                  </h3>
                </div>
                <p className="text-md text-slate-400 leading-relaxed font-sans">
                  To empower businesses and individuals by providing
                  cutting-edge software solutions that drive growth, efficiency,
                  and success. We are committed to delivering excellence and
                  fostering long-term partnerships built on trust and mutual
                  respect.
                </p>
              </div>

              {/* Vision Card */}
              <div className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/50">
                <div className="flex items-center gap-4 mb-4">
                  <VisionIcon />
                  <h3 className="text-2xl font-bold font-sans text-white">
                    Our Vision
                  </h3>
                </div>
                <p className="text-md text-slate-400 leading-relaxed font-sans">
                  To be a globally recognized leader in digital innovation,
                  known for our creativity, integrity, and unwavering commitment
                  to quality. We envision a future where technology seamlessly
                  integrates with everyday life, making it simpler and more
                  connected for everyone.
                </p>
              </div>
            </div>
          </div>
          {/* =========== About Us, Mission, and Vision End =========== */}

          {/* --- Visual Separator --- */}
          <div className="w-full max-w-5xl mx-auto my-24">
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          </div>

          {/* Core Team Section */}
          <div className="text-center px-4">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4 first-letter:text-7xl">
              Meet Our Team
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-sans">
              The passionate minds and creative talents driving our vision
              forward.
            </p>
          </div>

          <div className="w-full flex justify-center p-5 my-12">
            {IMPProfileCardInfo.map((profile, index) => (
              <ExpensiveProfileCard key={index} profile={profile} />
            ))}
          </div>

          <div className="w-full h-full bg-black/50 relative p-10 mt-8">
            <ChromaGridCard
              items={items}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
