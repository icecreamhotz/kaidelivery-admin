import React, { Component } from "react";
import { Drawer, Form, Button, Col, Row, Input, Checkbox, Modal } from "antd";
import TelephoneInput from "../manage-info/TelephoneInput";
import IDCardInput from "../manage-info/IDCardInput";
import RoleSelect from "./RoleSelect";
import API from "../../helpers/api";

const confirm = Modal.confirm;

class InsertDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      loading: false,
      fileimg: null,
      preview: "",
      altimg: "",
      submit: false
    };
  }

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

  onClose = () => {
    this.props.afterSaveEmployee(this.state.submit);
  };

  deleteImage = () => {
    this.setState({
      fileimg: null,
      preview: "",
      altimg: ""
    });
  };

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

  success = () => {
    Modal.success({
      title: "Success",
      content: "Add employee succesful.",
      onOk: () => {
        this.props.afterSaveEmployee(this.state.submit);
      }
    });
  };

  error = () => {
    Modal.error({
      title: "Failed",
      content: "Something is wrong :{"
    });
  };

  showInsertConfirm = value => {
    confirm({
      title: "Warning",
      content: "Do you Want to add these employee?",
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
    const { fileimg } = this.state;
    const newAvatar = fileimg !== null ? fileimg : null;
    const verified = value.emp_verified ? 1 : 0;

    let bodyFormData = new FormData();
    bodyFormData.set("emp_username", value.emp_username);
    bodyFormData.set("emp_password", value.emp_password);
    bodyFormData.set("emp_name", value.emp_name);
    bodyFormData.set("emp_lastname", value.emp_lastname);
    bodyFormData.set("emp_idcard", value.emp_idcard.emp_idcard);
    bodyFormData.set("emp_telephone", value.emp_telephone.emp_telephone);
    bodyFormData.set("emp_address", value.emp_address);
    bodyFormData.set("emp_verified", verified);
    bodyFormData.set("emptype_id", value.emptype_id);
    bodyFormData.append("image", newAvatar);

    API.post(`/employees/register`, bodyFormData, {
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

        if (duplicateUsername) {
          this.props.form.setFields({
            emp_username: {
              value: username,
              errors: [new Error("This username has been using.")]
            }
          });
        } else {
          this.showInsertConfirm(values);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { file, preview, altimg, loading } = this.state;
    const { role } = this.props;
    return (
      <div>
        <Drawer
          title="Add a new employee..."
          width={720}
          onClose={this.onClose}
          visible={this.props.visible}
          placement={"left"}
          style={{
            overflow: "auto",
            height: "calc(100% - 108px)",
            paddingBottom: "108px"
          }}
          onSubmit={this.handleSubmit}
        >
          <Row>
            <Col span={24}>
              <div className="circle">
                <img className="profile-pic" src={preview} alt={altimg} />
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

                {file !== null && (
                  <div className={`p-image undo-image`}>
                    <i
                      className="fas fa-times upload-button icon-image"
                      onClick={() => this.deleteImage()}
                    >
                      <span className="icon-text">Delete Image</span>
                    </i>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Form
            onSubmit={this.handleSubmit}
            layout="vertical"
            style={{ padding: "25px 0" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Username">
                  {getFieldDecorator("emp_username", {
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
                <Form.Item label="Password">
                  {getFieldDecorator("emp_password", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your Password!"
                      },
                      {
                        whitespace: true,
                        message: "Please don't space on this input!"
                      },
                      {
                        min: 8,
                        message: "Password must be start at 8 or more digit!"
                      }
                    ]
                  })(<Input type="password" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name">
                  {getFieldDecorator("emp_name", {
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
                <Form.Item
                  label="Internalization Card"
                  style={{ width: "90%" }}
                >
                  {getFieldDecorator("emp_idcard", {
                    initialValue: { emp_idcard: "" },
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
                      emp_telephone: ""
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
                    initialValue: role[0].emptype_id
                  })(<RoleSelect role={role} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Address">
                  {getFieldDecorator("emp_address", {
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
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Verify Status">
                  {getFieldDecorator("emp_verified", {
                    valuePropName: "checked",
                    initialValue: false
                  })(<Checkbox>Accept</Checkbox>)}
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
      </div>
    );
  }
}

const WrappedInsertForm = Form.create({ name: "insert_form" })(InsertDrawer);

export default WrappedInsertForm;
