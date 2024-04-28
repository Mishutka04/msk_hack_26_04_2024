import React, {Component} from "react";

import Plot from "react-plotly.js";
import PiePlot from "./visualizationComponents/PiePlot";
import PiePlot2 from "./visualizationComponents/PiePlot2";
import PiePlot3 from "./visualizationComponents/PiePlot3";
// import BoxPlot from "./visualizationComponents/BoxPlot";
// import HeatPlot from "./visualizationComponents/HeatPlot";
// import SubPlot from "./visualizationComponents/SubPlot";
// import TimePlot from "./visualizationComponents/TimePlot";



export default class DataVisualization extends Component{
  render() {
    return(
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        
      }}>
        {/* <h1>
          Bar Plot
        </h1>
        <Plot
        data = {[{
          x:[1,2,3],
          y:[3,2,1],
          type: "bar",
          mode: "lines",
          marker: {color: 'yellow'}
        }]}
        layout = {{width: 1000, height:500, title: 'Bar Plot'}}
        ></Plot> */}

        <PiePlot />
        <PiePlot2 />
        <PiePlot3 />

        {/* <h1>Box Plot</h1>
        <BoxPlot />

        <h1>Time Plot</h1>
        <TimePlot/>

        <h1>Heat Plot</h1>
        <HeatPlot/>

        <h1>SubPlot</h1>
        <SubPlot/> */}

      </div>
      
    );
  }
}