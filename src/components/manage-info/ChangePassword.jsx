import React, { Component } from "react";
import { Row, Col, Form, Icon, Input, Button, Modal } from "antd";
import API from "../../helpers/api";
import Loading from "../loaders/loading";

const confirm = Modal.confirm;

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false
    };
  }

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

  showChangePasswordComfirm = value => {
    let self = this;
    confirm({
      title: "Warning",
      content: "Do you Want to update these information?",
      onOk() {
        self.handleUpdatePassword(value);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleUpdatePassword = value => {
    this.setState({
      loading: true
    });

    API.post(`/employees/update/password`, { emp_password: value.password })
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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.showChangePasswordComfirm(values);
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={24}>
                <h3>Change Password</h3>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your password!"
                      },
                      {
                        validator: this.validateToNextPassword
                      }
                    ]
                  })(
                    <Input
                      type="password"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Password"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("confirm", {
                    rules: [
                      {
                        required: true,
                        message: "Please confirm you password!"
                      },
                      {
                        validator: this.compareToFirstPassword
                      }
                    ]
                  })(
                    <Input
                      type="password"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Confirm Password"
                      onBlur={this.handleConfirmBlur}
                    />
                  )}
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
      </div>
    );
  }
}

const WrappedChangePasswordComponent = Form.create({ name: "change_password" })(
  ChangePassword
);

export default WrappedChangePasswordComponent;
