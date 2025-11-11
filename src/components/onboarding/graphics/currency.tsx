
'use client';

export function CurrencyGraphic() {
  return (
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="4"/>
        
        <path d="M125 70C125 55 115 50 100 50C85 50 75 55 75 70" stroke="#FFD600" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 50V150" stroke="#FFD600" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M70 100H130" stroke="#FFD600" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        
        <path d="M60 140C60 125 50 120 35 120C20 120 10 125 10 140" stroke="white" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform="translate(15, -40) scale(0.8)"/>
        <path d="M35 120V220" stroke="white" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform="translate(15, -40) scale(0.8)"/>
        
        <path d="M190 70H150" stroke="white" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform="translate(-15, 30) scale(0.8)"/>
        <path d="M190 90H150" stroke="white" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform="translate(-15, 30) scale(0.8)"/>
        <path d="M170 60V100" stroke="white" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" transform="translate(-15, 30) scale(0.8)"/>
    </svg>
  );
}
