export const Legend = ({sizeScale, width, height}) => {
    // const ticks = sizeScale.ticks(4);
    // console.log(ticks)
    // const ticks = [9, 14, 25];
    // const labels = [10, 16, 27];
    const labels = [10000000, 100000000, 800000000];
    // const ticks = labels.map((value) => sizeScale.invert(value));
    const lowerPoint = height;

    function getCy(radius) {
        return lowerPoint - 2*radius;
    }

    return (
        <>
        <rect x={0} y={0} width={width} height={height} fill='black' stroke='none' opacity={.8}/>
        <text x={width/3} y={5} textAnchor="middle" dominantBaseline="middle" fontSize="11px" fill='white'>Population</text>
        {labels.map((value) => (
            <g key={value} transform={`translate(${width/3}, ${getCy(sizeScale(value))})`} overflow={'visible'}>
                <circle cx={0} cy={sizeScale(value)} r={sizeScale(value)} fill='none' stroke='white' opacity={.5}/>
                <line x1={0} x2={30} y1={0} y2={0} stroke='white' opacity={.5}/>
                <text x={30} y={0} textAnchor="start" dominantBaseline="middle" fontSize="8px" fill='white'>{Math.round(value/1000000)}M</text>
            </g>
         ))}
        </>
    )
}