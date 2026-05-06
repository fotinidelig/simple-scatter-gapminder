import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { data } from './data';
import { ResponsiveChart } from './Chart';
import './App.css';

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
        <ResponsiveChart data={plottedData} meanData={meanData} continents={continents} continentColors={continentColors} />
      {/* <svg id='scatter-plot' width={width} height={height} >
        <g transform={`translate(${margin.left}, ${margin.top})`} overflow={'visible'}>
          <g transform={`translate(0, ${innerHeight})`} overflow={'visible'}>
            <AxisBottom xScale={xScale} pixelsPerTick={pixelsPerTick.x} innerHeight={innerHeight} label="GDP per capita (USD)" />
          </g>
          <AxisLeft yScale={yScale} pixelsPerTick={pixelsPerTick.y} innerWidth={innerWidth} label="Life expectancy (years)"/>
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
      </svg> */}
    </div>
  );
}