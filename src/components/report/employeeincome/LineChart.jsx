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
    const { label, incomes, debt, payed } = this.props;
    const incomesData = {
      label: "Incomes",
      data: incomes,
      backgroundColor: "rgb(31, 119, 226)",
      borderWidth: 0
    };

    const debtData = {
      label: "Debt",
      data: debt,
      backgroundColor: "rgb(247, 7, 83)",
      borderWidth: 0
    };

    const payedData = {
      label: "Payed",
      data: payed,
      backgroundColor: "rgb(76, 255, 82)",
      borderWidth: 0
    };

    const planetData = {
      labels: label,
      datasets: [incomesData, debtData, payedData]
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
