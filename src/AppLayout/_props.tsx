import { BarsOutlined, SmileOutlined, UserOutlined } from "@ant-design/icons";
import { BasicLayoutProps } from "@ant-design/pro-layout";
import { Avatar, Space } from "antd";

const defaultProps: BasicLayoutProps = {
  // 左上角标题
  title: "Bubble Diff",
  // 固定左侧菜单栏
  fixSiderbar: true,
  // 亮色主题
  navTheme: "light",
  // 侧边布局
  layout: "mix",
  // 流式内容
  contentWidth: "Fluid",
  // header高度
  headerHeight: 48,
  // 主题色
  primaryColor: "#1890ff",
  // 水印属性，只是用于传给下级的PageContainer用
  waterMarkProps: {
    // todo: 更换成当前登录用户名
    content: "Bubble Diff",
  },
  // 点击菜单栏header的动作
  onMenuHeaderClick: (e) => console.log("fuck"),
  // 头部菜单栏右侧的dom
  rightContentRender: () => (
    <div>
      <Space>
        <Avatar shape="circle" size="small" icon={<UserOutlined />} />
      </Space>
    </div>
  ),
  // 定义menu的内容
  route: {
    path: "/",
    routes: [
      {
        path: "/",
        name: "欢迎",
        icon: <SmileOutlined />,
      },
      {
        path: "/tasks",
        name: "任务管理",
        icon: <BarsOutlined />,
        // 不显示子选项
        hideChildrenInMenu: true,
        routes: [
          {
            path: "/tasks/add",
            name: "新建任务",
          },
        ],
      },
    ],
  },
};

export default defaultProps;
