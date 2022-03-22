import {
  Layout,
  Nav,
  Button,
  Typography,
  Toast,
} from "@douyinfe/semi-ui";
import {
  IconBytedanceLogo,
  IconGithubLogo,
  IconLink,
  IconHome,
  IconListView,
} from "@douyinfe/semi-icons";
import { Outlet, useNavigate } from "react-router-dom";
import UserInfo from "./components/userinfo";
import { useEffect, useState } from "react";
import { useGlobalContext } from "./context";
import Logo from "./assets/logo.png";
import API from "./api";
import { JWT } from "./constants";

const App = () => {
  const { Header, Footer, Content } = Layout;
  const { Text } = Typography;
  const { user, setUser } = useGlobalContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState(["home"]);

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
          <Nav
            mode="horizontal"
            defaultSelectedKeys={tab}
            onClick={(data) => {
              setTab([data.itemKey.toString()]);
              if (data.itemKey === "home") {
                navigate("/", { replace: true });
                return;
              }
              navigate(`/${data.itemKey}`, { replace: true });
            }}
          >
            <Nav.Header
              logo={<img src={Logo} alt="logo" />}
              text="BubbleDiff"
            />

            <Nav.Item itemKey={"home"} text={"首页"} icon={<IconHome />} />
            <Nav.Item
              itemKey={"tasks"}
              text={"任务列表"}
              icon={<IconListView />}
            />

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
