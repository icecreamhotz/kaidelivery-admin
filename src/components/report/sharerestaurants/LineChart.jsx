import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

const options = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  scales: {}
};

class LineChart extends Component {
  render() {
    const { label, share } = this.props;
    const shareData = {
      label: "Share",
      data: share,
      backgroundColor: "rgb(31, 119, 226)",
      borderWidth: 0
    };
    const planetData = {
      labels: label,
      datasets: [shareData]
    };
    return (
      <div>
        <Bar
          data={planetData}
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
