import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";


function getClasses(data) {
    const classes = new Set()
    data.forEach((d) => classes.add(d.class))
    return Array.from(classes)
}

export default function TSNEScatterPlot({
    data,
    updateImage,
    width = 1200,
    height = 800,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 40
}) {
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

    const svgRef = useRef();
    const gx = useRef();
    const gy = useRef();
    const x = d3.scaleLinear([xmin, xmax], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear([ymin, ymax], [height - marginBottom, marginTop]);
    const line = d3.line((d, i) => x(i), y);
    useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
    useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

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

    return (
        <div>
            <div>USGS TSNE Visualization - Final Layer Resnet Features After Training, Hollow Circles = Noisy</div>
            <svg ref={svgRef} width={width} height={height}>
                <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
                <g ref={gy} transform={`translate(${marginLeft},0)`} />
                <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
                <g fill="white" stroke="currentColor" strokeWidth="1.5">
                    {data.filter((d) => displayClasses.includes(d.class))
                        .map((d, i) => {
                            return <circle
                                key={i}
                                cx={x(d.x)}
                                cy={y(d.y)}
                                r={hovered == i ? "4" : "2"}
                                stroke={hovered == i ? "black" : color(d.class)}
                                fill={d.noisy ? "white" : color(d.class)}
                                onMouseEnter={() => {
                                    updateImage(d.filepath, d.class)
                                    setHovered(i)
                                }}
                            />
                        })}
                </g>
            </svg>
            <div class="flex flex-row gap-x-2">
                <div>Toggle Classes:</div>
                {allClasses.map((c, i) => {
                    const clr = `background-color: ${displayClasses.includes(c) ? color(c) : "#686363"};`
                    return <div 
                        class="w-24 text-center rounded-md hover:border-black hover:border-2" 
                        style={{"background-color": displayClasses.includes(c) ? color(c) : "#686363"}} 
                        onClick={() => toggleDisplayClass(c)}
                    >
                        {c}
                    </div>
                })}
            </div>
        </div>
    );
}
// bg-[#33a02c], bg-[#fb9a99]