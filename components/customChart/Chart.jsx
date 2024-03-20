import React, { createContext, useContext } from "react";

const ChartContext = createContext();
export const useDimensionsContext = () => useContext(ChartContext);

const Chart = ({ svgRef, dimensions, children }) => {
  return (
    <ChartContext.Provider value={dimensions}>
      <svg className="Chart" ref={svgRef}>
        <g
          transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
        >
          <defs>
            <clipPath className="clip-path" id="clip">
              <rect
                x="0"
                y="0"
                width={dimensions.boundedWidth}
                height={dimensions.boundedHeight}
              />
            </clipPath>
          </defs>

          {children}
        </g>
      </svg>
    </ChartContext.Provider>
  );
};

export default Chart;
