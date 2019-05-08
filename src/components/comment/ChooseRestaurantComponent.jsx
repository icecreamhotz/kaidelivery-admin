import React, { Component } from "react";
import { Typography, Icon, Tooltip } from "antd";
import { List, Avatar } from "antd";
import RestaurantCommentComponent from "./RestaurantCommentComponent";
import API from "../../helpers/api.js";
import Loading from "../loaders/loading.js";

const { Title } = Typography;

class ChooseRestaurantComponent extends Component {
  state = {
    restaurants: [],
    edit: false,
    loading: true,
    resName: "",
    resId: ""
  };

  componentDidMount() {
    this.loadAllRestaurant();
  }

  loadAllRestaurant = async () => {
    const restaurants = await API.get("/restaurants/");
    const { data } = await restaurants;

    this.setState({
      restaurants: data.data,
      loading: false
    });
  };

  showCommentComponent = (resName, resId) => {
    this.setState({
      resName: resName,
      resId: resId,
      edit: true
    });
  };

  setBackButton = () => {
    this.setState({
      edit: false
    });
  };

  render() {
    const { restaurants, edit, loading, resName, resId } = this.state;
    return (
      <div>
        <Loading loaded={loading} />
        {!edit ? (
          <div>
            <Title>Choose The Restaurant</Title>
            <List
              itemLayout="horizontal"
              dataSource={restaurants}
              renderItem={item => (
                <List.Item
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    this.showCommentComponent(item.res_name, item.res_id)
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`http://localhost:3000/restaurants/${
                          item.res_logo
                        }`}
                      />
                    }
                    title={item.res_name}
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
          <RestaurantCommentComponent
            resName={resName}
            resId={resId}
            back={this.setBackButton}
          />
        )}
      </div>
    );
  }
}

export default ChooseRestaurantComponent;
