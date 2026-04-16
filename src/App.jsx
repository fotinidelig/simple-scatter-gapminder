import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { data } from './data';
import ScatterBubble from './ScatterBubble';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Legend } from './Legend';
import './App.css';

const width = 700;
const height = 500;
const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const continents = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Aggregates'];
const continentColors = {
  Africa: '#ED7573',
  Americas: '#B4E2F4',
  Asia: '#718316',
  Europe: '#CB8CD4',
  Oceania: '#50A2A7',
  Aggregates: '#246A50',
};

function getContinentAgregates(data, continent) {
  return {
    continent: continent,
    lifeExp: d3.mean(data.filter((d) => d.continent === continent), (d) => d.lifeExp),
    pop: d3.sum(data.filter((d) => d.continent === continent), (d) => d.pop),
    gdpPercap: d3.mean(data.filter((d) => d.continent === continent), (d) => d.gdpPercap),
  }
}

const dataPerContinent = [
  getContinentAgregates(data, 'Europe'),
  getContinentAgregates(data, 'Americas'),
  getContinentAgregates(data, 'Asia'),
  getContinentAgregates(data, 'Oceania'),
  getContinentAgregates(data, 'Africa'),
]

const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.gdpPercap)])
  .range([0, innerWidth]);
const yScale = d3
  .scaleLinear()
  .domain([35, d3.max(data, (d) => d.lifeExp)])
  .range([innerHeight, 0]);
const colorScale = d3.scaleOrdinal().domain(continents).range(continents.map((c) => continentColors[c]));

const radiusScale = d3
  .scaleSqrt()
  .domain(d3.extent(data, (d) => d.pop))
  .range([5, 30]);

const pixelsPerTick = {
  x: '50',
  y: '50',
};

export default function App() {
  const [selectedContinents, setSelectedContinents] = useState(() => new Set(continents));

  const [meanData, setMeanData] = useState(false);

  const plottedData = useMemo(() => {
    if (selectedContinents.size === 0) return [];
    if (meanData) return dataPerContinent;
    return data.filter((d) => selectedContinents.has(d.continent));
  }, [selectedContinents, meanData]);

  const toggleContinent = (continent) => {
    if (continent === 'Aggregates') {
      setMeanData((prev) => !prev);
      if (meanData) setSelectedContinents(new Set([...selectedContinents, 'Aggregates']));
      else setSelectedContinents(new Set(continents.filter((c) => c !== 'Aggregates')));
      }
    else {
      setMeanData(false);
      setSelectedContinents((prev) => {
        const next = new Set(prev);
        if (next.has(continent)) next.delete(continent);
          else next.add(continent);
          return next;
        });
    }
  };

  return (
    <div id='main-container'
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: 'white' }}>Affrica is giving its best!</h1>
      <p style={{ color: 'white' }}>Although GDP per capita shows differences between continents, it only influences life expectancy up to a certain point. </p>
      <div id='selector-buttons'>
        <div className="continent-buttons">
          {continents.map((continent) => {
            const isSelected = selectedContinents.has(continent);
            const color = continentColors[continent];
            return (
              <button
                key={continent}
                type="button"
                className={`continent-button ${isSelected ? 'is-selected' : ''}`}
                style={{
                  borderColor: color,
                  color: isSelected ? '#0b0d10' : color,
                  background: isSelected ? color : 'transparent',
                }}
                aria-pressed={isSelected}
                onClick={() => toggleContinent(continent)}
              >
                {continent}
              </button>
            );
          })}
        </div>
      </div>
      <svg id='scatter-plot' width={width} height={height} >
        <g transform={`translate(${margin.left}, ${margin.top})`} overflow={'visible'}>
          <g transform={`translate(0, ${innerHeight})`} overflow={'visible'}>
            <AxisBottom xScale={xScale} pixelsPerTick={pixelsPerTick.x} innerHeight={innerHeight} label="GDP per capita" />
          </g>
          <AxisLeft yScale={yScale} pixelsPerTick={pixelsPerTick.y} innerWidth={innerWidth} label="Life expectancy"/>
          <g overflow={'visible'}>
            {plottedData.map((d) => (
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
    </div>
  );
}