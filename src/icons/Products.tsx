import React from 'react';

export const ProductsIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
            <path d="M12 21L3 7C5 5.5 8.5 4 12 4C15.5 4 19 5.5 21 7L12 21Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M12 21L3 7C5 5.5 8.5 4 12 4C15.5 4 19 5.5 21 7L12 21Z" />
            <circle cx="12" cy="9" r="1" fill="currentColor" />
            <circle cx="9" cy="13" r="1" fill="currentColor" />
            <circle cx="15" cy="13" r="1" fill="currentColor" />
        </svg>
    );
};
