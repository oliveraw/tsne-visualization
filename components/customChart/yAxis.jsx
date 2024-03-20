import React from "react";
import { format } from "d3";
import { useDimensionsContext } from "./Chart";

const YAxis = ({ scale: yScale }) => {
  const dimensions = useDimensionsContext();
  const numberOfTicks = dimensions.boundedHeight / 70;
  const ticks = yScale.ticks(numberOfTicks);
  const formatTick = format(",");

  return (
    <React.Fragment>
      <g className="y-axis">
        <line
          key="y-axis__line"
          className="y-axis__line"
          y2={dimensions.boundedHeight}
          stroke="#bdc3c7"
        />
        {ticks.map((t, idx) => (
          <React.Fragment key={`y-${t}-container-${idx}`}>
            <line
              className="y-axis__tick"
              key={`y-axis__tick-${idx}-${t}`}
              x2="-10"
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="#bdc3c7"
            />
            <text
              key={`y-axis__tick__label-${idx}-${t}`}
              className="y-axis__tick__label"
              transform={`translate(-30, ${yScale(t)})`}
            >
              {formatTick(t)}
            </text>
          </React.Fragment>
        ))}
      </g>
    </React.Fragment>
  );
};

export default YAxis;
