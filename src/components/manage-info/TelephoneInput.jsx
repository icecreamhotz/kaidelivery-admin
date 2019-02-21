import React from 'react';
import { Input } from "antd";

class TelephoneInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || {})
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      emp_telephone: value.emp_telephone || ""
    };
  }

  handleNumberChange = e => {
    const emp_telephone = e.target.value.replace(/[^0-9.]+/g, "")
    if (!('value' in this.props)) {
      this.setState({ emp_telephone });
    }

    this.triggerChange({ emp_telephone });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const state = this.state;
    return (
      <span>
        <Input
          type="text"
          value={state.emp_telephone}
          onChange={this.handleNumberChange}
          style={{ width: "65%", marginRight: "3%" }}
        />
      </span>
    );
  }
}

export default TelephoneInput;