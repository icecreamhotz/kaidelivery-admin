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
  Icon
} from "antd";
import API from "../../helpers/api";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

class EditExpenseComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expId: props.expId,
      expName: props.expName,
      modal: false,
      loading: false,
      data: props.data
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
          () => this.updateThisExpense(values)
        );
      }
    });
  };

  updateThisExpense = async values => {
    const data = {
      expId: this.state.expId,
      extName: values.exp_name,
      expDetails: values.exp_details,
      expDate: values.exp_date,
      expPrice: values.exp_price
    };
    await API.post("/expenses/update", data)
      .then(() => {
        this.setState({
          loading: false
        });
        const newValue = { ...values, exp_id: this.state.expId };
        this.props.form.resetFields();
        this.props.updateRow(newValue);
        message.success("Update expense success!");
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
    const { modal, loading, expName, data } = this.state;
    const { getFieldDecorator } = this.props.form;
    console.info(data);
    return (
      <div>
        <Icon
          type="edit"
          style={{ cursor: "pointer" }}
          onClick={() => this.setModaleVisible(true)}
        />
        <Modal
          title={expName}
          centered
          visible={modal}
          onOk={() => this.setModaleVisible(false)}
          onCancel={() => this.setModaleVisible(false)}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row>
              <Col span={24}>
                <Form.Item label="Expense">
                  {getFieldDecorator("exp_name", {
                    initialValue: data.exp_name,
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
                  {getFieldDecorator("exp_details", {
                    initialValue: data.exp_details,
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
                  {getFieldDecorator("exp_price", {
                    initialValue: data.exp_price,
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
                  {getFieldDecorator("exp_date", {
                    initialValue: moment(data.exp_date),
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
  EditExpenseComponent
);

export default WrappedInsertForm;
