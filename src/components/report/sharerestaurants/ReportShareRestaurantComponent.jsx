import React, { Component } from "react";
import { Row, Radio, DatePicker } from "antd";
import LineChart from "./LineChart";
import API from "../../../helpers/api.js";
import moment from "moment";

const RadioGroup = Radio.Group;
const { MonthPicker } = DatePicker;
moment.locale("en");

class ReportShareRestaurantComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: [],
      shareData: [],
      value: 0,
      day: moment()
    };
  }

  componentDidMount() {
    this.loadAllShare(`day/${moment(this.state.day).format("YYYY-MM-DD")}`);
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
      this.loadAllShare(`day/${moment(day).format("YYYY-MM-DD")}`);
    } else if (value === 1) {
      this.loadAllShare(`month/${moment(day).format("YYYY-MM-DD")}`);
    } else {
      this.loadAllShare(`year/${moment(day).format("YYYY-MM-DD")}`);
    }
  };

  loadAllShare = async url => {
    const share = await API.get(`/restaurants/report/share/chart/${url}`);
    const data = await share.data.data;

    let label = [];
    let shareData = [];

    data.forEach((item, index) => {
      const fullName = item.res_name
      label = [...label, fullName]
      shareData = [...shareData, item.Share]
    });

    this.setState({
      label: label,
      shareData: shareData 
    });
  };

  render() {
    const { label, shareData, value, day } = this.state;
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
              share={shareData}
            />
          )}
        </Row>
      </div>
    );
  }
}

export default ReportShareRestaurantComponent;
