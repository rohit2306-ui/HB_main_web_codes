export const Orb1=()=>{
    return(<div className="absolute inset-0">
        
        {/* First gradient ball: a large, glowing orb at the top left */}
        <div className="
          h-96 w-96 
          rounded-full 
          bg-gradient-to-r from-violet-600 to-indigo-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-10 left-10 transform -translate-x-1/2 -translate-y-1/2
          animate-pulse
        "></div>
        
        {/* Second gradient ball: a smaller, warm-toned orb in the middle */}
        <div className="
          h-72 w-72 
          rounded-full 
          bg-gradient-to-b from-rose-500 to-amber-500 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute bottom-20 right-20
          animate-bounce
        "></div>

        {/* Third gradient ball: a thin, elongated shape for a different feel */}
        <div className="
          h-48 w-80
          rounded-full 
          bg-gradient-to-tl from-cyan-400 to-blue-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          animate-spin-slow
        "></div>

      </div>)}
  
export const Orb2=()=>{
    return(
  <div className="absolute inset-0 z-0">
        {/* Orb 1: A warm red-orange orb in the top-right corner. */}
        <div className="
          h-80 w-80 
          rounded-full 
          bg-gradient-to-br from-red-500 to-orange-500
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-20 right-20 
          animate-orb-float
        "></div>
        
        {/* Orb 2: A hot pink-fuchsia orb in the bottom-left corner. */}
        <div className="
          h-72 w-72 
          rounded-full 
          bg-gradient-to-tl from-rose-500 to-fuchsia-600 
          shadow-lg 
          filter blur-3xl 
          opacity-40 
          absolute bottom-0 left-0 
          animate-orb-zoom
        "></div>

        {/* Orb 3: A glowing yellow-orange orb in the center. */}
        <div className="
          h-96 w-96
          rounded-full 
          bg-gradient-to-tr from-yellow-400 to-orange-600
          shadow-lg 
          filter blur-3xl 
          opacity-30 
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          animate-orb-spin-reverse
        "></div>

      </div>
      )}
export const Orb3=()=>{
    return(
       <div className="absolute inset-0 z-0">
        
        {/* First gradient orb: a large, glowing orange-pink orb in the center-left. */}
        <div className="
          h-96 w-96 
          rounded-full 
          bg-gradient-to-tr from-orange-500 to-pink-500 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2
          animate-orb-rise
        "></div>
        
        {/* Second gradient orb: a smaller, cool-toned orb in the bottom-right. */}
        <div className="
          h-72 w-72 
          rounded-full 
          bg-gradient-to-br from-blue-500 to-indigo-600 
          shadow-lg 
          filter blur-3xl 
          opacity-40 
          absolute bottom-1/4 right-1/4
          animate-orb-flow
        "></div>

        {/* Third gradient orb: a subtle violet shimmer at the top-right. */}
        <div className="
          h-48 w-48
          rounded-full 
          bg-gradient-to-tl from-purple-500 to-fuchsia-500
          shadow-lg 
          filter blur-3xl 
          opacity-30 
          absolute top-20 right-20
          animate-orb-spin
        "></div>
      </div>
      )}
export const Orb4=()=>{
    return(
       <div className="absolute inset-0 z-0">
        
       {/* First gradient orb: a soft blue-green glow */}
        <div className="
          h-80 w-80 
          rounded-full 
          bg-gradient-to-r from-teal-400 to-cyan-500 
          shadow-lg 
          filter blur-3xl 
          opacity-40 
          absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2
          animate-float-slow
        "></div>
        
        {/* Second gradient orb: a gentle purple-pink blend */}
        <div className="
          h-64 w-64 
          rounded-full 
          bg-gradient-to-br from-fuchsia-500 to-purple-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2
          animate-float-fast
        "></div>

        {/* Third gradient orb: a cool, subtle violet shimmer */}
        <div className="
          h-56 w-56
          rounded-full 
          bg-gradient-to-tl from-indigo-500 to-sky-500
          shadow-lg 
          filter blur-3xl 
          opacity-30 
          absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2
          animate-float-slow
        "></div>
      </div>
      )}
export const BgOrb1=()=>{
    return(<div className="absolute w-screen h-full overflow-auto bg-black">
        
        {/* First gradient ball: a large, glowing orb at the top left */}
        <div className="
          h-96 w-96 
          rounded-full 
          bg-gradient-to-r from-violet-600 to-indigo-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-10 left-10 transform -translate-x-1/2 -translate-y-1/2 
        "></div>
         
         <div className="
          h-96 w-96 
          rounded-full 
          bg-gradient-to-r from-violet-600 to-purple-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-3/4 right-1/2 transform -translate-x-1/2 -translate-y-1/2
          animate-bounce
        "></div>
                 <div className="
          h-96 w-96 
          rounded-full 
          bg-gradient-to-r from-pink-600 to-red-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2
          animate-pulse
        "></div>
        <div className="
          h-96 w-96 
          rounded-full 
          bg-gradient-to-r from-green-600 to-blue-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-80 right-0 transform -translate-x-1/2 -translate-y-1/2
          animate-pulse
        "></div>
        
        {/* Second gradient ball: a smaller, warm-toned orb in the middle */}
        <div className="
          h-72 w-72 
          rounded-full 
          bg-gradient-to-b from-amber-500 to-yellow-500 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-1/3 left-20
          animate-bounce
        "></div>
        {/* Second gradient ball: a smaller, warm-toned orb in the middle */}
        <div className="
          h-72 w-72 
          rounded-full 
          bg-gradient-to-b from-rose-500 to-amber-500 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute bottom-20 right-20
          animate-bounce
        "></div>

        {/* Third gradient ball: a thin, elongated shape for a different feel */}
        <div className="
          h-48 w-80
          rounded-full 
          bg-gradient-to-tl from-cyan-400 to-blue-600 
          shadow-lg 
          filter blur-3xl 
          opacity-50 
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          animate-spin-slow
        "></div>

      </div>)}