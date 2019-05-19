import React, { useState, useCallback } from "react";
import { Table, Badge, Icon } from "antd";
import moment from "moment";
import "moment/locale/th";

import API from "../../../helpers/api.js";
moment.locale("th");

const DetailsIncomesComponent = ({
  emp_id,
  debt,
  payed,
  details,
  setNewDataAfterChangeSomeStatus
}) => {
  const [loading, setLoading] = useState(false);

  const fetchRequest = useCallback(
    async (status, inc_id, inc_total) => {
      setLoading(true);
      const url = status === "0" ? "update/success" : "update/processing";
      await API.post(`/incomes/${url}`, {
        inc_id: inc_id
      })
        .then(() => {
          let newDebt;
          let newPayed;
          const now = moment().format("YYYY-MM-DD hh:mm:ss");
          const newDetails = details.map(item => {
            if (item.inc_id === inc_id) {
              newDebt =
                status === "0"
                  ? parseFloat(debt) - parseFloat(inc_total)
                  : parseFloat(debt) + parseFloat(inc_total);
              newPayed =
                status === "1"
                  ? parseFloat(payed) - parseFloat(inc_total)
                  : parseFloat(payed) + parseFloat(inc_total);

              const newStatus = status === "0" ? "1" : "0";
              return { ...item, updated_at: now, inc_status: newStatus };
            }
            return item;
          });
          setNewDataAfterChangeSomeStatus(
            emp_id,
            newDetails,
            newDebt,
            newPayed
          );
        })
        .catch(err => {
          console.log(err);
        });
      setLoading(false);
    },
    [loading]
  );

  const expandedRowRender = () => {
    const columns = [
      {
        title: "Order",
        dataIndex: "order",
        key: "order",
        render: text => text.order_name
      },
      {
        title: "Rate",
        dataIndex: "inc_rate",
        key: "rate",
        render: text => `${text} %`
      },
      {
        title: "Divide",
        key: "divide",
        dataIndex: "inc_total",
        className: "column-money"
      },
      {
        title: "Date",
        key: "date",
        dataIndex: "created_at",
        render: text => moment(text).format("YYYY-MM-DD"),
        className: "column-money"
      },
      {
        title: "Lasted Update",
        key: "update",
        dataIndex: "updated_at",
        render: text => moment(text).format("YYYY-MM-DD hh:mm:ss"),
        className: "column-money"
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "inc_status",
        render: text => (
          <span>
            <Badge status={text === "0" ? "processing" : "success"} />
            {text === "0" ? "Owe" : "Payed"}
          </span>
        ),
        className: "column-money"
      },
      {
        title: "Change Status",
        key: "changestatus",
        dataIndex: "inc_status",
        render: (text, record) => {
          return text === "0" ? (
            <Icon
              type="check"
              className="pointer"
              onClick={() =>
                fetchRequest(text, record.inc_id, record.inc_total)
              }
            />
          ) : (
            <Icon
              type="close"
              className="pointer"
              onClick={() =>
                fetchRequest(text, record.inc_id, record.inc_total)
              }
            />
          );
        },
        className: "column-center"
      }
    ];
    return (
      <Table
        rowKey={record => record.inc_id}
        loading={loading}
        columns={columns}
        dataSource={details}
        pagination={false}
      />
    );
  };
  return <div>{expandedRowRender()}</div>;
};

export default DetailsIncomesComponent;
