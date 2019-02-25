import React from "react";
import {
  Table,
  Row,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Divider,
  Modal,
  Button
} from "antd";
import API from "../../helpers/api.js";
import axios from "axios";
import Loading from "../loaders/loading.js";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class InfoRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: "",
      edit: false,
      loading: true,
      loadingButton: false
    };
    this.columns = [
      {
        title: "No",
        key: "index",
        render: (text, record, index) => index + 1
      },
      {
        title: "Rate",
        dataIndex: "rate_kilometers",
        width: "25%",
        editable: true
      },
      {
        title: "Price",
        dataIndex: "rate_price",
        width: "25%",
        editable: true
      },
      {
        title: "Details",
        dataIndex: "rate_details",
        width: "25%",
        editable: true
      },
      {
        title: "Edit",
        dataIndex: "edit",
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.rate_id)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.rate_id)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.rate_id)}>Edit</a>
              )}
            </div>
          );
        }
      }
    ];
  }

  async componentDidMount() {
    await this.fetchRateFromAPI();
  }

  success = () => {
    Modal.success({
      title: "Success",
      content: "Updated succesful."
    });
  };

  error = () => {
    Modal.error({
      title: "Failed",
      content: "Something is wrong :{"
    });
  };

  isEditing = record => record.rate_id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key) {
    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }

      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.rate_id);
      const item = newData[index];

      newData.splice(index, 1, {
        ...item,
        ...row
      });

      this.setState({ data: newData, editingKey: "", edit: true });
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  saveRateDelivery = async () => {
    this.setState({
      loadingButton: true
    });
    const rateData = [...this.state.data];
    let newData = [];
    let responseData = [];

    for (let data of rateData) {
      let op = API.post(`/rates/update`, {
        rate_kilometers: data.rate_kilometers,
        rate_price: data.rate_price,
        rate_details: data.rate_details
      });
      newData = [...newData, op];
    }
    let response = axios.all(newData);

    response
      .then(
        axios.spread((...args) => {
          for (let i = 0; i < args.length; i++) {
            responseData = [...responseData, args[i].data.data];
          }
          this.setState({
            loadingButton: false,
            edit: false,
            data: responseData
          });
        })
      )
      .catch(() => {
        this.setState({
          loadingButton: false,
          edit: false
        });
        this.error();
      });
  };

  fetchRateFromAPI = async () => {
    const rate = await API.get(`rates/`);
    const { data } = rate;
    console.log(data);
    this.setState({
      data: data.data,
      loading: false
    });
  };

  render() {
    const { loading, edit } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "rate_price" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <div>
        <Loading loaded={loading} />
        <Row>
          <h3>Rates Delivery</h3>
          <Divider />
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowKey="rate_id"
            rowClassName="editable-row"
            pagination={false}
          />
        </Row>
        <Row style={{ paddingTop: 15, textAlign: "center" }}>
          {edit && (
            <Button
              type="primary"
              loading={loading}
              onClick={() => this.saveRateDelivery()}
            >
              Save
            </Button>
          )}
        </Row>
      </div>
    );
  }
}

export default InfoRate;
