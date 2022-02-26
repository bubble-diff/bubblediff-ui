import {
  Layout,
  Nav,
  Button,
  RadioGroup,
  Radio,
  Typography,
  Toast,
} from "@douyinfe/semi-ui";
import {
  IconBytedanceLogo,
  IconGithubLogo,
  IconLink,
} from "@douyinfe/semi-icons";
import { Outlet, useNavigate } from "react-router-dom";
import UserInfo from "./components/userinfo";
import { useEffect, useState } from "react";
import { useGlobalContext } from "./context";
import Logo from "./assets/logo.png";
import { RadioChangeEvent } from "@douyinfe/semi-ui/lib/es/radio";
import API from "./api";
import { JWT } from "./constants";

const App = () => {
  const { Header, Footer, Content } = Layout;
  const { Text } = Typography;
  const { user, setUser } = useGlobalContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");

  // 导航栏callback函数
  const onChange = (e: RadioChangeEvent) => {
    setTab(e.target.value);
    navigate(`/${e.target.value}`, { replace: true });
  };

  // 尝试获取用户信息
  const getUser = async () => {
    try {
      const jwt = localStorage.getItem(JWT);
      if (jwt) {
        const { data } = await API.get("/api/v1/userinfo", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log(data);
        setUser({
          id: data.id,
          login: data.login,
          avatar_url: data.avatar_url,
          email: data.email,
        });
      }
    } catch (err) {
      console.log(err);
      console.log("jwt maybe invalid, clear it...");
      localStorage.removeItem(JWT);
      Toast.error({ content: "当前会话已过期，请重新登录。", duration: 3 });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Layout
      style={{
        border: "1px solid var(--semi-color-border)",
        minHeight: "100vh",
      }}
    >
      <Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <div>
          <Nav mode="horizontal">
            <Nav.Header
              logo={<img src={Logo} alt="logo" />}
              text="BubbleDiff"
            />

            <RadioGroup
              type="button"
              buttonSize="middle"
              value={tab}
              onChange={onChange}
              style={{ marginRight: "12px" }}
            >
              <Radio value={""}>首页</Radio>
              <Radio value={"tasks"}>任务列表</Radio>
            </RadioGroup>

            <Nav.Footer>
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
      <Content style={{ backgroundColor: "var(--semi-color-bg-0)" }}>
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
