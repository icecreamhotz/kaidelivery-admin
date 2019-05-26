import React, { Component } from "react";
import {
  Divider,
  Table,
  Typography,
  Avatar,
  Row,
  Col,
  Badge,
  Radio,
  DatePicker,
  Button
} from "antd";
import DetailsIncomesComponent from "./DetailsIncomesComponent.js";
import ReportIncomeChart from "./ReportIncomesChart";
import moment from "moment";
import "moment/locale/th";

import API from "../../../helpers/api.js";
import "./income.scss";

moment.locale("th");

const { Text } = Typography;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

class EmployeeIncomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      income: [],
      filterChoice: 2,
      component: 0,
      loading: true
    };

    this.columns = [
      {
        title: "Name",
        key: "name",
        render: (text, record) => (
          <Text strong>{`${text.emp_name} ${text.emp_lastname}`}</Text>
        )
      },
      {
        title: "Telephone",
        dataIndex: "emp_telephone",
        key: "telephone",
        render: text => text
      },
      {
        title: "ID Card",
        dataIndex: "emp_idcard",
        key: "idcard",
        render: text => text
      },
      {
        title: "Avatar",
        key: "avatar",
        dataIndex: "emp_avatar",
        render: text => {
          const profile = text === null ? "noimg.png" : text;
          return <Avatar src={`https://kaidelivery-api.herokuapp.com/employees/${profile}`} />;
        }
      },
      {
        title: "Income",
        key: "income",
        dataIndex: "Incomes",
        render: text => {
          return (
            <div className="f-weight">
              {text === null ? 0.0 : parseFloat(text).toFixed(2)}
            </div>
          );
        },
        className: "column-money"
      },
      {
        title: "Debt",
        key: "debt",
        dataIndex: "Debt",
        render: text => {
          return (
            <div className="f-debt">
              {text === null ? 0.0 : parseFloat(text).toFixed(2)}
            </div>
          );
        },
        className: "column-money"
      },
      {
        title: "Payed",
        key: "payed",
        dataIndex: "Payed",
        render: text => {
          return (
            <div className="f-payed">
              {text === null ? 0.0 : parseFloat(text).toFixed(2)}
            </div>
          );
        },
        className: "column-money"
      }
    ];
  }

  componentDidMount() {
    this.loadIncomeByEmployeeAndAll();
  }

  loadIncomeByEmployeeAndAll = async () => {
    const incomes = await API.get("/incomes/");
    const { data } = await incomes;

    const incomesData = await data.data;

    this.setState({
      income: incomesData,
      loading: false
    });
  };

  setNewDataAfterChangeSomeStatus = (empId, newData, newDebt, newPayed) => {
    const { income } = this.state;

    const newIncomes = income.map(inc => {
      if (inc.emp_id === empId) {
        return {
          ...inc,
          Debt: newDebt,
          Payed: newPayed,
          incomes: newData
        };
      }
      return inc;
    });

    this.setState({
      income: newIncomes
    });
  };

  onRangePickerChange = async (date, dateString) => {
    this.setState({
      loading: false
    });

    const { filterChoice } = this.state;
    const getDate = dateString;

    let incomesData;

    console.log(filterChoice);

    switch (filterChoice) {
      case 0:
        const incomesPayed = await API.get(
          `/incomes/report/income/range/${getDate[0]}/${getDate[1]}`
        );
        const incomesDataPayed = await incomesPayed.data.data;
        const filterDataPayed = incomesDataPayed.map(inc => {
          if (inc.incomes.length > 0) {
            const filterIncomes = inc.incomes.filter(
              item => item.inc_status === "1"
            );
            return { ...inc, incomes: filterIncomes };
          }
          return inc;
        });
        incomesData = filterDataPayed;
        break;
      case 1:
        const incomesDebt = await API.get(
          `/incomes/report/income/range/${getDate[0]}/${getDate[1]}`
        );
        const incomesDataDebt = await incomesDebt.data.data;
        const filterDataDebt = incomesDataDebt.map(inc => {
          if (inc.incomes.length > 0) {
            const filterIncomes = inc.incomes.filter(
              item => item.inc_status === "0"
            );
            return { ...inc, incomes: filterIncomes };
          }
          return inc;
        });
        incomesData = filterDataDebt;
        break;
      case 2:
        const incomesAll = await API.get(
          `/incomes/report/income/range/${getDate[0]}/${getDate[1]}`
        );
        const incomesDataAll = await incomesAll.data.data;
        incomesData = incomesDataAll;
        break;
      default:
        break;
    }

    this.setState({
      income: incomesData
    });
  };

  onChangeFilterChoice = e => {
    this.setState(
      {
        loading: true,
        filterChoice: e.target.value
      },
      () => this.decideFilterChoice()
    );
  };

  loadPayed = async () => {
    this.setState({
      loading: true
    });
    const incomes = await API.get("/incomes/payed");
    const { data } = await incomes;

    const incomesData = await data.data;

    this.setState({
      income: incomesData,
      loading: false
    });
  };

  loadDebtId = async () => {
    this.setState({
      loading: true
    });
    const incomes = await API.get("/incomes/debt");
    const { data } = await incomes;

    const incomesData = await data.data;

    this.setState({
      income: incomesData,
      loading: false
    });
  };

  decideFilterChoice = () => {
    const { filterChoice } = this.state;

    switch (filterChoice) {
      case 0:
        this.loadPayed();
        break;
      case 1:
        this.loadDebtId();
        break;
      case 2:
        this.loadIncomeByEmployeeAndAll();
        break;
      default:
        break;
    }
  };

  setStateComponent = component => {
    this.setState({
      component: component
    });
  };

  render() {
    const { income, loading, filterChoice, component } = this.state;
    const addMonth = moment()
      .add(1, "month")
      .toDate();
    return (
      <div>
        <h3>Employee Income</h3>
        <Divider />
        {component === 0 && (
          <Row>
            <Button
              type="primary"
              icon="bar-chart"
              onClick={() => this.setStateComponent(1)}
            >
              View Chart
            </Button>
            <Row
              style={{
                paddingTop: 15
              }}
            >
              <Col span={12}>
                <RangePicker
                  defaultValue={[moment(), moment(addMonth)]}
                  format={"YYYY-MM-DD"}
                  onChange={this.onRangePickerChange}
                />
              </Col>
              <Col span={12} align="right">
                <RadioGroup
                  onChange={this.onChangeFilterChoice}
                  value={filterChoice}
                >
                  <Radio value={0}>Payed</Radio>
                  <Radio value={1}>Debt</Radio>
                  <Radio value={2}>All</Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row
              style={{
                paddingTop: 15
              }}
            >
              <Col align="right">
                <Badge
                  status="processing"
                  text="Processing"
                  style={{
                    marginRight: 15
                  }}
                />
                <Badge status="success" text="Success" />
              </Col>
            </Row>
            <Table
              rowKey={record => record.emp_id}
              columns={this.columns}
              dataSource={income}
              expandedRowRender={(record, index, indent, expaned) =>
                expaned ? (
                  <DetailsIncomesComponent
                    emp_id={record.emp_id}
                    debt={record.Debt === null ? 0 : record.Debt}
                    payed={record.Payed === null ? 0 : record.Payed}
                    details={record.incomes}
                    setNewDataAfterChangeSomeStatus={
                      this.setNewDataAfterChangeSomeStatus
                    }
                  />
                ) : null
              }
              loading={loading}
            />
          </Row>
        )}
        {component === 1 && (
          <ReportIncomeChart changeComponent={this.setStateComponent} />
        )}
      </div>
    );
  }
}

export default EmployeeIncomeComponent;
