import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* New Logo: Laptop with Ballot Box */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="pinkGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient id="pinkGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
          </defs>
          
          {/* Laptop Base */}
          <rect x="20" y="60" width="60" height="8" rx="2" fill="#9CA3AF" opacity="0.8"/>
          <rect x="22" y="62" width="56" height="4" rx="1" fill="#6B7280"/>
          
          {/* Laptop Screen */}
          <rect x="15" y="15" width="70" height="50" rx="3" fill="#1F2937"/>
          <rect x="18" y="18" width="64" height="44" rx="2" fill="#FFFFFF"/>
          
          {/* Ballot Box on Screen */}
          <rect x="35" y="25" width="30" height="32" rx="2" fill="url(#pinkGradient1)"/>
          <rect x="37" y="27" width="26" height="28" rx="1" fill="url(#pinkGradient2)"/>
          {/* Ballot Box Slot */}
          <rect x="38" y="24" width="24" height="3" rx="1.5" fill="#1F2937"/>
          
          {/* Ballot Paper (hand inserting) */}
          <rect x="48" y="10" width="8" height="18" rx="1" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5"/>
          {/* Checkboxes on ballot */}
          <rect x="49.5" y="12" width="2" height="2" rx="0.5" fill="none" stroke="#9CA3AF" strokeWidth="0.5"/>
          <rect x="49.5" y="15.5" width="2" height="2" rx="0.5" fill="none" stroke="#9CA3AF" strokeWidth="0.5"/>
          <rect x="49.5" y="19" width="2" height="2" rx="0.5" fill="none" stroke="#9CA3AF" strokeWidth="0.5"/>
          {/* Checkmark on first box */}
          <path d="M49.5 12.5L50.5 13.5L52 12" stroke="#10B981" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          
          {/* Hand (simplified) */}
          <ellipse cx="52" cy="8" rx="3" ry="2.5" fill="#FBBF24" opacity="0.9"/>
          <path d="M50 8Q52 6 54 8" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent leading-tight`}>
            BALLOT BUDDY
          </span>
          <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
            Secure Digital Voting
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
