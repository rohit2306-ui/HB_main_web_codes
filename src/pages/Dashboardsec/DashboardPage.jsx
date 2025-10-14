import { Book, Calendar, Code, Laptop, School, Users } from "lucide-react"
import { SpotlightCard } from "../../pages/Sections/AchievementsSection"
import { useNavigate } from "react-router-dom"

const DashboardPage = () => {
  const navigate = useNavigate()

  const CardsDetails = [
    { 
      title: "Standard DSA Problems",
      description: "Sharpen your problem-solving skills with curated DSA practice sets.", 
      icon: <Book size={60} className='text-blue-500 drop-shadow-md' />,
      gradientColor: "rgba(59, 130, 246, 0.25)", active: true,
      action: "Solve Now", actionFunc: () => { navigate('/dsa') }
    },
    { 
      title: "Development Projects",
      description: "Work on real-world projects to build your portfolio and gain practical experience.",
      icon: <Code size={60} className='text-red-500 drop-shadow-md' />, 
      gradientColor: "rgba(207, 74, 25, 0.25)", active: true,
      action: "Solve real world projects", actionFunc: () => { navigate('/openprojects') }
    },
    { 
      title: "Mock Interviews", 
      description: "Get real interview experience with mock sessions led by experts.",
      icon: <Users size={60} className='text-green-500 drop-shadow-md' />, 
      gradientColor: "rgba(16, 185, 129, 0.25)", active: false,
      action: "Coming Soon", actionFunc: () => {}
    },
    { 
      title: "Hackathons",
      description: "Participate in hackathons to showcase your skills and win exciting prizes.",
      icon: <Laptop size={60} className='text-pink-500 drop-shadow-md' />,
      gradientColor: "rgba(240, 10, 190, 0.25)", active: true,
      action: "Explore Hackathons", actionFunc: () => { navigate('/feed') }
    },
    { 
      title: "Developer Events",
      description: "Join workshops and webinars to learn from industry experts.",
      icon: <Calendar size={60} className='text-orange-500 drop-shadow-md' />,
      gradientColor: "rgba(240, 10, 10, 0.25)", active: true,
      action: "Explore Events", actionFunc: () => { navigate('/events') }
    },
    { 
      title: "Community",
      description: "Connect with peers and mentors to enhance your learning.",
      icon: <School size={60} className='text-yellow-500 drop-shadow-md' />,
      gradientColor: "rgba(240, 210, 10, 0.25)", active: true,
      action: "Explore Communities", actionFunc: () => { navigate('/communities') }
    },
  ]

  return (
    <>
      <style>
        {`
          @keyframes wave {
            0% { transform: rotate(0.0deg) }
            10% { transform: rotate(14.0deg) }
            20% { transform: rotate(-8.0deg) }
            30% { transform: rotate(14.0deg) }
            40% { transform: rotate(-4.0deg) }
            50% { transform: rotate(10.0deg) }
            60% { transform: rotate(0.0deg) }
            100% { transform: rotate(0.0deg) }
          }
          .animate-wave {
            animation: wave 2.5s infinite;
            transform-origin: 70% 70%;
            display: inline-block;
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 from-slate-100 to-slate-200 px-6 sm:px-10 py-20">
        
        {/* Premium Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-14 bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 animate-gradient-x">
          {/* Welcome to Hackbase */}
          
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          {CardsDetails.map((card, index) => (
            <SpotlightCard
              themed={true}
              key={index}
              spotlightColor={card.gradientColor}
              className="hover:-translate-y-2 transition-all duration-300 hover:border-green-800 
              backdrop-blur-md bg-white/10 dark:bg-slate-800/40 shadow-lg hover:shadow-2xl 
              border border-gray-200/20 dark:border-slate-700/30 rounded-2xl p-6"
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">{card.icon}</div>
                <div className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">{card.title}</div>
                <div className="text-base font-medium text-slate-600 dark:text-slate-400">{card.description}</div>

                <button 
                  onClick={card.actionFunc} 
                  className={`font-semibold w-[90%] mt-8 px-4 py-2 rounded-xl shadow-md transition-all duration-300 
                    ${card.active 
                      ? "bg-gradient-to-r from-green-400 to-blue-400 text-white hover:scale-105 hover:shadow-lg" 
                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-100 cursor-not-allowed"}`}
                >
                  {card.action}
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </>
  )
}

export default DashboardPage
