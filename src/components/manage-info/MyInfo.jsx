import React, { Component } from "react";
import { Row, Col, Icon, Form, Input, Button, Modal } from "antd";
import "./manageinfo.scss";
import "../../resource/css/upload.scss";
import API from "../../helpers/api";
import Loading from "../loaders/loading";
import TelephoneInput from "./TelephoneInput";
import IDCardInput from "./IDCardInput";

const { TextArea } = Input;
const confirm = Modal.confirm;

class MyInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fileimg: null,
      preview: "",
      altimg: "",
      profile: []
    };
  }

  async componentDidMount() {
    await this.fetchProfileFromAPI();
  }

  fetchProfileFromAPI = async () => {
    const profile = await API.get("/employees/info");
    const { data } = await profile;

    this.setState({
      profile: data.data,
      loading: false,
      telephone: data.data.emp_telephone
    });
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

  showDeleteConfirm = value => {
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

  handleUpdateData = async value => {
    this.setState({
      loading: true
    });
    const { fileimg } = this.state;
    const newAvatar = fileimg !== null ? fileimg : null;

    let bodyFormData = new FormData();
    bodyFormData.set("emp_name", value.emp_name);
    bodyFormData.set("emp_lastname", value.emp_lastname);
    bodyFormData.set("emp_idcard", value.emp_idcard.emp_idcard);
    bodyFormData.set("emp_telephone", value.emp_telephone.emp_telephone);
    bodyFormData.set("emp_address", value.emp_address);
    bodyFormData.append("image", newAvatar);

    await API.post(`/employees/update/info`, bodyFormData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    })
      .then(res => {
        this.setState(
          {
            loading: false
          },
          () => this.success()
        );
      })
      .catch(err => {
        this.setState(
          {
            loading: false
          },
          () => this.error()
        );
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.showDeleteConfirm(values);
      }
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

  redoImage = () => {
    this.setState({
      preview: "",
      altimg: "",
      fileimg: null
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { profile, preview, altimg, loading } = this.state;
    const previewImage =
      profile.emp_avatar !== null && preview === ""
        ? `http://localhost:3000/employees/${profile.emp_avatar}`
        : preview;
    const altImage =
      profile.emp_avatar !== null && preview === ""
        ? `${profile.emp_name}${profile.emp_lastname}`
        : altimg;
    return (
      <div style={{ position: "relative" }}>
        <Loading loaded={loading} />
        <Row style={{ padding: "15px 0" }}>
          <Row>
            <Col span={24}>
              <div className="circle">
                <img
                  className="profile-pic"
                  src={previewImage}
                  alt={altImage}
                />
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
                {(profile.emp_avatar !== null && preview !== "") && (
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
          <Row style={{ paddingTop: 25 }}>
            <Form
              layout="inline"
              onSubmit={this.handleSubmit}
              hideRequiredMark={true}
            >
              <Row>
                <Col span={12}>
                  <Form.Item label="Name" style={{ width: "90%" }}>
                    {getFieldDecorator("emp_name", {
                      initialValue: profile.emp_name,
                      rules: [
                        {
                          required: true,
                          message: "Please input your name!"
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Lastname" style={{ width: "90%" }}>
                    {getFieldDecorator("emp_lastname", {
                      initialValue: profile.emp_name,
                      rules: [
                        {
                          required: true,
                          message: "Please input your lastname!"
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Internalization Card"
                    style={{ width: "90%" }}
                  >
                    {getFieldDecorator("emp_idcard", {
                      initialValue: { emp_idcard: profile.emp_idcard },
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
                      initialValue: { emp_telephone: profile.emp_telephone },
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
              <Row>
                <Col span={24}>
                  <Form.Item label="Address" style={{ width: "95%" }}>
                    {getFieldDecorator("emp_address", {
                      initialValue: profile.emp_address,
                      rules: [
                        {
                          required: true,
                          message: "Please input your address!"
                        }
                      ]
                    })(<TextArea rows={4} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: "center", marginTop: 15 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Row>
        </Row>
      </div>
    );
  }
}

const WrappedMyInfoForm = Form.create({ name: "info" })(MyInfo);

export default WrappedMyInfoForm;
