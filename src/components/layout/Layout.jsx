import React, { useState } from "react";
import { Layout, Menu, Dropdown, Icon } from "antd";
import "./layout.scss";
import { NavLink } from "react-router-dom";
import { logout } from "../../actions/user.js";
import { localeSet } from "../../actions/locale.js";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import englishFlag from "../../resource/images/english.png";
import thailandFlag from "../../resource/images/thailand.png";

const { Header, Sider, Footer, Content } = Layout;
const SubMenu = Menu.SubMenu;

const HomePage = ({ children, logout, lang, localeSet, role }) => {
  const [collapsed, toggle] = useState(false);

  const onClickLogout = () => {
    logout();
  };

  const localeMenu = (
    <Menu>
      <Menu.Item key="0">
        <img
          src={lang === "th" ? englishFlag : thailandFlag}
          alt="locale"
          onClick={() => localeSet(lang === "en" ? "th" : "en")}
        />{" "}
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220}>
        <div className="logo" />
        {role === 1 && (
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
                  <span>
                    <FormattedMessage id="nav.leftnavone" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="1">
                <NavLink to="/profile">
                  <FormattedMessage id="nav.leftnavtwo" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="2">
                <NavLink to="/employee">
                  <FormattedMessage id="nav.leftnavthree" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to="/user">
                  <FormattedMessage id="nav.leftnavfour" />
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="shop" />
                  <span>
                    <FormattedMessage id="nav.leftnavfive" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="4">
                <NavLink to="/restaurant">
                  <FormattedMessage id="nav.leftnavsix" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="5">
                <NavLink to="/foodchangelist">
                  <FormattedMessage id="nav.leftnavseven" />
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="like" />
                  <span>
                    <FormattedMessage id="nav.leftnaveight" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="6">
                <NavLink to="/comment/restaurant">
                  <FormattedMessage id="nav.leftnavnine" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="7">
                <NavLink to="/comment/employee">
                  <FormattedMessage id="nav.leftnavten" />
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={
                <span>
                  <Icon type="car" />
                  <span>
                    <FormattedMessage id="nav.leftnavteleven" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="8">
                <NavLink to="/rate">
                  <FormattedMessage id="nav.leftnavtwelve" />
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub5"
              title={
                <span>
                  <Icon type="calculator" />
                  <span>
                    <FormattedMessage id="nav.leftnavfiveteen" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="9">
                <NavLink to="/ledger/account">
                  <FormattedMessage id="nav.leftnavsixteen" />
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub6"
              title={
                <span>
                  <Icon type="file-done" />
                  <span>
                    <FormattedMessage id="nav.leftnavseventeen" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="10">
                <NavLink to="/report/ledger">
                  <FormattedMessage id="nav.leftnaveightteen" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="11">
                <NavLink to="/report/employee/income">
                  <FormattedMessage id="nav.leftnavnineteen" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="12">
                <NavLink to="/report/restaurant/user">
                  <FormattedMessage id="nav.leftnavtwenty" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="13">
                <NavLink to="/report/restaurant/share">
                  <FormattedMessage id="nav.leftnavtwentyone" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="14">
                <NavLink to="/report/employee/salary">
                  <FormattedMessage id="nav.leftnavtwentytwo" />
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="15">
              <Icon type="rocket" />
              <span>
                <FormattedMessage id="nav.leftnavtwentythree" />
              </span>
            </Menu.Item>
            <Menu.Item className="logout" onClick={() => onClickLogout()}>
              <Icon type="left-circle" />
              <span>
                <FormattedMessage id="nav.leftnavtwentyfour" />
              </span>
            </Menu.Item>
          </Menu>
        )}
        {role === 4 && (
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
                  <span>
                    <FormattedMessage id="nav.leftnavone" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="1">
                <NavLink to="/employee">
                  <FormattedMessage id="nav.leftnavthree" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="2">
                <NavLink to="/user">
                  <FormattedMessage id="nav.leftnavfour" />
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item className="logout" onClick={() => onClickLogout()}>
              <Icon type="left-circle" />
              <span>
                <FormattedMessage id="nav.leftnavtwentyfour" />
              </span>
            </Menu.Item>
          </Menu>
        )}
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <div className="outer">
            <div className="left">
              <Icon
                className="trigger"
                type={collapsed ? "menu-unfold" : "menu-fold"}
                onClick={() => toggle(!collapsed)}
              />
            </div>
            <div className="right">
              <FormattedMessage id="nav.title" />
            </div>
            <div className="locale">
              {" "}
              <Dropdown overlay={localeMenu} trigger={["click"]}>
                <a className="ant-dropdown-link" href="#">
                  <img
                    src={lang === "en" ? englishFlag : thailandFlag}
                    alt="locale"
                  />{" "}
                </a>
              </Dropdown>
            </div>
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

function mapStateToProps(state) {
  return {
    lang: state.locale.lang,
    role: state.employee.role
  };
}

export default connect(
  mapStateToProps,
  { logout, localeSet }
)(HomePage);
