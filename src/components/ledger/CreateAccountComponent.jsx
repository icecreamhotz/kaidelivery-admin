import React, { Component } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
  Select,
} from "antd";
import API from "../../helpers/api";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

const Option = Select.Option;

class CreateAccountComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      loading: false,
      ledger: 0
    };
  }

  handleChange = value => {
    console.log(value);
    this.setState({
      ledger: value
    });
  };

  setModaleVisible = data => {
    this.setState({
      modal: data
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.props.setLoading(true);
        this.setState(
          {
            loading: true
          },
          () => this.insertThisLedger(values)
        );
      }
    });
  };

  insertThisLedger = async values => {
    const { choice } = this.state;
    const data = {
      name: values.name,
      details: values.details,
      price: values.price,
      date: values.date
    };
    const url = choice === "0" ? "/accounts/" : "/expenses/";
    await API.post(url, data)
      .then(() => {
        this.setState({
          loading: false
        });
        this.props.form.resetFields();
        this.props.updateRow(values);
        message.success("Success!");
      })
      .catch(err => {
        this.props.setLoading(false);
        this.setState({
          loading: false
        });
        message.error("Something has wrong :(");
      });
  };

  render() {
    const { modal, loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button
          type="primary"
          icon="plus"
          onClick={() => this.setModaleVisible(true)}
        >
          Create
        </Button>
        <Modal
          title="Create some ledger"
          centered
          visible={modal}
          onOk={() => this.setModaleVisible(false)}
          onCancel={() => this.setModaleVisible(false)}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row>
              <Col span={24}>
                <Form.Item label="Topic">
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "Please input account!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Detail">
                  {getFieldDecorator("details", {
                    rules: [
                      {
                        required: true,
                        message: "Please input account detail!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Total">
                  {getFieldDecorator("price", {
                    rules: [
                      {
                        required: true,
                        message: "Please input account total!"
                      }
                    ]
                  })(<InputNumber step={0.1} style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Date">
                  {getFieldDecorator("date", {
                    rules: [
                      {
                        required: true,
                        message: "Please choose date in this account!"
                      }
                    ]
                  })(<DatePicker style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Ledger">
                  {getFieldDecorator("type", {
                    validateTrigger: ["onChange", "onBlur"],
                    initialValue: "0",
                    rules: [
                      {
                        required: true,
                        message: "Please choose date in this account!"
                      }
                    ]
                  })(
                    <Select style={{ width: "100%" }}>
                      <Option value="0">Revenue</Option>
                      <Option value="1">Expense</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: "-20px",
                width: "100%",
                borderTop: "1px solid #e9e9e9",
                padding: "10px 16px",
                background: "#fff",
                textAlign: "right"
              }}
            >
              <Button
                onClick={() => this.setModaleVisible(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button htmlType="submit" type="primary" loading={loading}>
                Submit
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedInsertForm = Form.create({ name: "insert_form" })(
  CreateAccountComponent
);

export default WrappedInsertForm;
