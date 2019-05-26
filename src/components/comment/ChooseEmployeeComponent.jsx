import React, { Component } from "react";
import { Typography, Icon, Tooltip } from "antd";
import { List, Avatar } from "antd";
import EmployeeCommentComponent from "./EmployeeCommentComponent";
import API from "../../helpers/api.js";
import Loading from "../loaders/loading.js";

const { Title } = Typography;

class ChooseEmployeeComponent extends Component {
  state = {
    employees: [],
    edit: false,
    loading: true,
    empName: "",
    empId: ""
  };

  componentDidMount() {
    this.loadAllEmployee();
  }

  loadAllEmployee = async () => {
    const employees = await API.get("/employees/");
    const { data } = await employees;
    console.log(data);
    this.setState({
      employees: data.data,
      loading: false
    });
  };

  showCommentComponent = (empName, empId) => {
    this.setState({
      empName: empName,
      empId: empId,
      edit: true
    });
  };

  setBackButton = () => {
    this.setState({
      edit: false
    });
  };

  render() {
    const { employees, edit, loading, empName, empId } = this.state;
    return (
      <div>
        <Loading loaded={loading} />
        {!edit ? (
          <div>
            <Title>Choose Employee</Title>
            <List
              itemLayout="horizontal"
              dataSource={employees}
              renderItem={item => (
                <List.Item
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    this.showCommentComponent(`${item.emp_name} ${item.emp_lastname}`, item.emp_id)
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://kaidelivery-api.herokuapp.com/employees/${
                          item.emp_avatar
                        }`}
                      />
                    }
                    title={`${item.emp_name} ${item.emp_lastname}`}
                    description={
                      <Tooltip title="Rating">
                        <Icon
                          type="star"
                          theme="twoTone"
                          twoToneColor="#f4d942"
                        />
                        <span style={{ paddingLeft: 8, cursor: "auto" }}>
                          {item.rating === null
                            ? "3.00"
                            : parseFloat(item.rating).toFixed(2)}
                        </span>
                      </Tooltip>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        ) : (
          <EmployeeCommentComponent
            empName={empName}
            empId={empId}
            back={this.setBackButton}
          />
        )}
      </div>
    );
  }
}

export default ChooseEmployeeComponent;
