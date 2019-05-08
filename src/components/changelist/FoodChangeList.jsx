import React, { Component } from "react";
import { Typography, message } from "antd";
import { Card } from "antd";
import { Row, Col, Empty } from "antd";
import { Button } from "antd";
import moment from "moment";
import "moment/locale/th";
import Loading from "../loaders/loading.js";
import API from "../../helpers/api.js";

const { Title } = Typography;

moment.locale("th");

class FoodChangeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changeLists: [],
      hasData: false,
      loading: true
    };
  }

  componentDidMount() {
    this.loadAllChageList();
  }

  loadAllChageList = async () => {
    const changelists = await API.get("/changelists/");
    const { data } = await changelists;
    const changeListData = data.data;

    const filterChangeList = changeListData.map(item => {
      const filterFoods = item.foods.map(food => {
        if (food.changelists.length > 0) {
          return food;
        }
        return [];
      });
      const newFilterFoods = filterFoods.filter(list => {
        return typeof list.changelists !== "undefined";
      });
      const hasData = newFilterFoods.length > 0 ? true : false;
      return {
        res_name: item.res_name,
        foods: newFilterFoods,
        hasData: hasData
      };
    });
    const filterHasData = filterChangeList.filter(
      item => item.hasData === true
    );
    this.setState({
      changeLists: filterChangeList,
      hasData: filterHasData.length > 0 ? true : false,
      loading: false
    });
  };

  updateStatusChangeList = async changeId => {
    const update = await API.post("/changelists/update", {
      change_id: changeId
    });
    const { data } = await update;
    return data;
  };

  onClickUpdateStatusChangeListAndSaveChangeLog = async (food, status) => {
    this.setState({
      loading: true
    });

    const { changeLists } = this.state;

    const changeList = food.changelists[0];
    const updateChangeListStatus = await this.updateStatusChangeList(
      changeList.change_id
    );
    if (updateChangeListStatus.status) {
      const changeLogData = {
        changeId: changeList.change_id,
        oldFoodName: food.food_name,
        oldFoodPrice: food.food_price,
        newFoodName: changeList.food_name,
        newFoodPrice: changeList.food_newprice,
        changelogStatus: status,
        foodId: food.food_id
      };

      await API.post("/changelogs/", changeLogData)
        .then(() => {
          const newLists = changeLists.map(list => {
            const k = list.foods.filter(
              foodlist => foodlist.food_id !== food.food_id
            );
            const hasData = k.length > 0 ? true : false;
            return { res_name: list.res_name, foods: k, hasData: hasData };
          });
          const filterHasData = newLists.filter(item => item.hasData === true);
          message.success("Update Success");
          this.setState({
            loading: false,
            hasData: filterHasData.length > 0 ? true : false,
            changeLists: newLists
          });
        })
        .catch(() => {
          message.error("Something has wrong :(");
          this.setState({
            loading: false
          });
        });
    }
  };

  render() {
    const { changeLists, hasData, loading } = this.state;
    return (
      <div>
        <Loading loaded={loading} />
        <Title>Change Lists Request</Title>
        {hasData ? (
          changeLists.map(item => {
            if (item.foods.length > 0) {
              return (
                <Card title={item.res_name}>
                  {item.foods.map(food => {
                    const created_at = moment(
                      food.changelists[0].created_at
                    ).format("YYYY-MM-DD");
                    return (
                      <Card
                        type="inner"
                        title={`${food.food_name} -> ${
                          food.changelists[0].food_name
                        }`}
                        extra={created_at}
                      >
                        <Row>
                          <Col span={20}>
                            {" "}
                            {`${food.food_price}$ -> ${
                              food.changelists[0].food_newprice
                            }$`}
                          </Col>
                          <Col span={2}>
                            <Button
                              type="primary"
                              shape="circle"
                              icon="check"
                              onClick={() =>
                                this.onClickUpdateStatusChangeListAndSaveChangeLog(
                                  food,
                                  1
                                )
                              }
                            />
                          </Col>
                          <Col span={2}>
                            <Button
                              type="danger"
                              shape="circle"
                              icon="close"
                              onClick={() =>
                                this.onClickUpdateStatusChangeListAndSaveChangeLog(
                                  food,
                                  0
                                )
                              }
                            />
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}
                </Card>
              );
            }
            return "";
          })
        ) : (
          <Empty />
        )}
      </div>
    );
  }
}

export default FoodChangeList;
