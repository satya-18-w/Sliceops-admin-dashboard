

import React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

            <g transform="translate(5,5)">

                <circle cx="25" cy="25" r="22" fill="#FF6B35" />


                <path d="M25 8L40 36C34 39 28 40 22 40C18 40 14 39 10 37L25 8Z"
                    fill="white" />

                <circle cx="24" cy="18" r="2" fill="#FF6B35" />
                <circle cx="30" cy="27" r="2" fill="#FF6B35" />
                <circle cx="20" cy="30" r="2" fill="#FF6B35" />
                <circle cx="25" cy="25" r="22" stroke="#E55120" strokeWidth="2" />
            </g>


            <text x="65" y="28"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="22"
                fontWeight="700"
                fill="#111827">
                Slice
            </text>

            <text x="122" y="28"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="22"
                fontWeight="700"
                fill="#FF6B35">
                Ops
            </text>


            <text x="66" y="45"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="10"
                fill="#6B7280">
                Restaurant Operations Platform
            </text>
        </svg>
    )
}




export const HomeLogo = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

  <path
    d="M256 60
       C340 60 410 130 410 214
       L440 228
       C448 232 452 240 452 248
       C452 256 448 264 440 268
       L410 282
       C405 360 338 420 256 420
       C164 420 92 348 92 256
       C92 164 164 92 256 92
       Z"
    fill="#FF6B35"
  />

 
  <g fill="#FF6B35">
    <rect x="382" y="155" width="52" height="24" rx="8" transform="rotate(45 382 155)"/>
    <rect x="420" y="235" width="52" height="24" rx="8"/>
    <rect x="382" y="315" width="52" height="24" rx="8" transform="rotate(-45 382 315)"/>
  </g>


  <path
    d="M256 120
       L150 340
       C180 360 215 372 256 372
       C297 372 332 360 362 340
       L256 120Z"
    fill="white"
  />


  <path
    d="M150 340
       C180 360 215 372 256 372
       C297 372 332 360 362 340"
    stroke="#FFF3D6"
    strokeWidth="18"
    strokeLinecap="round"
  />


  <circle cx="256" cy="200" r="18" fill="#FF6B35"/>
  <circle cx="210" cy="290" r="18" fill="#FF6B35"/>
  <circle cx="300" cy="285" r="15" fill="#FF6B35"/>

  <path
    d="M310 145
       C350 165 380 220 380 270
       C380 300 370 325 355 345
       L310 145Z"
    fill="#F4511E"
    opacity="0.9"
  />
</svg>
    )

}


