import React from 'react';

export const PizzaLogo = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="10" fill="#FF5533" />
            <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
    );
};
