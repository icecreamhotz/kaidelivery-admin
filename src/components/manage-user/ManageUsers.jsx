import React, { Component } from "react";
import { Table, Icon, Input, Row, Col, Button, Modal, Avatar } from "antd";
import API from "../../helpers/api.js";
import EditDrawer from "./EditDrawer";
import InsertDrawer from "./InsertDrawer";

import "../../resource/css/upload.scss";
import "../../resource/css/managetable.scss";

const Search = Input.Search;
const confirm = Modal.confirm;

class ManageUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      backupUsersData: [],
      deleteId: [],
      deleteAvatar: [],
      visibleEdit: false,
      visibleInsert: false,
      editUser: [],
      loading: true
    };

    this.columns = [
      {
        title: "Name",
        render: (text, record) => `${record.name} ${record.lastname}`
      },
      {
        title: "Email",
        dataIndex: "email"
      },
      {
        title: "Telephone",
        dataIndex: "telephone"
      },
      {
        title: "Login By",
        render: (text, record) =>
          `${record.provider === "1" ? "System" : "Facebook"}`
      },
      {
        title: "Avatar",
        render: (text, record) =>
          record.avatar !== null ? (
            <Avatar
              size="large"
              src={`http://localhost:3000/users/${record.avatar}`}
              alt={record.avatar}
            />
          ) : (
            <Avatar size="large" icon="user" />
          )
      },
      {
        title: "Actions",
        children: [
          {
            title: "Edit",
            className: "column-actions",
            render: (text, record) => (
              <Icon
                key={record.user_id}
                type="edit"
                style={{ cursor: "pointer" }}
                onClick={() => this.showDrawer(record.user_id)}
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
                onClick={() => this.deleteById(record.user_id, record.avatar)}
              />
            )
          }
        ]
      }
    ];
  }

  async componentDidMount() {
    await this.fetchUsersFromAPI();
  }

  fetchUsersFromAPI = async () => {
    const users = await API.get("/users/");
    const { data } = users;
    this.setState({
      users: data.data,
      backupUsersData: data.data,
      loading: false
    });
  };

  showDrawer = user_key => {
    const { users } = this.state;
    const getUser = users.filter(item => item.user_id === user_key);
    this.setState({
      visibleEdit: true,
      editUser: getUser
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
          this.fetchUsersFromAPI();
        }
      );
    } else {
      this.setState({
        visibleEdit: !this.state.visibleEdit
      });
    }
  };

  afterSaveUser = submit => {
    if (submit) {
      this.setState(
        {
          visibleInsert: !this.state.visibleInsert,
          loading: true
        },
        () => {
          this.fetchUsersFromAPI();
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

    const { backupUsersData } = this.state;

    const regexSpecialText = /[ !@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/;

    if (regexSpecialText.test(value)) {
      return;
    }

    const regexText = new RegExp(`^.*${value}.*$`, "i");
    const searchData = backupUsersData.filter(({ name }) =>
      name.match(regexText)
    );

    this.setState({ users: searchData });
  };

  openInsertDrawer = () => {
    this.setState({
      visibleInsert: true
    });
  };

  // rowSelection object indicates the need for row selection
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys);
      const getId = selectedRows.map(item => item.user_id);
      const getAvatar = selectedRows.map(item => item.avatar);
      this.setState({
        deleteId: getId,
        deleteAvatar: getAvatar
      });
    },
    getCheckboxProps: record => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name
    })
  };

  deleteById = (key, avatar) => {
    this.setState(
      prev => ({
        deleteId: [...prev.deleteId, key],
        deleteAvatar: [...prev.deleteAvatar, avatar]
      }),
      () => this.handleDeleteUser()
    );
  };

  success = () => {
    Modal.success({
      title: "Success",
      content: "Delete employee succesful.",
      onOk: () => {
        this.fetchUsersFromAPI();
      }
    });
  };

  error = () => {
    Modal.error({
      title: "Failed",
      content: "Something is wrong :{"
    });
  };

  handleDeleteUser = async () => {
    await API.post("/users/delete", {
      user_id: this.state.deleteId,
      avatar: this.state.deleteAvatar
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
      content: "Do you Want to delete these user?",
      onOk: () => {
        this.handleDeleteUser();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  render() {
    const {
      users,
      editUser,
      visibleEdit,
      visibleInsert,
      loading,
      deleteId
    } = this.state;
    console.log(editUser);
    return (
      <div>
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
            <Table
              pagination={{ pageSize: 10 }}
              rowSelection={this.rowSelection}
              columns={this.columns}
              rowKey="user_id"
              dataSource={users}
              loading={loading}
            />
          </Col>
        </Row>
        {editUser.length > 0 && (
          <EditDrawer
            visible={visibleEdit}
            user={editUser}
            setLoadingAfterUpdate={this.setLoadingAfterUpdate}
          />
        )}
        <InsertDrawer
          visible={visibleInsert}
          afterSaveUser={this.afterSaveUser}
        />
      </div>
    );
  }
}

export default ManageUsers;
