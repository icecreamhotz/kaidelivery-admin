import React, { Component } from "react";
import PropTypes from "prop-types";
import { Drawer, Form, Button, Col, Row, Input, Modal } from "antd";
import TelephoneInput from "../manage-info/TelephoneInput";
import API from "../../helpers/api";

const confirm = Modal.confirm;

class EditDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: props.user[0].user_id,
      old_username: props.user[0].username,
      username: props.user[0].username,
      password: props.user[0].password,
      name: props.user[0].name,
      lastname: props.user[0].lastname,
      old_email: props.user[0].email,
      email: props.user[0].email,
      telephone: props.user[0].telephone,
      address: props.user[0].address,
      avatar: props.user[0].avatar,
      provider: props.user[0].provider,
      loading: false,
      fileimg: null,
      preview: "",
      altimg: "",
      submit: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user[0].username !== this.props.user[0].username) {
      this.setState({
        user_id: newProps.user[0].user_id,
        old_username: newProps.user[0].username,
        username: newProps.user[0].username,
        password: newProps.user[0].password,
        name: newProps.user[0].name,
        lastname: newProps.user[0].lastname,
        old_email: newProps.user[0].email,
        email: newProps.user[0].email,
        telephone: newProps.user[0].telephone,
        address: newProps.user[0].address,
        avatar: newProps.user[0].avatar,
        provider: newProps.user[0].provider
      });
    }
  }

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
    const { user_id, fileimg } = this.state;
    const newAvatar = fileimg !== null ? fileimg : null;

    let bodyFormData = new FormData();
    bodyFormData.set("user_id", user_id);
    bodyFormData.set("username", value.username);
    if (typeof value.password !== "undefined") {
      bodyFormData.set("password", value.password);
    }
    bodyFormData.set("name", value.name);
    bodyFormData.set("lastname", value.lastname);
    bodyFormData.set("email", value.email);
    bodyFormData.set("telephone", value.telephone.emp_telephone);
    bodyFormData.set("address", value.address);
    bodyFormData.append("image", newAvatar);

    API.post(`/users/update`, bodyFormData, {
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
        const duplicateEmail = checkEmail.data.username;

        if (
          (duplicateUsername && username !== this.state.old_username) ||
          (duplicateEmail && email !== this.state.old_email)
        ) {
          this.props.form.setFields({
            username: {
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
      username,
      name,
      lastname,
      email,
      telephone,
      address,
      avatar,
      provider,
      preview,
      altimg,
      loading
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const previewImage =
      avatar !== null && preview === ""
        ? `http://localhost:3000/users/${avatar}`
        : preview;
    const altImage =
      avatar !== null && preview === "" ? `${name}${lastname}` : altimg;
    return (
      <Drawer
        title={`${name} ${lastname}`}
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
              {avatar !== null && preview !== "" && (
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
          {provider === "1" && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Username">
                  {getFieldDecorator("username", {
                    initialValue: username,
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
                    "password",
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
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name">
                {getFieldDecorator("name", {
                  initialValue: name,
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
                  initialValue: lastname,
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
                  initialValue: email,
                  rules: [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!"
                    },
                    {
                      required: true,
                      message: "Please input your idcard!"
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
                    emp_telephone: telephone // key name should be telephone
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
                  initialValue: address,
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
  user: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      telephone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      provider: PropTypes.string.isRequired
    })
  ).isRequired,
  visible: PropTypes.bool.isRequired,
  setLoadingAfterUpdate: PropTypes.func.isRequired
};

export default WrappedEditForm;
