import React, { useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
import './layout.scss'
import { NavLink } from 'react-router-dom'

const { Header, Sider, Footer, Content } = Layout;
const SubMenu = Menu.SubMenu;


const HomePage = ({ children }) => {

    const [collapsed, toggle] = useState(false);
    
    return (
        <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={220}
                >
                <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="user" /><span>จัดการข้อมูลผู้ใช้ระบบ</span></span>}
                            >
                            <Menu.Item key="1"><NavLink to="/profile">ข้อมูลส่วนตัว</NavLink></Menu.Item>
                            <Menu.Item key="2"><NavLink to="/employee">ข้อมูลพนักงาน</NavLink></Menu.Item>
                            <Menu.Item key="3"><NavLink to="/user">ข้อมูลลูกค้า</NavLink></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={<span><Icon type="shop" /><span>จัดการข้อมูลร้านอาหาร</span></span>}
                            >
                            <Menu.Item key="4">ข้อมูลร้านอาหาร</Menu.Item>
                            <Menu.Item key="5">อนุมัติร้านอาหาร</Menu.Item>
                            <Menu.Item key="6">อนุมัติเปลี่ยนแปลงข้อมูล</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={<span><Icon type="like" /><span>จัดการข้อมูลคำติชม</span></span>}
                            >
                            <Menu.Item key="7">คำติชมร้านอาหาร</Menu.Item>
                            <Menu.Item key="8">คำติชมพนักงาน</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub4"
                            title={<span><Icon type="car" /><span>จัดการข้อมูลค่าจัดส่ง</span></span>}
                            >
                            <Menu.Item key="9">แก้ไขราคาค่าจัดส่ง</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub5"
                            title={<span><Icon type="team" /><span>จัดการข้อมูลส่วนแบ่ง</span></span>}
                            >
                            <Menu.Item key="10">ข้อมูลส่วนแบ่งพนักงาน</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub6"
                            title={<span><Icon type="calculator" /><span>จัดการข้อมูลบัญชี</span></span>}
                            >
                            <Menu.Item key="11">ข้อมูลรายรับ</Menu.Item>
                            <Menu.Item key="12">ข้อมูลรายจ่าย</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub7"
                            title={<span><Icon type="file-done" /><span>สรุปข้อมูลทั้งหมด</span></span>}
                            >
                            <Menu.Item key="13">สรุปข้อมูลบัญชี</Menu.Item>
                            <Menu.Item key="14">สรุปข้อมูลรายได้</Menu.Item>
                            <Menu.Item key="15">สรุปจำนวนผู้ใช้บริการ</Menu.Item>
                            <Menu.Item key="16">สรุปข้อมูลรายได้ส่วนแบ่งร้านอาหาร</Menu.Item>
                            <Menu.Item key="17">สรุปข้อมูลรายได้ส่วนแบ่งพนักงาน</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="18">
                            <Icon type="rocket" />
                            <span>ติดตามตำแหน่งพนักงาน</span>
                        </Menu.Item>
                        <Menu.Item className="logout">
                            <Icon type="left-circle"/>
                            <span>ออกจากระบบ</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={() => toggle(!collapsed)}
                        />
                    </Header>
                    <Content style={{
                        margin: '24px 16px', padding: 24, background: '#fff', minHeight: '100vh', position: 'relative'
                    }}
                    >
                        { children }
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Kai delivery Chiang Mai ©2018 All right reserved
                    </Footer>
                </Layout>
            </Layout>
    )
}

export default HomePage;