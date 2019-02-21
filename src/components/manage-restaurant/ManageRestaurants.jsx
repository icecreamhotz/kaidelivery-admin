import React, { Component } from "react";
import { Table, Icon, Input, Row, Col, Button, Modal, Avatar } from "antd";
import API from "../../helpers/api.js";
import InsertModal from "./InsertModal";
import EditModal from "./EditModal";
import moment from "moment";
import "moment/locale/th";

import "../../resource/css/upload.scss";
import "../../resource/css/managetable.scss";
import "./managerestaurant.scss";

moment.locale("th");

const Search = Input.Search;
const confirm = Modal.confirm;

class ManageRestaurants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      restypes: [],
      backupRestaurantData: [],
      deleteId: [],
      deleteAvatar: [],
      visibleEdit: false,
      visibleInsert: false,
      editRestaurant: [],
      loading: true
    };

    this.columns = [
      {
        title: "Name",
        dataIndex: "res_name"
      },
      {
        title: "Telephone",
        render: (text, record) => {
          return `${
            record.res_telephone.length === 1
              ? `${record.res_telephone[0]}`
              : `${record.res_telephone[0]} ${record.res_telephone[1]}`
          }`;
        }
      },
      {
        title: "Email",
        dataIndex: "res_email"
      },
      {
        title: "Owner",
        render: (text, record) => {
          return record.user !== null
            ? `${record.user.name} ${record.user.lastname}`
            : "No";
        }
      },
      {
        title: "Logo",
        render: (text, record) =>
          record.res_logo !== null ? (
            <Avatar
              size="large"
              src={`http://localhost:3000/restaurants/${record.res_logo}`}
              alt={record.res_name}
            />
          ) : (
            <Avatar size="large" icon="shop" />
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
                key={record.res_id}
                type="edit"
                style={{ cursor: "pointer" }}
                onClick={() => this.showEditModal(record.res_id)}
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
    await this.fetchRestaurantWithOwnerAPI();
  }

  fetchRestaurantWithOwnerAPI = async () => {
    const restaurants = await API.get("/restaurants/owners");
    const { data } = await restaurants;

    const restypes = await API.get("restauranttypes/");
    const resTypes = await restypes.data.data;

    const newRestaurantData = data.data.map((item, index) => {
      return {
        ...item,
        res_telephone: JSON.parse(item.res_telephone),
        res_holiday: JSON.parse(item.res_holiday),
        restype_id: JSON.parse(item.restype_id),
        res_lat: parseFloat(item.res_lat),
        res_lng: parseFloat(item.res_lng)
      };
    });
    this.setState({
      restaurants: newRestaurantData,
      backupRestaurantData: newRestaurantData,
      restypes: resTypes,
      loading: false
    });
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

  showModal = () => {
    this.setState({
      visibleInsert: true
    });
  };

  handleCancel = () => {
    this.setState({ visibleInsert: false });
  };

  showEditModal = res_id => {
    const { restaurants } = this.state;
    const filterRestaurant = restaurants.filter(item => item.res_id === res_id);
    console.log(filterRestaurant);
    this.setState({
      editRestaurant: filterRestaurant,
      visibleEdit: true
    });
  };

  showInsertConfirm = (values, img, latlng, choice) => {
    confirm({
      title: "Warning",
      content: "Do you Want to add these restaurant?",
      onOk: () => {
        this.handleInsertData(values, img, latlng, choice);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleInsertData = (value, img, center, choice) => {
    this.setState({
      loading: true
    });
    const newAvatar = img !== null ? img : null;

    const newRestTypeID = value.restypes.map(item => {
      const indexResType = this.state.restypes.filter(
        typeitem => item === typeitem.restype_name
      );
      return indexResType[0].restype_id;
    });

    const checkTelephoneOne =
      value.telephone.telephone_one !== "" ? value.telephone.telephone_one : "";
    const checkTelephoneTwo =
      value.telephone.telephone_two !== "" ? value.telephone.telephone_two : "";
    const newTelephone = JSON.stringify([checkTelephoneOne, checkTelephoneTwo]);
    const newResOpen = moment(value.res_open).format("HH:mm:ss");
    const newResClose = moment(value.res_close).format("HH:mm:ss");
    const newHoliday = JSON.stringify(value.res_holiday);

    let bodyFormData = new FormData();

    bodyFormData.set("res_name", value.res_name);
    bodyFormData.set("res_telephone", newTelephone);
    bodyFormData.set("res_email", value.res_email);
    bodyFormData.set("res_address", value.res_address);
    bodyFormData.set("res_details", value.res_detail);
    bodyFormData.set("res_open", newResOpen);
    bodyFormData.set("res_close", newResClose);
    bodyFormData.set("res_holiday", newHoliday);
    bodyFormData.set("res_lat", center.lat);
    bodyFormData.set("res_lng", center.lng);
    bodyFormData.set("restype_id", JSON.stringify(newRestTypeID));
    bodyFormData.append("image", newAvatar);

    if (choice === "edit") {
      bodyFormData.set("res_id", this.state.editRestaurant[0].res_id);
    }
    const endpoint = choice === "insert" ? "create" : "update";

    API.post(`/restaurants/${endpoint}`, bodyFormData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    })
      .then(res => {
        if (choice === "insert") {
          this.setState(
            {
              loading: false,
              visibleInsert: false
            },
            () => this.success()
          );
        } else {
          this.setState(
            {
              editRestaurant: [],
              loading: false,
              visibleInsert: false,
              visibleEdit: false
            },
            () => this.success()
          );
        }
      })
      .catch(err => {
        if (choice === "insert") {
          this.setState(
            {
              loading: false,
              visibleInsert: false,
              visibleEdit: false
            },
            () => this.success()
          );
        } else {
          this.setState(
            {
              editRestaurant: [],
              loading: false,
              visibleInsert: false,
              visibleEdit: false
            },
            () => this.success()
          );
        }
      });
  };

  handleCreate = (img, latlng, choice) => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.showInsertConfirm(values, img, latlng, choice);
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
      content: "Add restaurant succesful.",
      onOk: () => {
        this.fetchRestaurantWithOwnerAPI();
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

  showDeleteConfirm = value => {
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

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const {
      restaurants,
      editRestaurant,
      visibleEdit,
      visibleInsert,
      loading,
      deleteId,
      restypes
    } = this.state;
    return (
      <div>
        <Row>
          <Col span={12}>
            <Button type="primary" icon="plus" onClick={this.showModal}>
              Add
            </Button>
          </Col>
          <Col span={12} align="right">
            {deleteId.length > 0 && (
              <Button
                className="button-delete"
                icon="delete"
                ghost={true}
                onClick={this.showDeleteConfirm}
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
              rowKey="res_id"
              dataSource={restaurants}
              loading={loading}
            />
          </Col>
        </Row>
        {editRestaurant.length > 0 && (
          <EditModal
            wrappedComponentRef={this.saveFormRef}
            visible={visibleEdit}
            restaurant={editRestaurant}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            restypes={restypes}
          />
        )}
        {restypes.length > 0 && (
          <InsertModal
            wrappedComponentRef={this.saveFormRef}
            visible={visibleInsert}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            restypes={restypes}
          />
        )}
      </div>
    );
  }
}

export default ManageRestaurants;
