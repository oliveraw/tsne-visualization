import React, { useRef, useEffect, useState } from "react";
import {
  select,
  pointers,
  mean,
  scaleLinear,
  zoomIdentity,
  max,
  zoom,
  zoomTransform
} from "d3";

import Chart from "./Chart.jsx";
import XAxis from "./xAxis.jsx";
import YAxis from "./yAxis.jsx";
import Line from "./Line.jsx";
import useDimensions from "@/app/useDimensions.js";

const DIMENSIONS = {
  marginTop: 15,
  marginRight: 15,
  marginBottom: 40,
  marginLeft: 60,
  innerPadding: 10
};

const LineChart = ({ data, id = "myZoomableLineChart" }) => {
  const svgRef = useRef();

  const [wrapperRef, dimensions] = useDimensions();
  const [currentGlobalZoomState, setCurrentGlobalZoomState] = useState(
    zoomIdentity
  );
  const [currentYZoomState, setCurrentYZoomState] = useState(zoomIdentity);
  const [currentXZoomState, setCurrentXZoomState] = useState(zoomIdentity);

  const updatedDimensions = {
    ...DIMENSIONS,
    ...dimensions,
    boundedHeight: Math.max(
      dimensions.height - DIMENSIONS.marginTop - DIMENSIONS.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      dimensions.width - DIMENSIONS.marginLeft - DIMENSIONS.marginRight,
      0
    )
  };

  const { boundedHeight, boundedWidth, innerPadding } = updatedDimensions;

  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([innerPadding, boundedWidth - innerPadding]);

  const yScale = scaleLinear()
    .domain([0, max(data)])
    .range([boundedHeight - innerPadding, innerPadding]);

  if (currentXZoomState) {
    const newXScale = currentXZoomState.rescaleX(xScale);
    xScale.domain(newXScale.domain());
  }

  if (currentYZoomState) {
    const newYScale = currentYZoomState.rescaleY(yScale);
    yScale.domain(newYScale.domain());
  }

  useEffect(() => {
    const svg = select(svgRef.current);
    const resetListener = select(".reset-listening-rect");

    // center the action (handles multitouch)
    const center = (event, target) => {
      if (event.sourceEvent) {
        const p = pointers(event, target);
        return [mean(p, (d) => d[0]), mean(p, (d) => d[1])];
      }
      return [boundedWidth / 2, boundedHeight / 2];
    };

    const zoomGlobal = zoom()
      .scaleExtent([0.1, 500])
      .on("zoom", (event) => {
        console.log(event.transform);
        const { k: newK, x: newX, y: newY } = event.transform;
        const { k: prevK, x: prevX, y: prevY } = currentGlobalZoomState;
        const point = center(event, svg);

        const isZoomingX =
          point[0] > DIMENSIONS.marginLeft + 50 && point[0] < boundedWidth;
        const isZoomingY =
          point[1] > DIMENSIONS.marginTop && point[1] < boundedHeight - 50;

        /* 
          Getting the transformations arguments from the new and the previous
          transforms objects, in order to apply it to currentXZoomState & currentYZoomState
          See https://github.com/d3/d3-zoom#transform_translate
          && https://github.com/d3/d3-zoom#transform_scale for details

        */
        isZoomingX &&
          setCurrentXZoomState(
            currentXZoomState
              .translate((newX - prevX) / prevK, 0)
              .scale(newK / prevK)
          );
        isZoomingY &&
          setCurrentYZoomState(
            currentYZoomState
              .translate(0, (newY - prevY) / prevK)
              .scale(newK / prevK)
          );

        // Keeping track of the previous transform object
        setCurrentGlobalZoomState(event.transform);
      });

    svg.call(zoomGlobal);

    resetListener.on("contextmenu ", (e) => {
      e.preventDefault();
      svg.call(zoomGlobal.transform, zoomIdentity);
      setCurrentGlobalZoomState(zoomIdentity);
      setCurrentXZoomState(zoomIdentity);
      setCurrentYZoomState(zoomIdentity);
    });

    return () => {
      resetListener.on("contextmenu ", null);
    };
  }, [
    boundedWidth,
    boundedHeight,
    currentXZoomState,
    currentYZoomState,
    currentGlobalZoomState,
    xScale,
    yScale
  ]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }} className="w-full h-full">
        <Chart dimensions={updatedDimensions} svgRef={svgRef}>
          <XAxis scale={xScale} />
          <YAxis scale={yScale} />
          <g clipPath="url(#clip)">
            <Line xScale={xScale} yScale={yScale} data={data} />
          </g>
          {/* <rect
            className="reset-listening-rect"
            width={dimensions.width}
            height={dimensions.height}
            x={-DIMENSIONS.marginLeft}
            y={-DIMENSIONS.marginTop}
            fill="transparent"
          /> */}
        </Chart>
      </div>
    </React.Fragment>
  );
};

export default LineChart;
