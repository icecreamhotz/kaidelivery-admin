import React from "react";
import { Input } from "antd";

class TimepickerInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || new Date())
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || new Date();
    this.state = {
      res_open: value.res_open,
      res_close: value.res_close
    };
  }

  handleNumberChange = e => {
    const telephone_one = e.target.value.replace(/[^0-9.]+/g, "");
    if (!("value" in this.props)) {
      this.setState({ telephone_one });
    }

    this.triggerChange({ telephone_one });
  };

  handleNumberChangeTwo = e => {
    const telephone_two = e.target.value.replace(/[^0-9.]+/g, "");
    if (!("value" in this.props)) {
      this.setState({ telephone_two });
    }

    this.triggerChange({ telephone_two });
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
          value={state.telephone_one}
          onChange={this.handleNumberChange}
          style={{ width: "48.50%", marginRight: "1.5%" }}
        />
        <Input
          type="text"
          value={state.telephone_two}
          onChange={this.handleNumberChangeTwo}
          style={{ width: "48.50%", marginLeft: "1.5%" }}
        />
      </span>
    );
  }
}

export default TimepickerInput;
