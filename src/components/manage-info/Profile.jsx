import React, { Component } from "react";
import { Tabs, Icon } from "antd";
import MyInfo from "./MyInfo";
import ChangePassword from './ChangePassword';

const TabPane = Tabs.TabPane;

class Profile extends Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                ข้อมูลทั่วไป
              </span>
            }
            key="1"
          >
            <MyInfo />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="android" />
                รหัสผ่าน
              </span>
            }
            key="2"
          >
            <ChangePassword />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Profile;
