import React, { Component } from "react";
import { Table, Row, Col, Icon, Modal, message, Divider, Button } from "antd";
import API from "../../helpers/api.js";
import moment from "moment";
import "moment/locale/th";

import CreateExpenseComponent from "./CreateExpenseComponent";
import EditExpenseComponent from "./EditExpenseComponent";

moment.locale("th");

const confirm = Modal.confirm;

class ExpensesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expenses: [],
      deleteId: [],
      selectedRowKeys: [],
      loading: true
    };

    this.columns = [
      {
        title: "Expense",
        dataIndex: "exp_name"
      },
      {
        title: "Details",
        dataIndex: "exp_details"
      },
      {
        title: "Total",
        dataIndex: "exp_price",
        render: (text, record) => parseFloat(text).toFixed(2)
      },
      {
        title: "Date",
        dataIndex: "exp_date",
        render: (text, record) => moment(text).format("YYYY-MM-DD")
      },
      {
        title: "Edit",
        className: "column-actions",
        render: (text, record) => (
          <EditExpenseComponent
            data={record}
            expId={record.exp_id}
            expName={`${record.exp_name} ${moment(record.exp_date).fromNow()}`}
            setLoading={this.setLoading}
            updateRow={this.updateRowFilter}
          />
        )
      },
      {
        title: "Delete",
        className: "column-actions",
        render: (text, record, index) => (
          <Icon
            type="close"
            style={{ cursor: "pointer" }}
            onClick={() => this.askForDeleteExpense(record.exp_id)}
          />
        )
      }
    ];
  }

  componentDidMount() {
    this.loadExpensesById();
  }

  loadExpensesById = async () => {
    const expenses = await API.get("/expenses/");
    const { data } = await expenses;

    this.setState({
      expenses: data.data,
      loading: false
    });
  };

  setLoading = data => {
    this.setState({
      loading: data
    });
  };

  updateRow = data => {
    const { expenses } = this.state;
    const newExpenses = [...expenses, data];

    this.setState({
      expenses: newExpenses,
      loading: false
    });
  };

  updateRowFilter = data => {
    const { expenses } = this.state;
    const newExpenses = expenses.map(item => {
      if (item.exp_id === data.exp_id) {
        return data;
      }
      return item;
    });

    this.setState({
      expenses: newExpenses,
      loading: false
    });
  };

  askForDeleteExpense = expId => {
    confirm({
      title: "Are you sure delete this expense?",
      content: "please choose some choice.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.setState(
          {
            loading: true
          },
          () => this.deleteExpensesById(expId)
        );
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  };

  deleteExpensesById = async expId => {
    await API.post("/expenses/delete", { expId: expId })
      .then(() => {
        const { expenses } = this.state;
        const newExpenses = expenses.filter(item => item.exp_id !== expId);
        this.setState({
          expenses: newExpenses,
          loading: false
        });
        message.success("Delete expense Success");
      })
      .catch(err => {
        message.error("Something has wrong :(");
        this.setState({
          loading: false
        });
      });
  };

  showDeleteCheckConfirm = async () => {
    const { deleteId, expenses } = this.state;
    confirm({
      title: "Are you sure delete these expense?",
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
            await API.post("/expenses/delete", { expId: deleteId })
              .then(() => {
                const newExpenses = expenses.filter(oldAcc => {
                  const checkElement = deleteId.includes(oldAcc.exp_id);
                  if (!checkElement) {
                    return oldAcc;
                  }
                });
                const filterExpenses = newExpenses.filter(
                  item => typeof item !== "undefined"
                );
                this.setState({
                  expenses: filterExpenses,
                  deleteId: [],
                  loading: false
                });
                message.success("Delete expense Success");
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

  render() {
    const { expenses, loading, deleteId, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
        const getId = selectedRows.map(item => item.exp_id);
        this.setState({
          deleteId: getId,
          selectedRowKeys: selectedRowKeys
        });
      }
    };
    return (
      <div>
        <h3>Manage Expense</h3>
        <Divider />
        <Row>
          <Col span={12}>
            <CreateExpenseComponent
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
          <Col span={24}>
            <div style={{ overflowX: "auto" }}>
              <Table
                pagination={{ pageSize: 10 }}
                rowSelection={rowSelection}
                columns={this.columns}
                rowKey="res_id"
                dataSource={expenses}
                loading={loading}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ExpensesComponent;
