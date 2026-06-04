import React from 'react';

export const SalesIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M4 9h3v11H4zm6-5h3v16h-3zm6 9h3v7h-3z" />
        </svg>
    );
};
