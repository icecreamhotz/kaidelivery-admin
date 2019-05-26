import React, { Component } from "react";
import { Row, Radio, DatePicker } from "antd";
import LineChart from "./LineChart";
import API from "../../../helpers/api.js";
import moment from "moment";

const RadioGroup = Radio.Group;
const { MonthPicker } = DatePicker;
moment.locale("en");

class EmployeeSalaryComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: [],
      salaryData: [],
      value: 0,
      day: moment()
    };
  }

  componentDidMount() {
    this.loadAllSalary(`day/${moment(this.state.day).format("YYYY-MM-DD")}`);
  }

  onChange = e => {
    this.setState(
      {
        value: e.target.value
      },
      () => this.decitionChoice()
    );
  };

  onChangeDay = (date, dateString) => {
    this.setState(
      {
        day: date
      },
      () => this.decitionChoice()
    );
  };

  decitionChoice = () => {
    const { value, day } = this.state;
    if (value === 0) {
      this.loadAllSalary(`day/${moment(day).format("YYYY-MM-DD")}`);
    } else if (value === 1) {
      this.loadAllSalary(`month/${moment(day).format("YYYY-MM-DD")}`);
    } else {
      this.loadAllSalary(`year/${moment(day).format("YYYY-MM-DD")}`);
    }
  };

  loadAllSalary = async url => {
    console.log(url);
    const salary = await API.get(`/employees/report/salary/chart/${url}`);
    const data = await salary.data.data;

    let label = [];
    let salaryData = [];

    data.forEach((item, index) => {
      const fullName = `${item.emp_name} ${item.emp_lastname}`;
      label = [...label, fullName];
      salaryData = [...salaryData, item.Salary]
    });

    this.setState({
      label: label,
      salaryData: salaryData 
    });
  };

  render() {
    const { label, salaryData, value, day } = this.state;
    return (
      <div>
        <Row
          style={{
            paddingTop: 15
          }}
        >
          <RadioGroup onChange={this.onChange} value={value}>
            <Radio value={0}>Day</Radio>
            <Radio value={1}>Month</Radio>
            <Radio value={2}>Year</Radio>
          </RadioGroup>
        </Row>
        <Row style={{ paddingTop: 15 }}>
          {value === 0 && (
            <DatePicker onChange={this.onChangeDay} defaultValue={day} />
          )}
          {value === 1 && (
            <MonthPicker
              onChange={this.onChangeDay}
              defaultValue={day}
              format="MMMM"
            />
          )}
          {value === 2 && (
            <DatePicker
              mode="year"
              onChange={this.onChangeDay}
              defaultValue={day}
              format="YYYY"
              onPanelChange={this.onChangeDay}
            />
          )}
        </Row>
        <Row
          style={{
            paddingTop: 15
          }}
        >
          {label.length > 0 && (
            <LineChart
              label={label}
              salary={salaryData}
            />
          )}
        </Row>
      </div>
    );
  }
}

export default EmployeeSalaryComponent;
