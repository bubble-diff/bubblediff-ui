import {
  Layout,
  Nav,
  Button,
  RadioGroup,
  Radio,
  Typography,
  Space,
  Toast,
} from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
  IconBytedanceLogo,
  IconGithubLogo,
  IconLink,
} from "@douyinfe/semi-icons";
import { Outlet } from "react-router-dom";
import UserInfo from "./components/userinfo";
import { useEffect } from "react";
import { getEmptyMessage, MsgType, useGlobalContext } from "./context";
import axios from "axios";

const renderMessage = (msg: string, type: MsgType) => {
  const opts = {
    content: msg,
    duration: 5,
  };
  switch (type) {
    case MsgType.Info:
      Toast.info(opts);
      break;
    case MsgType.Success:
      Toast.success(opts);
      break;
    case MsgType.Warn:
      Toast.warning(opts);
      break;
    case MsgType.Error:
      Toast.error(opts);
      break;
    default:
      break;
  }
};

const App = () => {
  const { Header, Footer, Content } = Layout;
  const { Title, Text } = Typography;
  const { user, setUser, message, setMessage } = useGlobalContext();

  // 尝试获取用户信息
  const getUser = async () => {
    // 如果user信息已存在，应立即返回
    if (user.id > 0) {
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt");
      const api = process.env.REACT_APP_GETUSER_API!;
      if (jwt) {
        const { data } = await axios.get(`${api}`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log(data);
        // 设置user context
        setUser({
          id: data.id,
          name: data.login,
          avatarUrl: data.avatar_url,
          email: data.email,
        });
        // 设置msg context
        setMessage({ msgType: MsgType.Success, msg: "登录成功！" });
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem("jwt");
      setMessage({
        msgType: MsgType.Error,
        msg: "当前会话已过期，请重新登录。",
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    // 消费信息，感觉这里实现不太优雅。
    if (message.msg) {
      renderMessage(message.msg, message.msgType);
      setMessage(getEmptyMessage());
    }
  }, [message]);

  return (
    <Layout style={{ border: "1px solid var(--semi-color-border)" }}>
      <Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <div>
          <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
            <Nav.Header>
              <Space>
                <IconSemiLogo style={{ fontSize: 36 }} />
                <Title heading={2}>BubbleDiff</Title>
              </Space>
            </Nav.Header>

            <Nav.Footer>
              <RadioGroup
                type="button"
                buttonSize="middle"
                defaultValue={1}
                aria-label="单选组合示例"
                style={{ marginRight: "12px" }}
              >
                <Radio value={1}>首页</Radio>
                <Radio value={2}>任务列表</Radio>
                <Radio value={3}>我的任务</Radio>
              </RadioGroup>

              <a href="https://github.com/bubble-diff">
                <Button
                  theme="borderless"
                  icon={<IconGithubLogo size="large" />}
                  style={{
                    color: "var(--semi-color-text-1)",
                    marginRight: "12px",
                  }}
                />
              </a>

              <UserInfo />
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Content
        style={{
          backgroundColor: "var(--semi-color-bg-0)",
        }}
      >
        <Outlet />
      </Content>
      <Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          color: "var(--semi-color-text-2)",
          backgroundColor: "rgba(var(--semi-grey-0), 1)",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconBytedanceLogo size="large" style={{ marginRight: "8px" }} />
          <span>
            BubbleDiff was designed by PeanutZhen 2022. All Rights Reserved.{" "}
          </span>
        </span>
        <Text
          link={{ href: "https://github.com/bubble-diff/bubblediff-ui/issues" }}
          icon={<IconLink />}
          underline
        >
          反馈建议
        </Text>
      </Footer>
    </Layout>
  );
};

export default App;
