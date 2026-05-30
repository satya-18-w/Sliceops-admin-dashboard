

export const Logo = () => {
    return (
        <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">

            <g transform="translate(5,5)">

                <circle cx="25" cy="25" r="22" fill="#FF6B35" />


                <path d="M25 8L40 36C34 39 28 40 22 40C18 40 14 39 10 37L25 8Z"
                    fill="white" />

                <circle cx="24" cy="18" r="2" fill="#FF6B35" />
                <circle cx="30" cy="27" r="2" fill="#FF6B35" />
                <circle cx="20" cy="30" r="2" fill="#FF6B35" />
                <circle cx="25" cy="25" r="22" stroke="#E55120" stroke-width="2" />
            </g>


            <text x="65" y="28"
                font-family="Inter, Arial, sans-serif"
                font-size="22"
                font-weight="700"
                fill="#111827">
                Slice
            </text>

            <text x="122" y="28"
                font-family="Inter, Arial, sans-serif"
                font-size="22"
                font-weight="700"
                fill="#FF6B35">
                Ops
            </text>


            <text x="66" y="45"
                font-family="Inter, Arial, sans-serif"
                font-size="10"
                fill="#6B7280">
                Restaurant Operations Platform
            </text>
        </svg>
    )
}
