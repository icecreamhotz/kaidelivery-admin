import React, { Component } from "react";
import { Drawer, Form, Button, Col, Row, Input, Modal } from "antd";
import TelephoneInput from "../manage-info/TelephoneInput";
import API from "../../helpers/api";

const confirm = Modal.confirm;

class InsertDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.props.afterSaveUser(this.state.submit);
  };

  deleteImage = () => {
    this.setState({
      fileimg: null,
      preview: "",
      altimg: ""
    });
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
      content: "Add user succesful.",
      onOk: () => {
        this.props.afterSaveUser(this.state.submit);
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
      content: "Do you Want to add these user?",
      onOk: () => {
        this.handleInsertData(value);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleInsertData = value => {
    this.setState({
      loading: true
    });
    const { fileimg } = this.state;
    const newAvatar = fileimg !== null ? fileimg : null;

    let bodyFormData = new FormData();
    bodyFormData.set("username", value.username);
    bodyFormData.set("password", value.password);
    bodyFormData.set("name", value.name);
    bodyFormData.set("lastname", value.lastname);
    bodyFormData.set("email", value.email);
    bodyFormData.set("telephone", value.telephone.emp_telephone);
    bodyFormData.set("address", value.address);
    bodyFormData.append("image", newAvatar);

    API.post(`/users/add`, bodyFormData, {
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
        const username = values.username;
        const checkUsername = await API.post("/users/checkusername", {
          username: username
        });
        const duplicateUsername = checkUsername.data.username;

        const email = values.email;
        const checkEmail = await API.post("/users/checkemail", {
          email: email
        });
        const duplicateEmail = checkEmail.data.email;

        if (
          (duplicateUsername && username !== this.state.old_username) ||
          (duplicateEmail && email !== this.state.old_email)
        ) {
          if(duplicateUsername) {
            this.props.form.setFields({
              username: {
                value: username,
                errors: [new Error("This username has been using.")]
              }
            });
          } else if(duplicateEmail) {
            this.props.form.setFields({
              email: {
                value: email,
                errors: [new Error("This email has been using.")]
              }
            });
          }
          
        } else {
          this.showInsertConfirm(values);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fileimg, preview, altimg, loading } = this.state;
    return (
      <div>
        <Drawer
          title="Add a new user..."
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
                {fileimg !== null && (
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
                  {getFieldDecorator("username", {
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
                  {getFieldDecorator("password", {
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
                  {getFieldDecorator("name", {
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
                  {getFieldDecorator("lastname", {
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
                <Form.Item label="Email" style={{ width: "90%" }}>
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "The input is not valid E-mail!"
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!"
                      },
                      {
                        whitespace: true,
                        message: "Please don't space on this input!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Telephone" style={{ width: "90%" }}>
                  {getFieldDecorator("telephone", {
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
              <Col span={24}>
                <Form.Item label="Address">
                  {getFieldDecorator("address", {
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
      </div>
    );
  }
}

const WrappedInsertForm = Form.create({ name: "insert_form" })(InsertDrawer);

export default WrappedInsertForm;
