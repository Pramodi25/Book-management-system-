import React, { useEffect } from 'react';

const SplashScreen = ({ onFinish, duration = 2000 }) => {
  console.log('SplashScreen rendering, will finish in', duration, 'ms');
  
  useEffect(() => {
    console.log('SplashScreen useEffect triggered');
    const timer = setTimeout(() => {
      console.log('SplashScreen timeout triggered, calling onFinish');
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary-purple z-50">
      <div className="flex flex-col items-center animate-fade-in">
        <div className="mb-6">
          <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="stroke-primary-peach animate-pulse" 
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight animate-bounce">Book Vault</h1>
        <p className="text-primary-lavender text-lg">Your Personal Library Manager</p>
        
        <div className="mt-8">
          <div className="w-48 h-2 bg-primary-navy rounded-full overflow-hidden">
            <div className="h-full bg-primary-peach rounded-full animate-loading-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;