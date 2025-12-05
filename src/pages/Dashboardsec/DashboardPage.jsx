import { Book, Calendar, Code, Laptop, School, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Footer from "../../components/Layout/Footer"

const DashboardPage = () => {
  const navigate = useNavigate()

  const Cards = [
    { 
      title: "Standard DSA Problems",
      desc: "Sharpen your logic with curated problem sets.",
      icon: Book,
      action: () => navigate("/dsa"),
      active: true
    },
    { 
      title: "Development Projects",
      desc: "Build real-world apps and strengthen your portfolio.",
      icon: Code,
      action: () => navigate("/openprojects"),
      active: true
    },
    { 
      title: "Mock Interviews",
      desc: "Practice interviews with expert mentors.",
      icon: Users,
      action: () => {},
      active: false
    },
    { 
      title: "Hackathons",
      desc: "Compete, learn and win exciting prizes.",
      icon: Laptop,
      action: () => navigate("/feed"),
      active: true
    },
    { 
      title: "Developer Events",
      desc: "Join workshops, webinars and dev meetups.",
      icon: Calendar,
      action: () => navigate("/events"),
      active: true
    },
    { 
      title: "Community",
      desc: "Connect with peer coders and mentors.",
      icon: School,
      action: () => navigate("/communities"),
      active: true
    },
  ]

  return (
    <div className="min-h-screen px-6 sm:px-12 py-16 
      bg-neutral-100 dark:bg-[#09090b] transition-colors duration-300">

      {/* HERO SECTION */}
      <div className="max-w-5xl mx-auto mt-10 text-center mb-24">
        
        <h1 className="text-5xl font-semibold tracking-tight 
          text-neutral-900 dark:text-white mb-4">
          Welcome to <span className="font-bold">Hackbase</span>
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-xl mx-auto">
          Boost your development journey with structured challenges, real-world projects,
          community learning and expert guidance.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10 mt-12">
          {[
            ["5k+ Developers", "Developers"],
            ["50+", "Projects"],
            ["5+", "Events"],
            ["1+", "Hackathons"],
          ].map(([value, label], i) => (
            <div key={i} className="
              text-center bg-white/60 dark:bg-white/[0.05]
              backdrop-blur-xl px-6 py-4 rounded-2xl
              border border-neutral-200 dark:border-white/10
              shadow-sm">
              <div className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION TITLE */}
      <h2 className="text-3xl font-semibold tracking-tight 
        text-neutral-900 dark:text-white mb-10">
        Explore Tools
      </h2>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {Cards.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i}
              className="
                group p-8 rounded-3xl border 
                border-neutral-300 dark:border-white/10
                bg-white/70 dark:bg-white/[0.04]
                backdrop-blur-xl shadow-md hover:shadow-xl 
                transition-all duration-300 cursor-pointer
                hover:-translate-y-2 
              "
              onClick={item.active ? item.action : undefined}
            >
              
              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center 
                bg-neutral-100 dark:bg-white/10 rounded-2xl mb-6
                border border-neutral-200 dark:border-white/10 
                shadow-sm group-hover:scale-110 transition-transform">
                <Icon size={40} className="text-neutral-700 dark:text-neutral-200"/>
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* Button */}
              <button 
                className={`
                  mt-6 w-full py-2 rounded-xl text-sm font-semibold 
                  transition-all duration-300
                  ${item.active 
                    ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-80" 
                    : "bg-neutral-300 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-500 cursor-not-allowed"} 
                `}
              >
                {item.active ? "Open" : "Coming Soon"}
              </button>
            </div>
          )
        })}
      </div>

      {/* EXTRA SECTION */}
      <div className="mt-28 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-6">
          What’s New
        </h2>

        <div className="
          rounded-3xl p-8 
          border border-neutral-300 dark:border-white/10
          bg-white/50 dark:bg-white/[0.04]
          backdrop-blur-xl shadow-sm
        ">
          <ul className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm">
            <li>• New real-world project templates added</li>
            <li>• Community leaderboard system coming soon</li>
            <li>• AI-guided mock interviews rolling out next month</li>
            <li>• Hackathon discovery feed redesigned with better UI</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardPage
