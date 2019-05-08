import React, { Component } from "react";
import { Radio, DatePicker, Row } from "antd";
import API from "../../../helpers/api.js";
import Loading from "../../loaders/loading";
import moment from "moment";
import "moment/locale/th";

import LineChart from "./LineChart";
moment.locale("en");

const RadioGroup = Radio.Group;
const { MonthPicker } = DatePicker;

class ReportLedgerComponent extends Component {
  state = { label: [], data: [], value: 0, day: moment(), loading: true };

  componentDidMount() {
    this.loadReportLedgerByDay();
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
    const { value } = this.state;
    if (value === 0) {
      this.loadReportLedgerByDay();
    } else if (value === 1) {
      this.loadReportLedgerByMonth();
    } else {
      this.loadReportLedgerByYear();
    }
  };

  loadReportLedgerByDay = async () => {
    const { day } = this.state;
    const format = moment(day).format("YYYY-MM-DD");
    const ledgerReport = await API.get(`/accounts/report/total/day/${format}`);
    const expenseReport = await API.get(`/expenses/report/total/day/${format}`);
    const revData = await ledgerReport.data;
    const expData = await expenseReport.data;

    const label = ["Revenue", "Expense"];
    const totalData = [revData.total.total, expData.total.total];

    this.setState({
      label: label,
      data: totalData,
      loading: false
    });
  };

  loadReportLedgerByMonth = async () => {
    const { day } = this.state;
    const format = moment(day).format("YYYY-MM-DD");
    const ledgerReport = await API.get(
      `/accounts/report/total/month/${format}`
    );
    const expenseReport = await API.get(
      `/expenses/report/total/month/${format}`
    );
    const revData = await ledgerReport.data;
    const expData = await expenseReport.data;

    const label = ["Revenue", "Expense"];
    const totalData = [revData.total.total, expData.total.total];

    this.setState({
      label: label,
      data: totalData,
      loading: false
    });
  };

  loadReportLedgerByYear = async () => {
    const { day } = this.state;
    const format = moment(day).format("YYYY-MM-DD");
    const ledgerReport = await API.get(`/accounts/report/total/year/${format}`);
    const expenseReport = await API.get(
      `/expenses/report/total/year/${format}`
    );
    const revData = await ledgerReport.data;
    const expData = await expenseReport.data;

    const label = ["Revenue", "Expense"];
    const totalData = [revData.total.total, expData.total.total];

    this.setState({
      label: label,
      data: totalData,
      loading: false
    });
  };
  render() {
    const { label, data, day, value, loading } = this.state;
    if (loading) return <Loading loaded={loading} />;
    return (
      <div>
        <Row>
          <RadioGroup onChange={this.onChange} value={value}>
            <Radio value={0}>Day</Radio>
            <Radio value={1}>Month</Radio>
            <Radio value={2}>Year</Radio>
          </RadioGroup>
        </Row>
        <Row style={{ marginTop: 20 }}>
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
            />
          )}
        </Row>
        <Row style={{ marginTop: 20 }}>
          <LineChart label={label} data={data} />
        </Row>
      </div>
    );
  }
}

export default ReportLedgerComponent;
