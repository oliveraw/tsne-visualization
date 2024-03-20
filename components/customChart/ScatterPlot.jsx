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
import * as d3 from "d3";

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

function getClasses(data) {
    const classes = new Set()
    data.forEach((d) => classes.add(d.class))
    return Array.from(classes)
}

const ScatterPlot = ({ data, updateImage, id = "myZoomableScatterPlot" }) => {
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

    const xmax = data.reduce(function (prev, current) {
        return (prev && prev.x > current.x) ? prev : current
    }).x
    const xmin = data.reduce(function (prev, current) {
        return (prev && prev.x < current.x) ? prev : current
    }).x
    const ymax = data.reduce(function (prev, current) {
        return (prev && prev.y > current.y) ? prev : current
    }).y
    const ymin = data.reduce(function (prev, current) {
        return (prev && prev.y < current.y) ? prev : current
    }).y
    const xScale = scaleLinear()
        .domain([xmin, xmax])
        .range([innerPadding, boundedWidth - innerPadding]);

    const yScale = scaleLinear()
        .domain([ymin, ymax])
        .range([boundedHeight - innerPadding, innerPadding]);

    if (currentXZoomState) {
        const newXScale = currentXZoomState.rescaleX(xScale);
        xScale.domain(newXScale.domain());
    }

    if (currentYZoomState) {
        const newYScale = currentYZoomState.rescaleY(yScale);
        yScale.domain(newYScale.domain());
    }

    const allClasses = getClasses(data)
    const [hovered, setHovered] = useState(0)
    const [displayClasses, setDisplayClasses] = useState(allClasses)
    const color = d3.scaleOrdinal(allClasses, d3.schemePaired)

    function toggleDisplayClass(c) {
        if (displayClasses.includes(c)) {
            setDisplayClasses(displayClasses.filter((item) => (item !== c)))
        } else {
            setDisplayClasses(displayClasses => [...displayClasses, c])
        }
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


    const xLowerDisplayBound = xScale.domain()[0]
    const xUpperDisplayBound = xScale.domain()[1]
    const yLowerDisplayBound = yScale.domain()[0]
    const yUpperDisplayBound = yScale.domain()[1]

    return (
        <React.Fragment>
            <div className="h-full w-full">
                <div className="font-bold">USGS TSNE Visualization - Final Layer Resnet Features After Training, Hollow Circles = Noisy</div>
                <div>Hover a point to see the corresponding image, scroll to zoom -- zooming may decrease your lag as less points will be rendered</div>
                <div ref={wrapperRef}>
                    <Chart dimensions={updatedDimensions} svgRef={svgRef}>
                        <XAxis scale={xScale} />
                        <YAxis scale={yScale} />
                        <g fill="white" stroke="currentColor" strokeWidth="1.5">
                            {data.filter((d) => (d.x > xLowerDisplayBound && d.x < xUpperDisplayBound && d.y > yLowerDisplayBound && d.y < yUpperDisplayBound))
                                .filter((d) => displayClasses.includes(d.class))
                                .map((d, i) => {
                                    return <circle
                                        key={i}
                                        cx={xScale(d.x)}
                                        cy={yScale(d.y)}
                                        r={hovered == i ? "4" : "2"}
                                        stroke={hovered == i ? "black" : color(d.class)}
                                        fill={d.noisy ? "white" : color(d.class)}
                                        onMouseEnter={() => {
                                            console.log("touch start")
                                            updateImage(d.filepath, d.class)
                                            setHovered(i)
                                        }}
                                    />
                                })}
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
                <div class="flex flex-row gap-x-2 m-3">
                    <div>Toggle Classes:</div>
                    {allClasses.map((c, i) => {
                        const clr = `background-color: ${displayClasses.includes(c) ? color(c) : "#686363"};`
                        return <div
                            class="w-24 text-center rounded-md hover:border-black hover:border-2"
                            style={{ "background-color": displayClasses.includes(c) ? color(c) : "#686363" }}
                            onClick={() => toggleDisplayClass(c)}
                        >
                            {c}
                        </div>
                    })}
                </div>
            </div>
        </React.Fragment>
    );
};

export default ScatterPlot
