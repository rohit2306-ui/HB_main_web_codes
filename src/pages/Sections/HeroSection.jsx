
import { useRef } from 'react';
import CardSwap, { Card } from '../../components/Rbits/LaserFlow.jsx'
import HeroCardImg1 from "../../assets/Landing/Hero/HeroCard1.png"
import HeroCardImg2 from "../../assets/Landing/Hero/HeroCard2.png"
import HeroCardImg3 from "../../assets/Landing/Hero/HeroCard3.png"
// NOTE: You can also adjust the variables in the shader for super detailed customization

// Basic Usage

// Image Example Interactive Reveal Effect
export default function HeroSection () {
  const CardDetails=[{
    title:"Hackathons",
  
    img:HeroCardImg1}
    ,
    {title:"Communities",
    img:HeroCardImg2},
    {title:"Events",
    img:HeroCardImg3}
  ]
  return (

   <div className="relative min-h-[420px] sm:min-h-[520px] md:min-h-[580px]">
  <CardSwap
        cardDistance={60}
        verticalDistance={70}
        delay={3000}
        pauseOnHover={false}
        // easing='linear'
      >
        {CardDetails.map((card, index) => (

        <Card key={index} className="border border-gray-50">
          <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 py-3 bg-black/60 backdrop-blur-sm rounded-md mt-1 border border-gray-50 ">
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <span className="text-white text-sm font-thin">{card.title}</span>
            <div></div> {/* Empty div to balance content */}
          </div>
          <img 
            src={card.img} 
            alt={card.title} 
            
            className="w-full h-full mt-10 object-cover rounded-[20px] rounded-t-none border-2 border-gray-900 " 
          />
        </Card>
        ))}

        
       
  </CardSwap>
</div>
  
  );
}
