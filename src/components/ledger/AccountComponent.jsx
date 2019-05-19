import React, { Component } from "react";
import {
  Table,
  Row,
  Col,
  Icon,
  Modal,
  message,
  Divider,
  Button,
  Tooltip,
  DatePicker,
  Radio
} from "antd";
import API from "../../helpers/api.js";
import moment from "moment";
import "moment/locale/th";

import CreateAccountComponent from "./CreateAccountComponent";
import EditAccountComponent from "./EditAccountComponent";
import WrapperTable from "./WrapperTable";
import "./table.scss";

moment.locale("th");

const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

class AccountComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ledger: [],
      deleteId: [],
      selectedRowKeys: [],
      loading: true,
      filterChoice: 2
    };

    this.columns = [
      {
        title: "Header",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Details",
        dataIndex: "details",
        key: "details"
      },
      {
        title: "Total",
        className: "column-price",
        dataIndex: "price",
        key: "price",
        render: (text, record) => {
          return (
            <Tooltip title={record.type === "0" ? "Revenue" : "Expenses"}>
              <span style={{ marginRight: 10 }}>
                {parseFloat(text).toFixed(2)}
              </span>
              <Icon
                type={record.type === "0" ? "arrow-up" : "arrow-down"}
                style={{ color: record.type === "0" ? "#52c41a" : "#fc2340" }}
              />
            </Tooltip>
          );
        }
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (text, record) => moment(text).format("YYYY-MM-DD")
      },
      {
        title: "Edit",
        className: "column-actions",
        key: "edit",
        render: (text, record) => (
          <EditAccountComponent
            data={record}
            setLoading={this.setLoading}
            updateRow={this.updateRowFilter}
          />
        )
      },
      {
        title: "Delete",
        className: "column-actions",
        key: "delete",
        render: (text, record, index) => (
          <Icon
            type="close"
            style={{ cursor: "pointer" }}
            onClick={() => this.askForDeleteAccount(record.id, record.type)}
          />
        )
      }
    ];
  }

  componentDidMount() {
    this.loadLedger();
  }

  loadLedger = async () => {
    const accounts = await API.get("/accounts/");
    const accountsData = await accounts.data.data;
    const expenses = await API.get("/expenses/");
    const expensesData = await expenses.data.data;

    const mapAccountsData = accountsData.map(acc => {
      return { ...acc, type: "0", key: acc.id + acc.type };
    });

    const mapExpensesData = expensesData.map(exp => {
      return { ...exp, type: "1", key: exp.id + exp.type };
    });

    const mergeData = mapAccountsData.concat(mapExpensesData).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    this.setState({
      ledger: mergeData,
      loading: false
    });
  };

  decideFilterChoice = () => {
    const { filterChoice } = this.state;

    switch (filterChoice) {
      case 0:
        this.loadAccountById();
        break;
      case 1:
        this.loadExpensesById();
        break;
      case 2:
        this.loadLedger();
        break;
      default:
        break;
    }
  };

  loadAccountById = async () => {
    const accounts = await API.get("/accounts/");
    const accountsData = await accounts.data.data;
    const mapAccountsData = accountsData.map(acc => {
      return { ...acc, type: "0", key: acc.id + acc.type };
    });

    this.setState({
      ledger: mapAccountsData,
      loading: false
    });
  };

  loadExpensesById = async () => {
    const expenses = await API.get("/expenses/");
    const expensesData = await expenses.data.data;
    const mapExpensesData = expensesData.map(exp => {
      return { ...exp, type: "1", key: exp.id + exp.type };
    });

    this.setState({
      ledger: mapExpensesData,
      loading: false
    });
  };

  setLoading = data => {
    this.setState({
      loading: data
    });
  };

  updateRow = data => {
    const { ledger } = this.state;
    const newLedgers = [...ledger, data].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    this.setState({
      ledger: newLedgers,
      loading: false
    });
  };

  updateRowFilter = data => {
    const { ledger } = this.state;
    const newLedgers = ledger
      .map(item => {
        if (item.id === data.id && item.type === data.oldType) {
          return data;
        }
        return item;
      })
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    console.log(newLedgers);
    this.setState({
      ledger: newLedgers,
      loading: false
    });
  };

  askForDeleteAccount = (Id, typeId) => {
    confirm({
      title: "Are you sure delete this ledger?",
      content: "please choose some choice.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.setState(
          {
            loading: true
          },
          () => this.deleteLedgerList(Id, typeId)
        );
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  };

  deleteLedgerList = async (Id, typeId) => {
    const url = typeId === "0" ? "/accounts/delete" : "/expenses/delete";
    await API.post(url, { id: Id })
      .then(() => {
        const { ledger } = this.state;
        const newLedger = ledger
          .filter(item => item.id !== Id && item.type === typeId)
          .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
        this.setState({
          ledger: newLedger,
          loading: false
        });
        message.success("Delete ledger Success");
      })
      .catch(err => {
        message.error("Something has wrong :(");
        this.setState({
          loading: false
        });
      });
  };

  showDeleteCheckConfirm = async () => {
    const { deleteId, accounts } = this.state;
    confirm({
      title: "Are you sure delete these account?",
      content: "please choose some choice.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.setState(
          {
            loading: true
          },
          async () => {
            await API.post("/accounts/delete", { accId: deleteId })
              .then(() => {
                const newAccounts = accounts.filter(oldAcc => {
                  const checkElement = deleteId.includes(oldAcc.acc_id);
                  if (!checkElement) {
                    return oldAcc;
                  }
                });
                const filterAccount = newAccounts.filter(
                  item => typeof item !== "undefined"
                );
                this.setState({
                  accounts: filterAccount,
                  deleteId: [],
                  loading: false
                });
                message.success("Delete account Success");
              })
              .catch(err => {
                message.error("Something has wrong :(");
                this.setState({
                  loading: false
                });
              });
          }
        );
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  };

  onRangePickerChange = async (date, dateString) => {
    const { filterChoice } = this.state;
    const getDate = dateString;

    let accounts;
    let accountsData;

    let expenses;
    let expensesData;

    let mapAccountsData;
    let mapExpensesData;
    let mergeData;

    let data;

    switch (filterChoice) {
      case 0:
        accounts = await API.get(
          `/accounts/report/total/range/${getDate[0]}/${getDate[1]}`
        );
        accountsData = await accounts.data.data;
        mapAccountsData = accountsData.map(acc => {
          return { ...acc, type: "0", key: acc.id + acc.type };
        });

        break;
      case 1:
        expenses = await API.get(
          `/expenses/report/total/range/${getDate[0]}/${getDate[1]}`
        );
        expensesData = await expenses.data.data;
        mapExpensesData = expensesData.map(exp => {
          return { ...exp, type: "1", key: exp.id + exp.type };
        });

        break;
      case 2:
        accounts = await API.get(
          `/accounts/report/total/range/${getDate[0]}/${getDate[1]}`
        );
        accountsData = await accounts.data.data;
        expenses = await API.get(
          `/expenses/report/total/range/${getDate[0]}/${getDate[1]}`
        );
        expensesData = await expenses.data.data;
        mapAccountsData = accountsData.map(acc => {
          return { ...acc, type: "0", key: acc.id + acc.type };
        });

        mapExpensesData = expensesData.map(exp => {
          return { ...exp, type: "1", key: exp.id + exp.type };
        });

        mergeData = mapAccountsData.concat(mapExpensesData).sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        break;
      default:
        break;
    }

    if (filterChoice === 0) {
      data = mapAccountsData;
    } else if (filterChoice === 1) {
      data = mapExpensesData;
    } else {
      data = mergeData;
    }

    this.setState({
      ledger: data,
      loading: false
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

  render() {
    const {
      ledger,
      loading,
      deleteId,
      selectedRowKeys,
      filterChoice
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
        const getId = selectedRows.map(item => item.acc_id);
        this.setState({
          deleteId: getId,
          selectedRowKeys: selectedRowKeys
        });
      }
    };
    const addMonth = moment()
      .add(1, "month")
      .toDate();
    return (
      <div>
        <h3>Manage Account</h3>
        <Divider />
        <Row>
          <Col span={12}>
            <CreateAccountComponent
              setLoading={this.setLoading}
              updateRow={this.updateRow}
            />
          </Col>
          <Col span={12} align="right">
            {deleteId.length > 0 && (
              <Button
                className="button-delete"
                icon="delete"
                ghost={true}
                onClick={this.showDeleteCheckConfirm}
              >
                Delete
              </Button>
            )}
          </Col>
        </Row>
        <Row style={{ paddingTop: 25 }}>
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
              <Radio value={0}>Revenue</Radio>
              <Radio value={1}>Expenses</Radio>
              <Radio value={2}>All</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row style={{ paddingTop: 25 }}>
          <Col span={24}>
            <div style={{ overflowX: "auto" }}>
              <Table
                components={{ body: { wrapper: WrapperTable } }}
                rowSelection={rowSelection}
                columns={this.columns}
                rowKey="res_id"
                dataSource={ledger}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"]
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AccountComponent;
