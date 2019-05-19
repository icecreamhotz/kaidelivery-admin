import React, { Component } from "react";
import { Row, Col, Radio, Button, DatePicker } from "antd";
import LineChart from "./LineChart";
import API from "../../../helpers/api.js";
import moment from "moment";

const RadioGroup = Radio.Group;
const { MonthPicker } = DatePicker;
moment.locale("en");

class ReportIncomesChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: [],
      incomeData: [],
      debtData: [],
      payedData: [],
      value: 0,
      day: moment()
    };
  }

  componentDidMount() {
    this.loadAllIncomes(`day/${moment(this.state.day).format("YYYY-MM-DD")}`);
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
      this.loadAllIncomes(`day/${moment(day).format("YYYY-MM-DD")}`);
    } else if (value === 1) {
      this.loadAllIncomes(`month/${moment(day).format("YYYY-MM-DD")}`);
    } else {
      this.loadAllIncomes(`year/${moment(day).format("YYYY-MM-DD")}`);
    }
  };

  loadAllIncomes = async url => {
    const incomes = await API.get(`/incomes/report/income/chart/${url}`);
    const data = await incomes.data.data;

    let label = [];
    let incomeData = [];
    let debt = [];
    let payed = [];

    data.forEach((item, index) => {
      const fullName = `${item.emp_name} ${item.emp_lastname}`;
      label = [...label, fullName];
      incomeData = [...incomeData, item.Incomes];
      debt = [...debt, item.Debt];
      payed = [...payed, item.Payed];
    });

    this.setState({
      label: label,
      incomeData: incomeData,
      debtData: debt,
      payedData: payed
    });
  };

  render() {
    const { changeComponent } = this.props;
    const { label, incomeData, debtData, payedData, value, day } = this.state;
    return (
      <div>
        <Row>
          <Button
            type="primary"
            icon="table"
            onClick={() => changeComponent(0)}
          >
            View Table
          </Button>
        </Row>
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
              incomes={incomeData}
              debt={debtData}
              payed={payedData}
            />
          )}
        </Row>
      </div>
    );
  }
}

export default ReportIncomesChart;
