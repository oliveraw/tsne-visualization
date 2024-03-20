import React from "react";
import { format } from "d3";
import { useDimensionsContext } from "./Chart";

const XAxis = ({ scale: xScale }) => {
  const dimensions = useDimensionsContext();
  const numberOfTicks = dimensions.boundedHeight / 70;
  const ticks = xScale.ticks(numberOfTicks);
  const formatTick = format(",");

  return (
    <React.Fragment>
      <g
        className="x-axis"
        transform={`translate(0, ${dimensions.boundedHeight})`}
      >
        <line
          className="x-axis__line"
          stroke="#bdc3c7"
          x2={dimensions.boundedWidth}
        />
        {ticks.map((t, idx) => (
          <React.Fragment key={`x-${idx}-${t}-container`}>
            <line
              className="x-axis__tick"
              key={`x-axis__tick-${idx}-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={10}
              stroke="#bdc3c7"
            />
            <text
              key={`x-axis__tick__label-${idx}-${t}`}
              className="x-axis__tick__label"
              transform={`translate(${xScale(t)}, 25)`}
            >
              {formatTick(t)}
            </text>
          </React.Fragment>
        ))}
      </g>
    </React.Fragment>
  );
};

export default XAxis;
