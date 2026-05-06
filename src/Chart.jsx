import { useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';
import { data } from './data';
import ScatterBubble from './ScatterBubble';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Legend } from './Legend';
import { useDimensions } from './use-dimensions';


export const Chart = ({ width, height, data, meanData, continents, continentColors }) => {
    
    if (!width || !height) return null;

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.gdpPercap)])
        .range([0, innerWidth]);
    const yScale = d3
        .scaleLinear()
        .domain([35, d3.max(data, (d) => d.lifeExp)])
        .range([innerHeight, 0]);
    const colorScale = d3.scaleOrdinal().domain(continents).range(continents.map((c) => continentColors[c]));

    const maxR = Math.max(8, Math.min(30, innerWidth * 0.05)); // 3% of plot width, clamped
    const minR = Math.max(2, maxR * 0.2);

    const radiusScale = d3
        .scaleSqrt()
        .domain(d3.extent(data, (d) => d.pop))
        .range([minR, maxR]);

    const pixelsPerTick = {
        x: '50',
        y: '50',
    };

    return (

        <svg id='scatter-plot' width={width} height={height} >
        <g transform={`translate(${margin.left}, ${margin.top})`} overflow={'visible'}>
          <g transform={`translate(0, ${innerHeight})`} overflow={'visible'}>
            <AxisBottom xScale={xScale} pixelsPerTick={pixelsPerTick.x} innerHeight={innerHeight} label="GDP per capita (USD)" />
          </g>
          <AxisLeft yScale={yScale} pixelsPerTick={pixelsPerTick.y} innerWidth={innerWidth} label="Life expectancy (years)"/>
          <g overflow={'visible'}>
            {data.map((d) => (
              <ScatterBubble 
              key={d.country} 
              color={colorScale(d.continent)} 
              size={radiusScale(d.pop)} 
              x={xScale(d.gdpPercap)} 
              y={yScale(d.lifeExp)} 
              country={d.country} 
              continent={meanData ? d.continent : undefined}
              />
            ))}
          </g>
          <g transform={`translate(${innerWidth - 80}, ${innerHeight-100})`} overflow={'visible'}>
            <Legend sizeScale={radiusScale} width={85} height={70} />
          </g>
        </g>
      </svg>

    );
};

export const ResponsiveChart = ({ data, meanData, continents, continentColors }) => {
    const chartRef = useRef(null);
    const chartSize = useDimensions(chartRef);
    const ratio = 1.4; // width / height
    return (
        <div ref={chartRef} style={{ width: "60%", height: "60%" }}>
            <Chart width={chartSize.width} height={chartSize.width / ratio} data={data} meanData={meanData} continents={continents} continentColors={continentColors} />
        </div>
    );
};