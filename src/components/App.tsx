import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { BarsOutlined } from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

// APP 采用AntD侧边布局
export default class App extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render(): React.ReactNode {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />

          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1" icon={<BarsOutlined />}>
              <Link to="/tasks">任务管理</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />

          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>任务管理</Breadcrumb.Item>
              <Breadcrumb.Item>所有任务</Breadcrumb.Item>
            </Breadcrumb>

            <Outlet />

            {/* <TaskTable /> */}
          </Content>

          <Footer style={{ textAlign: "center" }}>
            Bubble Diff ©2022 Designed by PeanutZhen
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
