// Simplified StoryLine - Static Background
export default function StoryLine() {
  // Removed scroll-linked spring animation as it contributes to main thread work
  // Just a static decorative line now
  
  return (
    <div className="fixed top-0 left-0 w-full h-screen pointer-events-none -z-10 bg-background/0">
        <svg 
            className="w-full h-full opacity-20" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
        >
             <path
                d="M 50 0 C 60 20, 40 40, 50 60 C 60 80, 40 100, 50 120"
                fill="none"
                stroke="#56020a" 
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-[0_0_10px_rgba(86,2,10,0.5)]"
             />
        </svg>
    </div>
  );
}
