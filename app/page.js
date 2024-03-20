'use client'

import Image from "next/image";
import * as d3 from "d3";
import { useState } from "react";

// import data_json from "@/data_jsons/fake_data.json"
import data_json from "@/data_jsons/net1_tsne_data.json"
import TSNEScatterPlot from "@/components/oldTSNEScatterPlot";
import LineChart from "@/components/customChart/LineChart";
import ScatterPlot from "@/components/customChart/ScatterPlot";

export default function Home() {
    const data = data_json.data
    function getFullImagePath(filepath) {
        return `/images/${filepath}`
    }
    const [displayImage, setDisplayImage] = useState(getFullImagePath(data[0].filepath))
    const [displayClass, setDisplayClass] = useState(data[0].class)
    
    function updateImage(filepath, c) {
        setDisplayImage(getFullImagePath(filepath))
        setDisplayClass(c)
    }
    return (
        <div className="flex flex-row w-full justify-center">
            <div className="m-4">
                <ScatterPlot data={data} updateImage={updateImage} />
            </div>
            <div className="flex flex-col justify-center items-center">
                <div>{displayClass}</div>
                <Image
                    src={displayImage}
                    width={200}
                    height={200}
                    alt="image of the hovered point"
                />
            </div>
        </div>
    );
}
