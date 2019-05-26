import React, { Component } from "react";
import { Row, Radio, DatePicker } from "antd";
import LineChart from "./LineChart";
import API from "../../../helpers/api.js";
import moment from "moment";

const RadioGroup = Radio.Group;
const { MonthPicker } = DatePicker;
moment.locale("en");

class ReportUserUsedTotal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: [],
      userData: [],
      value: 0,
      day: moment()
    };
  }

  componentDidMount() {
    this.loadAllUserTotal(`day/${moment(this.state.day).format("YYYY-MM-DD")}`);
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
      this.loadAllUserTotal(`day/${moment(day).format("YYYY-MM-DD")}`);
    } else if (value === 1) {
      this.loadAllUserTotal(`month/${moment(day).format("YYYY-MM-DD")}`);
    } else {
      this.loadAllUserTotal(`year/${moment(day).format("YYYY-MM-DD")}`);
    }
  };

  loadAllUserTotal = async url => {
    const used = await API.get(`/restaurants/report/user/chart/${url}`);
    const data = await used.data.data;

    let label = [];
    let userData = [];

    data.forEach((item, index) => {
      const fullName = item.res_name
      label = [...label, fullName];
      userData = [...userData, item.Total]
    });

    console.log(label);
    console.log(userData)

    this.setState({
      label: label,
      userData: userData 
    });
  };

  render() {
    const { label, userData, value, day } = this.state;
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
              user={userData}
            />
          )}
        </Row>
      </div>
    );
  }
}

export default ReportUserUsedTotal;
