import React, { Component } from "react";
import {
  Table,
  Icon,
  Input,
  Row,
  Col,
  Button,
  Modal,
  Avatar,
  Divider,
  message,
  Form
} from "antd";
import API from "../../helpers/api.js";
import InsertModal from "./InsertModal";
import EditModal from "./EditModal";
import moment from "moment";
import "moment/locale/th";

import "../../resource/css/upload.scss";
import "../../resource/css/managetable.scss";
import "./managerestaurant.scss";

moment.locale("th");

const FormItem = Form.Item;

const Search = Input.Search;
const confirm = Modal.confirm;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Quota is required.`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(
                    <div>
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                        style={{
                          width: 50
                        }}
                      />
                      <span style={{ marginLeft: 10 }}>%</span>
                    </div>
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                  <span style={{ marginLeft: 10 }}>%</span>
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

class ManageRestaurants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      restypes: [],
      backupRestaurantData: [],
      deleteId: [],
      deleteAvatar: [],
      visibleInsert: false,
      visibleEdit: false,
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
          if (record.res_telephone !== null) {
            return `${
              record.res_telephone !== null
                ? `${record.res_telephone[0]}`
                : `${record.res_telephone[0]}, ${record.res_telephone[1]}`
            }`;
          }
          return `No`;
        }
      },
      {
        title: "Email",
        render: (text, record) => {
          return record.res_email !== null ? `${record.res_email}` : "No";
        }
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
        title: "Verifed",
        render: (text, record) =>
          record.res_status === "0" ? "Not Verified" : "Verifed"
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
        title: "Quota",
        dataIndex: "res_quota",
        editable: true
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
            title: "Verify",
            className: "column-actions",
            render: (text, record, index) => (
              <Icon
                key={record.key}
                type={record.res_status === "0" ? "check" : "close"}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.checkForVerified(record.res_id, record.res_status, index)
                }
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

    const { backupRestaurantData } = this.state;

    const regexSpecialText = /[ !@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/;

    if (regexSpecialText.test(value)) {
      return;
    }

    const regexText = new RegExp(`^.*${value}.*$`, "i");
    const searchData = backupRestaurantData.filter(({ res_name }) =>
      res_name.match(regexText)
    );

    this.setState({ restaurants: searchData });
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
    this.setState({
      editRestaurant: filterRestaurant,
      visibleEdit: true
    });
  };

  handleCancelEdit = () => {
    this.setState({ visibleEdit: false, editRestaurant: [] });
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
    console.log(endpoint);

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
      const getId = selectedRows.map(item => item.res_id);
      const getAvatar = selectedRows.map(item => item.res_logo);
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
      () => this.handleDeleteUser()
    );
  };

  checkForVerified = async (key, verified, index) => {
    const verifiedStatus = verified === "0" ? "1" : "0";
    await API.post(`/restaurants/verify`, {
      res_id: key,
      res_status: verifiedStatus
    })
      .then(() => {
        const success = verifiedStatus === "1" ? "Verified" : "Unverified";
        const newData = [...this.state.restaurants];
        newData[index].res_status = verifiedStatus;

        this.setState({
          restaurants: newData,
          backupRestaurantData: newData
        });
        message.success(`${success} this restaurant success`);
      })
      .catch(() => {
        message.error("Something has wrong :{");
      });
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
    await API.post("/restaurants/delete", {
      res_id: this.state.deleteId,
      res_logo: this.state.deleteAvatar
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

  updateQuota = async row => {
    await API.post("/restaurants/update/quota", {
      res_id: row.res_id,
      quota: row.res_quota
    })
      .then(res => {
        message.success("Update Success!");
        this.setState({ loading: true });
      })
      .catch(err => {
        message.error("Something has wrong :(");
        this.setState({
          loading: false
        });
      });
  };

  handleSave = row => {
    const newData = [...this.state.restaurants];
    const index = newData.findIndex(item => row.res_id === item.res_id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ restaurants: newData, loading: true }, () => {
      this.updateQuota(row);
    });
  };

  render() {
    const {
      restaurants,
      editRestaurant,
      visibleInsert,
      visibleEdit,
      loading,
      deleteId,
      restypes
    } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div>
        <h3>Manage Restaurant</h3>
        <Divider />
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
            <div style={{ overflowX: "auto" }}>
              <Table
                components={components}
                rowClassName={() => "editable-row"}
                dataSource={restaurants}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowSelection={this.rowSelection}
              />
            </div>
          </Col>
        </Row>
        {visibleEdit && editRestaurant.length > 0 && (
          <EditModal
            wrappedComponentRef={this.saveFormRef}
            visible={visibleEdit}
            restaurant={editRestaurant}
            onCancel={this.handleCancelEdit}
            onCreate={this.handleCreate}
            restypes={restypes}
          />
        )}

        <InsertModal
          wrappedComponentRef={this.saveFormRef}
          visible={visibleInsert}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          restypes={restypes}
        />
      </div>
    );
  }
}

export default ManageRestaurants;
