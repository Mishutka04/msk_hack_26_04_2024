import React, {Component} from "react";
import Plot from "react-plotly.js";
export default class PiePlot3 extends Component{
  render() {
    return(
      <div>
        <h1>
          PeiPlot
        </h1>
        <Plot
        data = {[{
            values: [3,7,5],
            labels: ['Вебинар','Программа', 'Преподаватель'],
            type: "pie",
            mode: "lines",
            marker: {color: 'red'}
        }]}
        layout = {{width: 530, height:500, title: 'Принадлежность комментария к определённой сущности'}}
        ></Plot>
      </div>
    );
  }
}