import React from 'react';

export const RestaurantsIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M18 2v20" />
            <path d="M16 2v6a2 2 0 0 0 4 0V2" />
            <path d="M6 2v12h4V2" />
            <path d="M8 14v8" />
            <path d="M6 5h4" />
            <path d="M6 8h4" />
        </svg>
    );
};
