import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

const options = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        stacked: true
      }
    ],
    yAxes: [
      {
        stacked: true
      }
    ]
  }
};

class LineChart extends Component {
  render() {
    const { label, data } = this.props;
    const dataBar = {
      labels: label,
      datasets: [
        {
          label: "Total",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)"
          ]
        }
      ]
    };
    return (
      <div>
        <Bar
          data={dataBar}
          options={options}
          ref={ref => (this.Bar = ref)}
          height={500}
          width={700}
        />
      </div>
    );
  }
}

export default LineChart;
