import React, { Component } from "react";
import { Table, Row, Col, Icon, Modal, message, Divider, Button } from "antd";
import API from "../../helpers/api.js";
import moment from "moment";
import "moment/locale/th";

import CreateAccountComponent from "./CreateAccountComponent";
import EditAccountComponent from "./EditAccountComponent";

moment.locale("th");

const confirm = Modal.confirm;

class AccountComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: [],
      deleteId: [],
      selectedRowKeys: [],
      loading: true
    };

    this.columns = [
      {
        title: "Account",
        dataIndex: "acc_name"
      },
      {
        title: "Details",
        dataIndex: "acc_details"
      },
      {
        title: "Total",
        dataIndex: "acc_price",
        render: (text, record) => parseFloat(text).toFixed(2)
      },
      {
        title: "Date",
        dataIndex: "acc_date",
        render: (text, record) => moment(text).format("YYYY-MM-DD")
      },
      {
        title: "Edit",
        className: "column-actions",
        render: (text, record) => (
          <EditAccountComponent
            data={record}
            accId={record.acc_id}
            accName={`${record.acc_name} ${moment(record.acc_date).fromNow()}`}
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
            onClick={() => this.askForDeleteAccount(record.acc_id)}
          />
        )
      }
    ];
  }

  componentDidMount() {
    this.loadAccountById();
  }

  loadAccountById = async () => {
    const accounts = await API.get("/accounts/");
    const { data } = await accounts;

    this.setState({
      accounts: data.data,
      loading: false
    });
  };

  setLoading = data => {
    this.setState({
      loading: data
    });
  };

  updateRow = data => {
    const { accounts } = this.state;
    const newAccounts = [...accounts, data];

    this.setState({
      accounts: newAccounts,
      loading: false
    });
  };

  updateRowFilter = data => {
    const { accounts } = this.state;
    const newAccounts = accounts.map(item => {
      if (item.acc_id === data.acc_id) {
        return data;
      }
      return item;
    });

    this.setState({
      accounts: newAccounts,
      loading: false
    });
  };

  askForDeleteAccount = accId => {
    confirm({
      title: "Are you sure delete this account?",
      content: "please choose some choice.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.setState(
          {
            loading: true
          },
          () => this.deleteAccountList(accId)
        );
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  };

  deleteAccountList = async accId => {
    await API.post("/accounts/delete", { accId: accId })
      .then(() => {
        const { accounts } = this.state;
        const newAccounts = accounts.filter(item => item.acc_id !== accId);
        this.setState({
          accounts: newAccounts,
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

  render() {
    const { accounts, loading, deleteId, selectedRowKeys } = this.state;
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
          <Col span={24}>
            <div style={{ overflowX: "auto" }}>
              <Table
                pagination={{ pageSize: 10 }}
                rowSelection={rowSelection}
                columns={this.columns}
                rowKey="res_id"
                dataSource={accounts}
                loading={loading}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AccountComponent;
