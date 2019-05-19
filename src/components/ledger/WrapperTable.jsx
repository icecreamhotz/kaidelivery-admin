import React from "react";
import { Icon, Tooltip, Typography } from "antd";

const { Text } = Typography;

const TableWrapper = props => {
  const revSummary = props.children.reduce(
    (sum, i) =>
      i.props.record.type === "0"
        ? sum + parseFloat(i.props.record.price)
        : sum,
    0.0
  );
  const expSummary = props.children.reduce(
    (sum, i) =>
      i.props.record.type === "1"
        ? sum + parseFloat(i.props.record.price)
        : sum,
    0.0
  );
  const summary = props.children.reduce(
    (sum, i) =>
      i.props.record.type === "0"
        ? sum + parseFloat(i.props.record.price)
        : sum - parseFloat(i.props.record.price),
    0.0
  );
  console.log(expSummary);
  return (
    <tbody {...props}>
      <React.Fragment>
        {props.children}
        <tr className="ant-table-row">
          <td colspan="4" style={{ textAlign: "right" }}>
            <Text style={{ color: "#52c41a" }}>Revenue</Text>
            <Text>{` ${parseFloat(revSummary).toFixed(2)}`}</Text>
            <br />
            <Text style={{ color: "#fc2340" }}>Expenses</Text>
            <Text>{` ${parseFloat(expSummary).toFixed(2)}`}</Text>
          </td>
          <td colspan="3" style={{ textAlign: "right" }}>
            <Text
              style={{
                marginRight: 10,
                color: summary > 0 ? "#52c41a" : "#fc2340"
              }}
            >
              {summary > 0 ? "Profit" : "Loss"}
            </Text>
            <Tooltip title={summary > 0 ? "Profit" : "Loss"}>
              <Icon
                type={summary > 0 ? "arrow-up" : "arrow-down"}
                style={{ color: summary > 0 ? "#52c41a" : "#fc2340" }}
              />
              <span style={{ marginLeft: 10, fontWeight: "bold" }}>
                {parseFloat(summary).toFixed(2)}
              </span>
            </Tooltip>
          </td>
        </tr>
      </React.Fragment>
    </tbody>
  );
};

export default TableWrapper;
