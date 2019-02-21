import React, { Component } from "react";
import PropTypes from "prop-types";
import { Drawer, Form, Button, Col, Row, Input, Modal } from "antd";
import TelephoneInput from "../manage-info/TelephoneInput";
import IDCardInput from "../manage-info/IDCardInput";
import RoleSelect from "./RoleSelect";
import API from "../../helpers/api";

const confirm = Modal.confirm;

class EditDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emp_id: props.emp[0].key,
      old_username: props.emp[0].username,
      emp_username: props.emp[0].username,
      emp_password: props.emp[0].password,
      emp_name: props.emp[0].name,
      emp_lastname: props.emp[0].lastname,
      emp_idcard: props.emp[0].idcard,
      emp_telephone: props.emp[0].telephone,
      emp_address: props.emp[0].address,
      emp_avatar: props.emp[0].avatar,
      emptype_id: props.emp[0].roleid,
      role: props.role,
      loading: false,
      fileimg: null,
      preview: "",
      altimg: "",
      submit: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.emp[0].username !== this.props.emp[0].username) {
      this.setState({
        emp_id: newProps.emp[0].key,
        old_username: newProps.emp[0].username,
        emp_username: newProps.emp[0].username,
        emp_password: newProps.emp[0].password,
        emp_name: newProps.emp[0].name,
        emp_lastname: newProps.emp[0].lastname,
        emp_idcard: newProps.emp[0].idcard,
        emp_telephone: newProps.emp[0].telephone,
        emp_address: newProps.emp[0].address,
        emp_avatar: newProps.emp[0].avatar,
        emptype_id: newProps.emp[0].roleid,
        role: newProps.role
      });
    }
  }

  validateIDCard = (rule, value, callback) => {
    if (value.emp_idcard.length === 13) {
      callback();
      return;
    }
    callback("ID card numbers require 13 digits and number only");
  };

  validateTelephone = (rule, value, callback) => {
    if (value.emp_telephone.length === 10) {
      callback();
      return;
    }
    callback("Telephone numbers require 10 digits and number only");
  };

  onClose = () => {
    this.props.setLoadingAfterUpdate(this.state.submit);
  };

  handleImageChange = e => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        fileimg: file,
        preview: reader.result,
        altimg: file.name
      });
    };
    this.imageInput.value = "";
    reader.readAsDataURL(file);
  };

  redoImage = () => {
    this.setState({
      fileimg: null,
      preview: "",
      altimg: ""
    });
  };

  success = () => {
    Modal.success({
      title: "Success",
      content: "Update succesful."
    });
  };

  error = () => {
    Modal.error({
      title: "Failed",
      content: "Something is wrong :{"
    });
  };

  showEditConfirm = value => {
    confirm({
      title: "Warning",
      content: "Do you Want to update these information?",
      onOk: () => {
        this.handleUpdateData(value);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleUpdateData = value => {
    this.setState({
      loading: true
    });
    const { emp_id, fileimg } = this.state;
    const newAvatar = fileimg !== null ? fileimg : null;

    let bodyFormData = new FormData();
    bodyFormData.set("emp_id", emp_id);
    bodyFormData.set("emp_username", value.emp_username);
    if (typeof value.emp_password !== "undefined") {
      bodyFormData.set("emp_password", value.emp_password);
    }
    bodyFormData.set("emp_name", value.emp_name);
    bodyFormData.set("emp_lastname", value.emp_lastname);
    bodyFormData.set("emp_idcard", value.emp_idcard.emp_idcard);
    bodyFormData.set("emp_telephone", value.emp_telephone.emp_telephone);
    bodyFormData.set("emp_address", value.emp_address);
    bodyFormData.set("emptype_id", value.emptype_id);
    bodyFormData.append("image", newAvatar);

    API.post(`/employees/update`, bodyFormData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    })
      .then(res => {
        this.setState(
          {
            loading: false,
            submit: true
          },
          () => this.success()
        );
      })
      .catch(err => {
        this.setState(
          {
            loading: false,
            submit: true
          },
          () => this.error()
        );
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const username = values.emp_username;
        const checkUsername = await API.post("/employees/username", {
          emp_username: username
        });
        const { data } = checkUsername;
        const duplicateUsername = data.data;

        if (duplicateUsername && username !== this.state.old_username) {
          this.props.form.setFields({
            emp_username: {
              value: username,
              errors: [new Error("This username has been using.")]
            }
          });
        } else {
          this.showEditConfirm(values);
        }
      }
    });
  };

  render() {
    const {
      emp_username,
      emp_name,
      emp_lastname,
      emp_idcard,
      emp_telephone,
      emp_address,
      emp_avatar,
      emptype_id,
      role,
      preview,
      altimg,
      loading
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const previewImage =
      emp_avatar !== null && preview === ""
        ? `http://localhost:3000/employees/${emp_avatar}`
        : preview;
    const altImage =
      emp_avatar !== null && preview === ""
        ? `${emp_name}${emp_lastname}`
        : altimg;
    return (
      <Drawer
        title={`${emp_name} ${emp_lastname}`}
        width={720}
        onClose={this.onClose}
        visible={this.props.visible}
        style={{
          overflow: "auto",
          height: "calc(100% - 108px)",
          paddingBottom: "108px"
        }}
      >
        <Row>
          <Col span={24}>
            <div className="circle">
              <img className="profile-pic" src={previewImage} alt={altImage} />
              <div className="p-image">
                <i
                  className="fas fa-plus-circle upload-button icon-image"
                  onClick={() => this.imageInput.click()}
                >
                  <span className="icon-text">Choose Image</span>
                </i>
                <input
                  className="file-upload"
                  type="file"
                  accept="image/*"
                  ref={input => (this.imageInput = input)}
                  onChange={e => this.handleImageChange(e)}
                />
              </div>
              {emp_avatar !== null && preview !== "" && (
                <div className={`p-image undo-image`}>
                  <i
                    className="fas fa-redo upload-button icon-image"
                    onClick={() => this.redoImage()}
                  >
                    <span className="icon-text">Redo Image</span>
                  </i>
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Form
          onSubmit={this.handleSubmit}
          layout="vertical"
          hideRequiredMark
          style={{ padding: "25px 0" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Username">
                {getFieldDecorator("emp_username", {
                  initialValue: emp_username,
                  rules: [
                    { required: true, message: "Please enter username" },
                    {
                      whitespace: true,
                      message: "Please don't space on this input!"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Password"
                extra="If dont need change password, you can refrain"
              >
                {getFieldDecorator(
                  "emp_password",
                  {
                    whitespace: true,
                    message: "Please don't space on this input!"
                  },
                  {
                    min: 8,
                    message: "Password must be start at 8 or more digit!"
                  }
                )(<Input type="password" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name">
                {getFieldDecorator("emp_name", {
                  initialValue: emp_name,
                  rules: [
                    { required: true, message: "Please enter name" },
                    {
                      whitespace: true,
                      message: "Please don't space on this input!"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Lastname">
                {getFieldDecorator("emp_lastname", {
                  initialValue: emp_lastname,
                  rules: [
                    { required: true, message: "Please enter lastname" },
                    {
                      whitespace: true,
                      message: "Please don't space on this input!"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Internalization Card" style={{ width: "90%" }}>
                {getFieldDecorator("emp_idcard", {
                  initialValue: { emp_idcard: emp_idcard },
                  rules: [
                    {
                      required: true,
                      message: "Please input your idcard!"
                    },
                    {
                      validator: this.validateIDCard
                    }
                  ]
                })(<IDCardInput />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Telephone" style={{ width: "90%" }}>
                {getFieldDecorator("emp_telephone", {
                  initialValue: {
                    emp_telephone: emp_telephone
                  },
                  rules: [
                    {
                      required: true,
                      message: "Please input your telephone!"
                    },
                    {
                      validator: this.validateTelephone
                    }
                  ]
                })(<TelephoneInput />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Roles" style={{ width: "90%" }}>
                {getFieldDecorator("emptype_id", {
                  initialValue: emptype_id
                })(<RoleSelect role={role} emptype_id={emptype_id} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Address">
                {getFieldDecorator("emp_address", {
                  initialValue: emp_address,
                  rules: [
                    {
                      required: true,
                      message: "please enter address"
                    },
                    {
                      whitespace: true,
                      message: "Please don't space on this input!"
                    }
                  ]
                })(<Input.TextArea rows={4} />)}
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 16px",
              background: "#fff",
              textAlign: "right"
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button htmlType="submit" type="primary" loading={loading}>
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

const WrappedEditForm = Form.create({ name: "update_drawer" })(EditDrawer);

WrappedEditForm.propTypes = {
  emp: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      idcard: PropTypes.string.isRequired,
      telephone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      roleid: PropTypes.number.isRequired
    })
  ).isRequired,
  role: PropTypes.arrayOf(
    PropTypes.shape({
      emptype_id: PropTypes.number.isRequired,
      emptype_name: PropTypes.string.isRequired
    })
  ).isRequired,
  visible: PropTypes.bool.isRequired,
  setLoadingAfterUpdate: PropTypes.func.isRequired
};

export default WrappedEditForm;
