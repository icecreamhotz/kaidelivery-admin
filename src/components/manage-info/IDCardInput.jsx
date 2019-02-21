import React from 'react';
import { Input } from "antd";

class IDCardInput extends React.Component {
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
      emp_idcard: value.emp_idcard || ""
    };
  }

  handleNumberChange = e => {
    const emp_idcard = e.target.value.replace(/[^0-9.]+/g, "")
    if (!('value' in this.props)) {
      this.setState({ emp_idcard });
    }
    
    this.triggerChange({ emp_idcard });
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
          value={state.emp_idcard}
          onChange={this.handleNumberChange}
          style={{ width: "65%", marginRight: "3%" }}
        />
      </span>
    );
  }
}

export default IDCardInput;