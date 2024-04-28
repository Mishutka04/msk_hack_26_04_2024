import React, {Component} from "react";
import Plot from "react-plotly.js";
export default class PiePlot extends Component{
  render() {
    return(
      <div>
        <h1>
          PeiPlot
        </h1>
        <Plot
        data = {[{
            values: [3,7],
            labels: ['Негатив','Позитив'],
            type: "pie",
            mode: "lines",
            marker: {color: 'yellow'}
        }]}
        layout = {{width: 500, height:500, title: 'Классификация Позитивная/Неганивная'}}
        ></Plot>
      </div>
    );
  }
}