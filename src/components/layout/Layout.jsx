import React, { useState } from "react";
import { Layout, Menu, Icon } from "antd";
import "./layout.scss";
import { NavLink } from "react-router-dom";
import { logout } from '../../actions/user.js';
import { connect } from 'react-redux'

const { Header, Sider, Footer, Content } = Layout;
const SubMenu = Menu.SubMenu;

const menu = [
    {
        sub1: {
            
        }
    }
]

const HomePage = ({ children, logout }) => {
  const [collapsed, toggle] = useState(false);

  const onClickLogout = () => {
    logout()
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>จัดการข้อมูลผู้ใช้ระบบ</span>
              </span>
            }
          >
            <Menu.Item key="1">
              <NavLink to="/profile">ข้อมูลส่วนตัว</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
              <NavLink to="/employee">ข้อมูลพนักงาน</NavLink>
            </Menu.Item>
            <Menu.Item key="3">
              <NavLink to="/user">ข้อมูลลูกค้า</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="shop" />
                <span>จัดการข้อมูลร้านอาหาร</span>
              </span>
            }
          >
            <Menu.Item key="4">
              <NavLink to="/restaurant">ข้อมูลร้านอาหาร</NavLink>
            </Menu.Item>
            <Menu.Item key="5"><NavLink to="/foodchangelist">อนุมัติเปลี่ยนแปลงข้อมูล</NavLink></Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <Icon type="like" />
                <span>จัดการข้อมูลคำติชม</span>
              </span>
            }
          >
            <Menu.Item key="6"><NavLink to="/comment/restaurant">คำติชมร้านอาหาร</NavLink></Menu.Item>
            <Menu.Item key="7"><NavLink to="/comment/employee">คำติชมพนักงาน</NavLink></Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <Icon type="car" />
                <span>จัดการข้อมูลค่าจัดส่ง</span>
              </span>
            }
          >
            <Menu.Item key="8">
              <NavLink to="/rate">แก้ไขราคาค่าจัดส่ง</NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub5"
            title={
              <span>
                <Icon type="team" />
                <span>จัดการข้อมูลส่วนแบ่ง</span>
              </span>
            }
          >
            <Menu.Item key="9">ข้อมูลส่วนแบ่งพนักงาน</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub6"
            title={
              <span>
                <Icon type="calculator" />
                <span>จัดการข้อมูลบัญชี</span>
              </span>
            }
          >
            <Menu.Item key="10"><NavLink to="/ledger/account">ข้อมูลรายรับ</NavLink></Menu.Item>
            <Menu.Item key="11"><NavLink to="/ledger/expense">ข้อมูลรายจ่าย</NavLink></Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub7"
            title={
              <span>
                <Icon type="file-done" />
                <span>สรุปข้อมูลทั้งหมด</span>
              </span>
            }
          >
            <Menu.Item key="12"><NavLink to="/report/ledger">สรุปข้อมูลบัญชี</NavLink></Menu.Item>
            <Menu.Item key="13">สรุปข้อมูลรายได้</Menu.Item>
            <Menu.Item key="14">สรุปจำนวนผู้ใช้บริการ</Menu.Item>
            <Menu.Item key="15">สรุปข้อมูลรายได้ส่วนแบ่งร้านอาหาร</Menu.Item>
            <Menu.Item key="16">สรุปข้อมูลรายได้ส่วนแบ่งพนักงาน</Menu.Item>
          </SubMenu>
          <Menu.Item key="17">
            <Icon type="rocket" />
            <span>ติดตามตำแหน่งพนักงาน</span>
          </Menu.Item>
          <Menu.Item className="logout" onClick={() => onClickLogout()}>
            <Icon type="left-circle" />
            <span>ออกจากระบบ</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <div class="outer">
            <div class="left">
              <Icon
                className="trigger"
                type={collapsed ? "menu-unfold" : "menu-fold"}
                onClick={() => toggle(!collapsed)}
              />
            </div>
            <div class="right">Kai delivery Management System</div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "100vh",
            position: "relative"
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Kai delivery Chiang Mai ©2018 All right reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default connect(null , { logout })(HomePage);
