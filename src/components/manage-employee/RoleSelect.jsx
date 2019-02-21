import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

const Option = Select.Option;

class RoleSelect extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || 1)
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || 1;
    this.state = {
      emptype_id: value
    };
  }

  handleChange = value => {
    if (!("value" in this.props)) {
      this.setState({ emptype_id: value });
    }
    this.triggerChange(value);
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { emptype_id } = this.state;
    const { role } = this.props;
    return (
      <div>
        <Select
          defaultValue={emptype_id}
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {role.map(item => (
            <Option key={item.emptype_id} value={item.emptype_id}>
              {item.emptype_name}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

RoleSelect.propTypes = {
  role: PropTypes.arrayOf(
    PropTypes.shape({
      emptype_id: PropTypes.number.isRequired,
      emptype_name: PropTypes.string.isRequired
    })
  ).isRequired
};

export default RoleSelect;
