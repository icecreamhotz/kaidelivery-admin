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

class EditAccountComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accId: props.accId,
      accName: props.accName,
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
          () => this.updateThisAccount(values)
        );
      }
    });
  };

  updateThisAccount = async values => {
    const data = {
      accId: this.state.accId,
      accName: values.acc_name,
      accDetails: values.acc_details,
      accPrice: values.acc_price,
      accDate: values.acc_date
    };
    await API.post("/accounts/update", data)
      .then(() => {
        this.setState({
          loading: false
        });
        const newValue = { ...values, acc_id: this.state.accId };
        this.props.form.resetFields();
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

  render() {
    const { modal, loading, accName, data } = this.state;
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
          title={accName}
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
                  {getFieldDecorator("acc_name", {
                    initialValue: data.acc_name,
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
                  {getFieldDecorator("acc_details", {
                    initialValue: data.acc_details,
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
                  {getFieldDecorator("acc_price", {
                    initialValue: data.acc_price,
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
                  {getFieldDecorator("acc_date", {
                    initialValue: moment(data.acc_date),
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
  EditAccountComponent
);

export default WrappedInsertForm;
