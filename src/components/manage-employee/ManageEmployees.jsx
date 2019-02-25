import React, { Component } from "react";
import {
  Table,
  Icon,
  Input,
  Row,
  Col,
  Button,
  Modal,
  Divider,
  message
} from "antd";
import API from "../../helpers/api.js";
import EditDrawer from "./EditDrawer";
import InsertDrawer from "./InsertDrawer";

import "../../resource/css/upload.scss";
import "../../resource/css/managetable.scss";

const Search = Input.Search;
const confirm = Modal.confirm;

class ManageEmployees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: [],
      backupEmployeeData: [],
      role: [],
      deleteId: [],
      deleteAvatar: [],
      visibleEdit: false,
      visibleInsert: false,
      editEmployee: [],
      loading: true
    };

    this.columns = [
      {
        title: "Name",
        dataIndex: "name"
      },
      {
        title: "Lastname",
        dataIndex: "lastname"
      },
      {
        title: "Telephone",
        dataIndex: "telephone"
      },
      {
        title: "Verified",
        dataIndex: "verified"
      },
      {
        title: "Role",
        dataIndex: "role"
      },
      {
        title: "Actions",
        children: [
          {
            title: "Edit",
            className: "column-actions",
            render: (text, record) => (
              <Icon
                key={record.key}
                type="edit"
                style={{ cursor: "pointer" }}
                onClick={() => this.showDrawer(record.key)}
              />
            )
          },
          {
            title: "Delete",
            className: "column-actions",
            render: (text, record) => (
              <Icon
                key={record.key}
                type="delete"
                style={{ cursor: "pointer" }}
                onClick={() => this.deleteById(record.key, record.avatar)}
              />
            )
          },
          {
            title: "Verify",
            className: "column-actions",
            render: (text, record, index) => (
              <Icon
                key={record.key}
                type={record.verified === "Not Verified" ? "check" : "close"}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.checkForVerified(record.key, record.verified, index)
                }
              />
            )
          }
        ]
      }
    ];
  }

  async componentDidMount() {
    await this.fetchEmployeeFromAPI();
  }

  fetchEmployeeFromAPI = async () => {
    const employees = await API.get("/employees/");
    const roles = await API.get("/employeetypes/");

    const empData = await employees.data.data;
    const roleData = await roles.data.data;
    const newData = empData.map((item, index) => {
      const role = roleData.filter(role => role.emptype_id === item.emptype_id);
      const verifiedText =
        item.emp_verified === "0" ? "Not Verified" : "Verified";
      return {
        key: `${item.emp_id}`,
        username: item.emp_username,
        name: item.emp_name,
        lastname: item.emp_lastname,
        idcard: item.emp_idcard,
        avatar: item.emp_avatar,
        address: item.emp_address,
        telephone: item.emp_telephone,
        verified: verifiedText,
        role: role[0].emptype_name,
        roleid: item.emptype_id
      };
    });

    this.setState({
      employees: newData,
      backupEmployeeData: newData,
      role: roleData,
      loading: false
    });
  };

  showDrawer = emp_key => {
    const { employees } = this.state;
    const getEmployee = employees.filter(item => item.key === emp_key);
    this.setState({
      visibleEdit: true,
      editEmployee: getEmployee
    });
  };

  setLoadingAfterUpdate = submit => {
    if (submit) {
      this.setState(
        {
          visibleEdit: !this.state.visibleEdit,
          loading: true
        },
        () => {
          this.fetchEmployeeFromAPI();
        }
      );
    } else {
      this.setState({
        visibleEdit: !this.state.visibleEdit
      });
    }
  };

  afterSaveEmployee = submit => {
    if (submit) {
      this.setState(
        {
          visibleInsert: !this.state.visibleInsert,
          loading: true
        },
        () => {
          this.fetchEmployeeFromAPI();
        }
      );
    } else {
      this.setState({
        visibleInsert: !this.state.visibleInsert
      });
    }
  };

  handleSearchBox = e => {
    const value = e.target.value;

    const { backupEmployeeData } = this.state;

    const regexSpecialText = /[ !@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/;

    if (regexSpecialText.test(value)) {
      return;
    }

    const regexText = new RegExp(`^.*${value}.*$`, "i");
    const searchData = backupEmployeeData.filter(({ name }) =>
      name.match(regexText)
    );

    this.setState({ employees: searchData });
  };

  openInsertDrawer = () => {
    this.setState({
      visibleInsert: true
    });
  };

  // rowSelection object indicates the need for row selection
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const getId = selectedRows.map(item => item.key);
      const getAvatar = selectedRows.map(item => item.avatar);
      this.setState({
        deleteId: getId,
        deleteAvatar: getAvatar
      });
    }
  };

  deleteById = (key, avatar) => {
    this.setState(
      prev => ({
        deleteId: [...prev.deleteId, key],
        deleteAvatar: [...prev.deleteAvatar, avatar]
      }),
      () => this.handleDeleteEmployee()
    );
  };

  checkForVerified = async (key, verified, index) => {
    const verifiedStatus = verified === "Not Verified" ? 1 : 0;
    await API.post(`/employees/verify`, {
      emp_id: key,
      emp_verified: verifiedStatus
    })
      .then(() => {
        const success = verifiedStatus === 1 ? "Verified" : "Unverified";
        const newData = [...this.state.employees];
        newData[index].verified =
          verifiedStatus === 1 ? "Verified" : "Not Verified";

        this.setState({
          employees: newData,
          backupEmployeeData: newData
        });
        message.success(`${success} this employee success`);
      })
      .catch(() => {
        message.error("Something has wrong :{");
      });
  };

  success = () => {
    Modal.success({
      title: "Success",
      content: "Delete employee succesful.",
      onOk: () => {
        this.fetchEmployeeFromAPI();
      }
    });
  };

  error = () => {
    Modal.error({
      title: "Failed",
      content: "Something is wrong :{"
    });
  };

  handleDeleteEmployee = async () => {
    await API.post("/employees/delete", {
      emp_id: this.state.deleteId,
      emp_avatar: this.state.deleteAvatar
    })
      .then(() => {
        this.setState(
          {
            loading: true,
            deleteId: [],
            deleteAvatar: []
          },
          () => this.success()
        );
      })
      .catch(() => {
        this.error();
      });
  };

  showInsertConfirm = value => {
    confirm({
      title: "Warning",
      content: "Do you Want to delete these employee?",
      onOk: () => {
        this.handleDeleteEmployee();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  render() {
    const {
      employees,
      editEmployee,
      role,
      visibleEdit,
      visibleInsert,
      loading,
      deleteId
    } = this.state;

    return (
      <div>
        <h3>Manage Employee</h3>
        <Divider />
        <Row>
          <Col span={12}>
            <Button type="primary" icon="plus" onClick={this.openInsertDrawer}>
              Add
            </Button>
          </Col>
          <Col span={12} align="right">
            {deleteId.length > 0 && (
              <Button
                className="button-delete"
                icon="delete"
                ghost={true}
                onClick={this.showInsertConfirm}
              >
                Delete
              </Button>
            )}
          </Col>
        </Row>
        <Row style={{ paddingTop: 25 }}>
          <Col span={24}>
            <Search
              placeholder="Search by name ....."
              onChange={e => this.handleSearchBox(e)}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: 25 }}>
          <Col span={24}>
            <div style={{ overflowX: "auto" }}>
              <Table
                pagination={{ pageSize: 10 }}
                rowSelection={this.rowSelection}
                columns={this.columns}
                dataSource={employees}
                loading={loading}
              />
            </div>
          </Col>
        </Row>
        {editEmployee.length > 0 && (
          <EditDrawer
            visible={visibleEdit}
            emp={editEmployee}
            role={role}
            setLoadingAfterUpdate={this.setLoadingAfterUpdate}
          />
        )}
        {role.length > 0 && (
          <InsertDrawer
            visible={visibleInsert}
            role={role}
            afterSaveEmployee={this.afterSaveEmployee}
          />
        )}
      </div>
    );
  }
}

export default ManageEmployees;
