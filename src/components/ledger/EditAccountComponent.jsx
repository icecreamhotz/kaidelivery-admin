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
  Icon,
  Select
} from "antd";
import API from "../../helpers/api";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

const Option = Select.Option;

class EditAccountComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      loading: false,
      ledger: props.data
    };
  }

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
          () => this.updateThisLedger(values)
        );
      }
    });
  };

  updateThisLedger = async values => {
    const { ledger } = this.state
    const data = {
      id: ledger.id,
      name: values.name,
      details: values.details,
      price: values.price,
      date: values.date
    };
    
    if(values.type !== ledger.type) {
      const urlDelete = ledger.type === "0" ? "/accounts/delete" : "/expenses/delete";
      await API.post(urlDelete, { id: ledger.id })
      .then(() => {
        this.insertThisLedger(values, data)
      })
      .catch(err => {
        this.props.setLoading(false);
        this.setState({
          loading: false
        });
        message.error("Something has wrong :(");
      });
      return
    }
    
    this.updateData(values, data)
  };

  insertThisLedger = async (values, data) => {
    const { ledger } = this.state;

    const url = values.type === "0" ? "/accounts/" : "/expenses/";
    await API.post(url, data)
      .then(() => {
        this.setState({
          loading: false
        });
        const newValue = { ...values, id: ledger.id, oldType: ledger.type};
        this.props.updateRow(newValue);
        message.success("Update account success!");
      })
      .catch(err => {
        this.props.setLoading(false);
        this.setState({
          loading: false
        });
        message.error("Something has wrong :(");
      });
  };

  updateData = async (values, data) => {
    const { ledger } = this.state
    const url = ledger.type === "0" ? "/accounts/update" : "/expenses/update"
    await API.post(url, data)
      .then(() => {
        this.setState({
          loading: false
        });
        const newValue = { ...values, id: ledger.id, oldType: ledger.type};
        this.props.updateRow(newValue);
        message.success("Update account success!");
      })
      .catch(err => {
        this.props.setLoading(false);
        this.setState({
          loading: false
        });
        message.error("Something has wrong :(");
      });
  }

  render() {
    const { modal, loading, ledger } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Icon
          type="edit"
          style={{ cursor: "pointer" }}
          onClick={() => this.setModaleVisible(true)}
        />
        <Modal
          title={`${ledger.name} ${ledger.date}`}
          centered
          visible={modal}
          onOk={() => this.setModaleVisible(false)}
          onCancel={() => this.setModaleVisible(false)}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row>
              <Col span={24}>
                <Form.Item label="Account">
                  {getFieldDecorator("name", {
                    initialValue: ledger.name,
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
                    initialValue: ledger.details,
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
                    initialValue: ledger.price,
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
                    initialValue: moment(ledger.date),
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
                    initialValue: ledger.type.toString(),
                    rules: [
                      {
                        required: true,
                        message: "Please choose date in this account!"
                      }
                    ]
                  })(
                     <Select
                      style={{ width: "100%" }}
                    >
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
  EditAccountComponent
);

export default WrappedInsertForm;
