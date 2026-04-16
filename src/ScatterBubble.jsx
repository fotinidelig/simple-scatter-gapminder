import { useState } from 'react';

export default function ScatterBubble({ color, size, x, y, country, continent }) {
    const [hover, setHover] = useState(false);
    return (
        <g style={{
            transition: 'all 0.3s ease',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        
        >
        <circle
            cx={x}
            cy={y}
            r={size}
            fill={color}
            stroke={'white'}
            strokeWidth={1}
            fillOpacity={hover ? 1 : 0.6}
        >
          <title>{continent ? `${continent}`: `${country}`}</title>
        </circle>
        </g>
    )
}