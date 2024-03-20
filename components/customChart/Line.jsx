import React from "react";
import { curveCardinal, line } from "d3";

const Line = ({ xScale, yScale, data }) => {
  const lineGenerator = line()
    .x((d, index) => xScale(index))
    .y((d) => yScale(d))
    .curve(curveCardinal);

  return (
    <g className="line">
      <path
        d={lineGenerator(data)}
        stroke="red"
        style={{
          fill: "none",
          strokeWidth: "3px",
          strokeLinecap: "round"
        }}
      />
    </g>
  );
};

export default Line;
