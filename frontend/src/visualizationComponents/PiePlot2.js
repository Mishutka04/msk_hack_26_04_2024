import React, {Component} from "react";
import Plot from "react-plotly.js";
export default class PiePlot2 extends Component{
  render() {
    return(
      <div>
        <h1>
          PeiPlot
        </h1>
        <Plot
        data = {[{
            values: [3,7],
            labels: ['Информ','Не информ'],
            type: "pie",
            mode: "lines",
            marker: {color: 'red'}
        }]}
        layout = {{width: 550, height:500, title: 'Классификация Информативная/Неинформативная'}}
        ></Plot>
      </div>
    );
  }
}